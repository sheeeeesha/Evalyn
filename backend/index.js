const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { db } = require("./firebase");
const { sendCandidateScoreEmail, sendSubmissionConfirmationEmail, sendInviteEmail } = require("./utils/mailer");
const fetch = require("node-fetch"); // Add this if not using Node 18+
const bcrypt = require("bcryptjs");

function cleanUndefined(obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(cleanUndefined);
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, cleanUndefined(v)])
  );
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("TES Backend Live"));

/**
 * Register Organization (Scalable)
 * POST /register-org
 * Body: { admin, orgInfo, setup }
 */
app.post("/register-org", async (req, res) => {
  const { admin, orgInfo, setup } = req.body;
  if (!admin || !orgInfo || !setup) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1. Check for duplicate domain
    const orgsRef = db.collection("organizations");
    const domainSnapshot = await orgsRef.where("emailDomain", "==", orgInfo.emailDomain).get();
    if (!domainSnapshot.empty) {
      return res.status(409).json({ error: "Organization with this email domain already exists.", joinOrgId: domainSnapshot.docs[0].id });
    }

    // 2. Create organization
    const orgRef = orgsRef.doc();
    const orgId = orgRef.id;
    const orgData = {
      orgId,
      ...orgInfo,
      members: [],
      setup: {
        workspaceName: setup.workspaceName,
        evaluationForm: setup.evaluationForm,
        branding: setup.branding,
      },
      createdAt: new Date().toISOString(),
    };
    await orgRef.set(cleanUndefined(orgData));

    // 3. Create superadmin user
    const usersRef = db.collection("users");
    const passwordHash = await bcrypt.hash(admin.password, 10);
    const userRef = usersRef.doc();
    const userId = userRef.id;
    const userData = {
      userId,
      name: admin.name,
      email: admin.email,
      passwordHash,
      phone: admin.phone || "",
      orgs: [orgId],
      role: "superadmin",
      status: "active",
      createdAt: new Date().toISOString(),
    };
    await userRef.set(cleanUndefined(userData));

    // Add superadmin to org's members
    await orgRef.update({ members: [userId] });

    // 4. Invite teammates
    const invitesRef = db.collection("invites");
    const failedInvites = [];
    for (const teammate of setup.teammates || []) {
      // Check if user exists
      const userSnap = await usersRef.where("email", "==", teammate.email).get();
      if (!userSnap.empty) {
        // User exists, add orgId to their orgs and set status active
        const teammateId = userSnap.docs[0].id;
        const teammateData = userSnap.docs[0].data();
        const updatedOrgs = Array.isArray(teammateData.orgs) ? [...new Set([...(teammateData.orgs || []), orgId])] : [orgId];
        await usersRef.doc(teammateId).update({ orgs: updatedOrgs, status: "active" });
        // Add to org's members
        await orgRef.update({ members: [...orgData.members, teammateId] });
      } else {
        // User does not exist, create invite
        const inviteRef = await invitesRef.add(cleanUndefined({
          orgId,
          email: teammate.email,
          name: teammate.name,
          role: teammate.role,
          status: "pending",
          invitedBy: userId,
          createdAt: new Date().toISOString(),
        }));
        // Send invite email
        try {
          const inviteLink = `${process.env.FRONTEND_BASE_URL || "http://localhost:3000"}/org/accept-invite?inviteId=${inviteRef.id}`;
          await sendInviteEmail({
            to: teammate.email,
            name: teammate.name,
            orgName: orgInfo.orgName,
            role: teammate.role,
            inviteLink,
          });
        } catch (emailErr) {
          console.error("Failed to send invite email:", emailErr);
          failedInvites.push(teammate.email);
          // Update invite status to email_failed
          await inviteRef.update({ status: "email_failed", emailError: emailErr.message || String(emailErr) });
        }
      }
    }

    return res.status(201).json({ success: true, orgId, userId, message: "Organization and admin registered. Invites sent to teammates.", failedInvites });
  } catch (err) {
    console.error("/register-org error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/verify-org", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const usersRef = db.collection("users");
    const userSnap = await usersRef.where("email", "==", email).get();

    if (userSnap.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userSnap.docs[0].data();
    if (!user.orgs || user.orgs.length === 0) {
      return res.status(404).json({ error: "No organization found for this user." });
    }

    // Optionally, return all orgs or just the first one
    return res.status(200).json({ orgs: user.orgs, userId: user.userId, role: user.role, status: user.status });
  } catch (err) {
    console.error("Error verifying org:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/save-form", async (req, res) => {
  const { orgId, formName, cutoff, sections, domains, llmPrompt, llmConfig } = req.body;

  if (!orgId || !formName || !sections) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Ensure each question and rubric has a weight
    const normalizedSections = (sections || []).map(section => ({
      ...section,
      questions: (section.questions || []).map(q => ({
        ...q,
        weight: typeof q.weight === "number" ? q.weight : 1, // default weight 1
        rubrics: (q.rubrics || []).map(r =>
          typeof r === "object"
            ? { ...r, weight: typeof r.weight === "number" ? r.weight : 1 }
            : { label: r, weight: 1 }
        ),
      })),
    }));

    const defaultLlmConfig = {
      provider: "openrouter",
      model: "moonshot/kimi-k2",
      temperature: 0.2,
      top_p: 0.95,
      max_tokens: 300,
      presence_penalty: 0,
      frequency_penalty: 0,
    };

    const formRef = db
      .collection("organizations")
      .doc(orgId)
      .collection("forms")
      .doc(); // auto ID

    await formRef.set({
      formName,
      cutoff,
      sections: normalizedSections,
      domains: domains || [],
      llmPrompt: llmPrompt || "",
      llmConfig: llmConfig || defaultLlmConfig,
      createdAt: new Date().toISOString(),
    });

    return res.status(200).json({ success: true, formId: formRef.id });
  } catch (err) {
    console.error("Error saving form:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/get-form/:formId", async (req, res) => {
  const { formId } = req.params;

  try {
    // Find orgId from any organization (search all)
    const orgsSnapshot = await db.collection("organizations").get();

    for (const orgDoc of orgsSnapshot.docs) {
      const formDoc = await db
        .collection("organizations")
        .doc(orgDoc.id)
        .collection("forms")
        .doc(formId)
        .get();

      if (formDoc.exists) {
        return res.status(200).json({
          form: {
            ...formDoc.data(),
            formId,
            orgId: orgDoc.id,
          },
        });
      }
    }

    return res.status(404).json({ error: "Form not found" });
  } catch (error) {
    console.error("Get form error:", error);
    return res.status(500).json({ error: "Failed to fetch form" });
  }
});


// Updated LLM evaluation function for rubricDetails and weights
async function evaluateWithLLM({ responses, rubricDetails, llmPrompt, domains, llmConfig }) {
  console.log("evaluateWithLLM called with llmConfig:", llmConfig);
  
  // Compose the prompt for the LLM
  const userContent = `
Domains: ${domains.join(", ")}
Prompt: ${llmPrompt}

Candidate Responses and Rubrics (with weights):
${responses.map((resp, i) => {
  const q = rubricDetails[i] || {};
  return `Q${i + 1}: ${q.label || resp.label} (Weight: ${q.weight || 1})\nAnswer: ${resp.answer}\nRubrics:\n${(q.rubrics || [])
    .map(
      (r, j) =>
        `  - ${r.label} (Weight: ${r.weight || 1}): ${r.description || ""}`
    )
    .join("\n")}`;
}).join("\n\n")}

Instructions: For each question, score each rubric (0-100) based on the answer and rubric description. Then, calculate a weighted score for the question using rubric weights. Finally, aggregate all question scores using their weights to provide a total score (0-100). Return a JSON object with the following structure:\n{\n  \"questions\": [\n    {\n      \"label\": \"...\",\n      \"score\": <number>,\n      \"rubricScores\": [<number>, ...],\n      \"justification\": \"...\"\n    },\n    ...\n  ],\n  \"totalScore\": <number>,\n  \"justification\": \"...\"\n}\n`;

  // Use llmConfig or defaults
  const {
    provider = "openrouter",
    model = "moonshot/kimi-k2",
    temperature = 0.2,
    top_p = 0.95,
    max_tokens = 300,
    presence_penalty = 0,
    frequency_penalty = 0,
  } = llmConfig || {};

  let apiUrl = "https://openrouter.ai/api/v1/chat/completions";
  let apiKey = process.env.OPENROUTER_API_KEY;
  let headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  };
  let body = {
    model,
    messages: [
      { role: "system", content: "You are an expert evaluator. Score the candidate's answers based on the rubrics, weights, and prompt. Return a JSON object as instructed." },
      { role: "user", content: userContent }
    ],
  };

  // Route based on provider
  if (provider === "openai") {
    apiUrl = "https://api.openai.com/v1/chat/completions";
    apiKey = process.env.OPENAI_API_KEY;
    headers["Authorization"] = `Bearer ${apiKey}`;
    // Only send supported params
    body.temperature = temperature;
    body.top_p = top_p;
    body.max_tokens = max_tokens;
    body.presence_penalty = presence_penalty;
    body.frequency_penalty = frequency_penalty;
  } else if (provider === "anthropic") {
    apiUrl = "https://api.anthropic.com/v1/messages";
    apiKey = process.env.ANTHROPIC_API_KEY;
    headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    };
    // Anthropic uses different param names
    body = {
      model,
      max_tokens,
      temperature,
      system: "You are an expert evaluator. Score the candidate's answers based on the rubrics, weights, and prompt. Return a JSON object as instructed.",
      messages: [
        { role: "user", content: userContent }
      ],
    };
  } else if (provider === "google") {
    apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + process.env.GOOGLE_API_KEY;
    // Google Gemini uses a different structure
    headers = { "Content-Type": "application/json" };
    body = {
      contents: [
        { role: "user", parts: [{ text: userContent }] }
      ],
      generationConfig: {
        temperature,
        topP: top_p,
        maxOutputTokens: max_tokens,
        presencePenalty: presence_penalty,
        frequencyPenalty: frequency_penalty,
      },
    };
  } else {
    // Default to OpenRouter
    apiUrl = "https://openrouter.ai/api/v1/chat/completions";
    apiKey = process.env.OPENROUTER_API_KEY;
    headers["Authorization"] = `Bearer ${apiKey}`;
    body.temperature = temperature;
    body.top_p = top_p;
    body.max_tokens = max_tokens;
    body.presence_penalty = presence_penalty;
    body.frequency_penalty = frequency_penalty;
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("LLM API error response:", errorText);
    console.error("API URL:", apiUrl);
    console.error("Model:", model);
    console.error("Provider:", provider);
    console.error("API Key present:", !!apiKey);
    console.error("Request body:", JSON.stringify(body, null, 2));
    throw new Error(`LLM API call failed: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  // OpenRouter/OpenAI/Anthropic: extract content
  let content = "";
  if (provider === "anthropic" && data.content) {
    content = Array.isArray(data.content) ? data.content.map(c => c.text).join("\n") : data.content;
  } else if (provider === "google" && data.candidates) {
    content = data.candidates[0]?.content?.parts?.[0]?.text || "";
  } else {
    content = data.choices?.[0]?.message?.content || "";
  }

  // Try to robustly parse as JSON
  let totalScore = null;
  let justification = content;
  let questionBreakdown = null;
  let jsonString = content.trim();
  // Remove markdown code block if present
  if (jsonString.startsWith('```json')) {
    jsonString = jsonString.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (jsonString.startsWith('```')) {
    jsonString = jsonString.replace(/^```/, '').replace(/```$/, '').trim();
  }
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed === "object" && parsed.totalScore !== undefined) {
      totalScore = parsed.totalScore;
      justification = parsed.justification || content;
      questionBreakdown = parsed.questions || null;
    }
  } catch {
    // Not JSON, fallback to regex
    const scoreMatch = content.match(/totalScore[:\s]*([0-9]{1,3})/i);
    totalScore = scoreMatch ? parseInt(scoreMatch[1], 10) : null;
    justification = content;
  }

  return {
    aiScore: totalScore,
    aiJustification: justification,
    questionBreakdown,
  };
}

app.post("/submit-form", async (req, res) => {
  const body = req.body;
  const {
    orgId,
    formId,
    candidateName,
    candidateEmail,
    phone,
    submittedAt,
  } = body;

  console.log("Form submission received:", { orgId, formId, candidateName, candidateEmail });

  try {
    // Validate required fields
    if (!orgId || !formId || !candidateName || !candidateEmail) {
      console.error("Missing required fields:", { orgId, formId, candidateName, candidateEmail });
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch form details for LLM evaluation
    const formDoc = await db
      .collection("organizations")
      .doc(orgId)
      .collection("forms")
      .doc(formId)
      .get();
    if (!formDoc.exists) {
      console.error("Form not found:", { orgId, formId });
      return res.status(404).json({ error: "Form not found" });
    }
    const formData = formDoc.data();
    console.log("Form data retrieved successfully");

    // Save submission first (without score)
    const submissionRef = await db
      .collection("organizations")
      .doc(orgId)
      .collection("submissions")
      .add({
        formId,
        candidateName,
        candidateEmail,
        phone,
        submittedAt,
        responses: body.responses,
        scored: false,
        score: null,
        aiScore: null,
        aiJustification: null,
        evaluationEmailSent: false,
        domains: formData.domains || [],
        llmPrompt: formData.llmPrompt || "",
        // rubrics field removed to avoid nested arrays
        questionWeights: (formData.sections || []).flatMap(section =>
          (section.questions || []).map(q => q.weight || 1)
        ),
      });

    console.log("Submission saved successfully");

    // Prepare rubric details for LLM
    const rubricDetails = (formData.sections || []).flatMap(section =>
      (section.questions || []).map(q => ({
        label: q.label,
        weight: q.weight || 1,
        rubrics: (q.rubrics || []).map(r =>
          typeof r === "object"
            ? { label: r.label, weight: r.weight || 1, description: r.description || "" }
            : { label: r, weight: 1, description: "" }
        ),
      }))
    );

    console.log("Rubric details prepared, calling LLM evaluation");
    console.log("LLM Config received:", formData.llmConfig);
    console.log("Model being used:", formData.llmConfig.model);
    console.log("Provider being used:", formData.llmConfig.provider);

    // Call LLM evaluation with rubric weights and llmConfig
    let llmResult = { aiScore: null, aiJustification: "Evaluation pending", questionBreakdown: null };
    try {
      llmResult = await evaluateWithLLM({
        responses: body.responses,
        rubricDetails,
        llmPrompt: formData.llmPrompt || "",
        domains: formData.domains || [],
        llmConfig: formData.llmConfig || {},
      });
      console.log("LLM evaluation completed:", { aiScore: llmResult.aiScore });
    } catch (llmError) {
      console.error("LLM evaluation failed:", llmError);
      // Continue with default values if LLM fails
      llmResult = { 
        aiScore: null, 
        aiJustification: "AI evaluation failed. Manual review required.", 
        questionBreakdown: null 
      };
    }

    const updateData = {
      aiJustification: llmResult.aiJustification,
      scored: true,
    };

    if (
      typeof llmResult.aiScore === "number" &&
      !isNaN(llmResult.aiScore)
    ) {
      updateData.aiScore = llmResult.aiScore;
      updateData.score = llmResult.aiScore;
    }
    if (llmResult.questionBreakdown) {
      updateData.questionBreakdown = llmResult.questionBreakdown;
    }

    await submissionRef.update(updateData);
    console.log("Submission updated with LLM results");

    // Send confirmation email to candidate (not evaluation)
    try {
      await sendSubmissionConfirmationEmail({
        to: candidateEmail,
        name: candidateName,
        formName: formData.formName || "the evaluation form",
      });
      console.log("Confirmation email sent");
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the submission if email fails
    }

    // --- FLOW INTEGRATION ---
    // If candidateId and flowId are present, update candidate progress and advance
    const { candidateId, flowId } = body;
    if (candidateId && flowId) {
      try {
        // Fetch candidate progress
        const progressRef = db.collection("candidateProgress").doc(`${flowId}_${candidateId}`);
        const progressDoc = await progressRef.get();
        if (progressDoc.exists) {
          // Determine pass/fail for this stage
          let passed = true;
          // Find the flow and stage
          const flowDoc = await db.collection("formFlows").doc(flowId).get();
          if (flowDoc.exists) {
            const flow = flowDoc.data();
            const progress = progressDoc.data();
            const stageIdx = progress.currentStage;
            const stage = flow.stages[stageIdx];
            if (stage && typeof stage.cutoff === "number" && typeof updateData.aiScore === "number") {
              passed = updateData.aiScore >= stage.cutoff;
            }
            // Advance candidate in flow
            await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/org/${orgId}/flows/${flowId}/candidate/${candidateId}/advance`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ score: updateData.aiScore, passed, candidateName }),
              }
            );
          }
        }
      } catch (flowErr) {
        console.error("Flow advancement error:", flowErr);
      }
    }

    console.log("Form submission completed successfully");
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({ error: "Failed to submit form", details: err.message });
  }
});

// GET /org/:orgId/submissions
app.get("/org/:orgId/submissions", async (req, res) => {
  const { orgId } = req.params;

  try {
    const snapshot = await db
      .collection("organizations")
      .doc(orgId)
      .collection("submissions")
      .orderBy("submittedAt", "desc")
      .get();

    const submissions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ submissions });
  } catch (err) {
    console.error("Error fetching submissions", err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});


// PATCH /org/:orgId/submissions/:submissionId
app.patch("/org/:orgId/submissions/:submissionId", async (req, res) => {
  const { orgId, submissionId } = req.params;
  const { score, remarks, scored, manualScore, finalScore, finalRemarks, evaluationEmailSent, userId, userName, overrideReason } = req.body;

  try {
    // Fetch current submission for old score
    const submissionRef = db
      .collection("organizations")
      .doc(orgId)
      .collection("submissions")
      .doc(submissionId);
    const submissionSnap = await submissionRef.get();
    const prev = submissionSnap.exists ? submissionSnap.data() : {};

    // Prepare update object
    const updateObj = {
      score,
      remarks,
      scored,
      manualScore,
      finalScore,
      finalRemarks,
      evaluationEmailSent,
      evaluatedAt: new Date().toISOString(),
    };

    // If this is an override (finalScore, userId, userName, overrideReason present)
    if (
      typeof finalScore === "number" &&
      userId &&
      userName &&
      overrideReason
    ) {
      // Prepare override record
      const overrideRecord = {
        userId,
        userName,
        timestamp: new Date().toISOString(),
        oldScore: prev.finalScore ?? prev.score ?? null,
        newScore: finalScore,
        reason: overrideReason,
      };
      // Use arrayUnion if available, else manual append
      if (submissionSnap.exists && Array.isArray(prev.overrides)) {
        updateObj.overrides = [...prev.overrides, overrideRecord];
      } else {
        updateObj.overrides = [overrideRecord];
      }
    }

    await submissionRef.update(updateObj);

    // ✅ Fetch updated submission to get candidate email/name
    const updatedDoc = await submissionRef.get();
    const submission = updatedDoc.data();

    // ✉️ Send email to the candidate if evaluationEmailSent is true and was just set
    if (evaluationEmailSent) {
      await sendCandidateScoreEmail({
        to: submission.candidateEmail,
        name: submission.candidateName,
        score: submission.finalScore || submission.score,
        remarks: submission.remarks,
      });
    }

    // 🎉 Success
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("🔥 Firestore update or email send failed:", error);
    res.status(500).json({ error: "Failed to update submission or send email" });
  }
});



// GET /org/:orgId/submissions/:submissionId
app.get("/org/:orgId/submissions/:submissionId", async (req, res) => {
  const { orgId, submissionId } = req.params;

  try {
    const doc = await db
      .collection("organizations")
      .doc(orgId)
      .collection("submissions")
      .doc(submissionId)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Submission not found" });
    }

    res.status(200).json({ submission: doc.data() });
  } catch (err) {
    console.error("Error fetching submission:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /org/:orgId/forms - fetch all forms for an org, sorted by creation date (latest first)
app.get("/org/:orgId/forms", async (req, res) => {
  const { orgId } = req.params;
  try {
    const snapshot = await db
      .collection("organizations")
      .doc(orgId)
      .collection("forms")
      .orderBy("createdAt", "desc")
      .get();
    const forms = snapshot.docs.map((doc) => ({
      formId: doc.id,
      ...doc.data(),
    }));
    res.status(200).json({ forms });
  } catch (err) {
    console.error("Error fetching forms", err);
    res.status(500).json({ error: "Failed to fetch forms" });
  }
});

// DELETE /org/:orgId/forms/:formId - delete a form for an org
app.delete("/org/:orgId/forms/:formId", async (req, res) => {
  const { orgId, formId } = req.params;
  try {
    await db
      .collection("organizations")
      .doc(orgId)
      .collection("forms")
      .doc(formId)
      .delete();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error deleting form", err);
    res.status(500).json({ error: "Failed to delete form" });
  }
});

app.patch("/org/:orgId/forms/:formId", async (req, res) => {
  const { orgId, formId } = req.params;
  const { formName, cutoff, sections, domains, llmPrompt, llmConfig } = req.body;
  try {
    // Normalize as above
    const normalizedSections = (sections || []).map(section => ({
      ...section,
      questions: (section.questions || []).map(q => ({
        ...q,
        weight: typeof q.weight === "number" ? q.weight : 1,
        rubrics: (q.rubrics || []).map(r =>
          typeof r === "object"
            ? { ...r, weight: typeof r.weight === "number" ? r.weight : 1 }
            : { label: r, weight: 1 }
        ),
      })),
    }));
    const defaultLlmConfig = {
      provider: "openrouter",
      model: "moonshot/kimi-k2",
      temperature: 0.2,
      top_p: 0.95,
      max_tokens: 300,
      presence_penalty: 0,
      frequency_penalty: 0,
    };
    await db
      .collection("organizations")
      .doc(orgId)
      .collection("forms")
      .doc(formId)
      .update({
        formName,
        cutoff,
        sections: normalizedSections,
        domains,
        llmPrompt,
        llmConfig: llmConfig || defaultLlmConfig,
      });
    res.status(200).json({ success: true, formId });
  } catch (err) {
    console.error("Error updating form", err);
    res.status(500).json({ error: "Failed to update form" });
  }
});

// New endpoint to send evaluation emails for all submissions in an org
app.post("/org/:orgId/send-evaluation-emails", async (req, res) => {
  const { orgId } = req.params;
  try {
    const submissionsRef = db.collection("organizations").doc(orgId).collection("submissions");
    const snapshot = await submissionsRef.get();
    let sentCount = 0;
    for (const doc of snapshot.docs) {
      const submission = doc.data();
      if (!submission.evaluationEmailSent && typeof submission.aiScore === "number" && !isNaN(submission.aiScore)) {
        // Fetch form for cutoff
        const formDoc = await db.collection("organizations").doc(orgId).collection("forms").doc(submission.formId).get();
        const formData = formDoc.exists ? formDoc.data() : {};
        const cutoff = formData.cutoff;
        const passed = typeof cutoff === "number"
          ? submission.aiScore >= cutoff
          : parseFloat(submission.aiScore) >= parseFloat(cutoff);
        if (passed) {
          await sendCandidateScoreEmail({
            to: submission.candidateEmail,
            name: submission.candidateName,
            score: submission.aiScore,
            remarks: "Congratulations! You have qualified based on your evaluation score.",
            qualified: true
          });
        } else {
          await sendCandidateScoreEmail({
            to: submission.candidateEmail,
            name: submission.candidateName,
            score: submission.aiScore,
            remarks: "Thank you for participating. Unfortunately, you did not meet the cutoff score.",
            qualified: false
          });
        }
        await doc.ref.update({ evaluationEmailSent: true });
        sentCount++;
      }
    }
    res.status(200).json({ success: true, sentCount });
  } catch (err) {
    console.error("Error sending evaluation emails:", err);
    res.status(500).json({ error: "Failed to send evaluation emails" });
  }
});

/**
 * Accept Invitation
 * POST /accept-invite
 * Body: { inviteId, name, password }
 */
app.post("/accept-invite", async (req, res) => {
  const { inviteId, name, password } = req.body;
  if (!inviteId || !name || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const invitesRef = db.collection("invites");
    const inviteDoc = await invitesRef.doc(inviteId).get();
    if (!inviteDoc.exists) {
      return res.status(404).json({ error: "Invite not found" });
    }
    const invite = inviteDoc.data();
    if (invite.status !== "pending") {
      return res.status(400).json({ error: "Invite is not pending" });
    }
    const { orgId, email, role } = invite;
    const usersRef = db.collection("users");
    // Check if user exists
    const userSnap = await usersRef.where("email", "==", email).get();
    let userId;
    if (!userSnap.empty) {
      // User exists, update orgs and status
      const userDoc = userSnap.docs[0];
      userId = userDoc.id;
      const userData = userDoc.data();
      const updatedOrgs = Array.isArray(userData.orgs) ? [...new Set([...(userData.orgs || []), orgId])] : [orgId];
      await usersRef.doc(userId).update({ orgs: updatedOrgs, status: "active" });
    } else {
      // Create new user
      const passwordHash = await bcrypt.hash(password, 10);
      const userRef = usersRef.doc();
      userId = userRef.id;
      await userRef.set(cleanUndefined({
        userId,
        name,
        email,
        passwordHash,
        orgs: [orgId],
        role: role || "member",
        status: "active",
        createdAt: new Date().toISOString(),
      }));
    }
    // Add userId to org's members if not already present
    const orgRef = db.collection("organizations").doc(orgId);
    const orgDoc = await orgRef.get();
    if (orgDoc.exists) {
      const orgData = orgDoc.data();
      const members = Array.isArray(orgData.members) ? orgData.members : [];
      if (!members.includes(userId)) {
        await orgRef.update({ members: [...members, userId] });
      }
    }
    // Update invite status
    await invitesRef.doc(inviteId).update({ status: "accepted", acceptedAt: new Date().toISOString(), userId });
    return res.status(200).json({ success: true, userId, orgId, message: "Invitation accepted. Account activated." });
  } catch (err) {
    console.error("/accept-invite error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /invites/:inviteId - fetch invite details
app.get("/invites/:inviteId", async (req, res) => {
  const { inviteId } = req.params;
  try {
    const inviteDoc = await db.collection("invites").doc(inviteId).get();
    if (!inviteDoc.exists) {
      return res.status(404).json({ error: "Invite not found" });
    }
    return res.status(200).json({ invite: inviteDoc.data() });
  } catch (err) {
    console.error("/invites/:inviteId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /org/:orgId - fetch organization details by orgId
app.get("/org/:orgId", async (req, res) => {
  const { orgId } = req.params;
  try {
    const orgDoc = await db.collection("organizations").doc(orgId).get();
    if (!orgDoc.exists) {
      return res.status(404).json({ error: "Organization not found" });
    }
    return res.status(200).json({ org: orgDoc.data() });
  } catch (err) {
    console.error("/org/:orgId error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// --- Form Flow Endpoints ---
// POST /org/:orgId/flows - create a new form flow
app.post("/org/:orgId/flows", async (req, res) => {
  const { orgId } = req.params;
  const { name, description, stages, finalEmail } = req.body;
  if (!name || !Array.isArray(stages) || stages.length === 0) {
    return res.status(400).json({ error: "Missing required fields: name, stages" });
  }
  try {
    const flowRef = db.collection("formFlows").doc();
    const flowId = flowRef.id;
    const now = new Date().toISOString();
    const flowData = {
      flowId,
      orgId,
      name,
      description: description || "",
      stages,
      finalEmail: finalEmail || {},
      createdAt: now,
      updatedAt: now,
    };
    await flowRef.set(flowData);
    res.status(201).json({ success: true, flow: flowData });
  } catch (err) {
    console.error("Error creating form flow:", err);
    res.status(500).json({ error: "Failed to create form flow" });
  }
});

// PATCH /org/:orgId/flows/:flowId - update an existing form flow
app.patch("/org/:orgId/flows/:flowId", async (req, res) => {
  const { orgId, flowId } = req.params;
  const { name, description, stages, finalEmail } = req.body;
  try {
    const flowRef = db.collection("formFlows").doc(flowId);
    const updateObj = {
      updatedAt: new Date().toISOString(),
    };
    if (name !== undefined) updateObj.name = name;
    if (description !== undefined) updateObj.description = description;
    if (stages !== undefined) updateObj.stages = stages;
    if (finalEmail !== undefined) updateObj.finalEmail = finalEmail;
    await flowRef.update(updateObj);
    const updatedDoc = await flowRef.get();
    res.status(200).json({ success: true, flow: updatedDoc.data() });
  } catch (err) {
    console.error("Error updating form flow:", err);
    res.status(500).json({ error: "Failed to update form flow" });
  }
});

// GET /org/:orgId/flows - fetch all flows for an org
app.get("/org/:orgId/flows", async (req, res) => {
  const { orgId } = req.params;
  try {
    const snapshot = await db.collection("formFlows").where("orgId", "==", orgId).get();
    const flows = snapshot.docs.map(doc => doc.data());
    res.status(200).json({ flows });
  } catch (err) {
    console.error("Error fetching flows:", err);
    res.status(500).json({ error: "Failed to fetch flows" });
  }
});

// GET /org/:orgId/flows/:flowId - fetch a single flow
app.get("/org/:orgId/flows/:flowId", async (req, res) => {
  const { flowId } = req.params;
  try {
    const doc = await db.collection("formFlows").doc(flowId).get();
    if (!doc.exists) return res.status(404).json({ error: "Flow not found" });
    res.status(200).json({ flow: doc.data() });
  } catch (err) {
    console.error("Error fetching flow:", err);
    res.status(500).json({ error: "Failed to fetch flow" });
  }
});

// DELETE /org/:orgId/flows/:flowId - delete a flow
app.delete("/org/:orgId/flows/:flowId", async (req, res) => {
  const { flowId } = req.params;
  try {
    await db.collection("formFlows").doc(flowId).delete();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error deleting flow:", err);
    res.status(500).json({ error: "Failed to delete flow" });
  }
});

// --- Candidate Progress Tracking & Flow Advancement ---
// POST /org/:orgId/flows/:flowId/start - start a candidate in a flow
app.post("/org/:orgId/flows/:flowId/start", async (req, res) => {
  const { orgId, flowId } = req.params;
  const { candidateId, email, candidateName } = req.body;
  if (!candidateId || !email) return res.status(400).json({ error: "Missing candidateId or email" });
  try {
    const flowDoc = await db.collection("formFlows").doc(flowId).get();
    if (!flowDoc.exists) return res.status(404).json({ error: "Flow not found" });
    const flow = flowDoc.data();
    const now = new Date().toISOString();
    const progressRef = db.collection("candidateProgress").doc(`${flowId}_${candidateId}`);
    const progressData = {
      candidateId,
      orgId,
      flowId,
      email,
      stages: flow.stages.map((stage, idx) => ({
        formId: stage.formId,
        submittedAt: null,
        score: null,
        passed: null,
        evaluatedAt: null,
      })),
      currentStage: 0,
      status: "in_progress",
      finalResult: null,
      createdAt: now,
      updatedAt: now,
    };
    await progressRef.set(progressData);
    // Send first form invite email
    const firstStage = flow.stages[0];
    if (firstStage && firstStage.emailTemplate) {
      const formLink = `${process.env.FRONTEND_BASE_URL || "http://localhost:3000"}/form/${firstStage.formId}?candidateId=${candidateId}`;
      await sendInviteEmail({
        to: email,
        name: candidateName || email,
        orgName: flow.name,
        role: "candidate",
        inviteLink: formLink,
        subject: firstStage.emailTemplate.subject,
        body: firstStage.emailTemplate.body.replace("{{formLink}}", formLink),
      });
    }
    res.status(201).json({ success: true, progress: progressData });
  } catch (err) {
    console.error("Error starting candidate in flow:", err);
    res.status(500).json({ error: "Failed to start candidate in flow" });
  }
});

// PATCH /org/:orgId/flows/:flowId/candidate/:candidateId/advance - advance candidate to next stage
app.patch("/org/:orgId/flows/:flowId/candidate/:candidateId/advance", async (req, res) => {
  const { orgId, flowId, candidateId } = req.params;
  const { score, passed, candidateName } = req.body; // score and pass/fail for current stage
  try {
    const progressRef = db.collection("candidateProgress").doc(`${flowId}_${candidateId}`);
    const progressDoc = await progressRef.get();
    if (!progressDoc.exists) return res.status(404).json({ error: "Candidate progress not found" });
    const progress = progressDoc.data();
    const flowDoc = await db.collection("formFlows").doc(flowId).get();
    if (!flowDoc.exists) return res.status(404).json({ error: "Flow not found" });
    const flow = flowDoc.data();
    const stageIdx = progress.currentStage;
    // Update current stage with score and pass/fail
    progress.stages[stageIdx].score = score;
    progress.stages[stageIdx].passed = passed;
    progress.stages[stageIdx].evaluatedAt = new Date().toISOString();
    let nextStage = stageIdx + 1;
    // Determine advancement
    if (nextStage < flow.stages.length && (passed || flow.stages[stageIdx].sendIf === "always")) {
      progress.currentStage = nextStage;
      // Send next form invite email
      const nextStageObj = flow.stages[nextStage];
      if (nextStageObj && nextStageObj.emailTemplate) {
        const formLink = `${process.env.FRONTEND_BASE_URL || "http://localhost:3000"}/form/${nextStageObj.formId}?candidateId=${candidateId}`;
        await sendInviteEmail({
          to: progress.email,
          name: candidateName || progress.email,
          orgName: flow.name,
          role: "candidate",
          inviteLink: formLink,
          subject: nextStageObj.emailTemplate.subject,
          body: nextStageObj.emailTemplate.body.replace("{{formLink}}", formLink),
        });
      }
    } else {
      // End of flow or failed
      progress.status = passed ? "completed" : "failed";
      progress.finalResult = passed ? "pass" : "fail";
      // Send final result email
      if (flow.finalEmail) {
        const subject = flow.finalEmail.subject || "Your Application Result";
        const body = passed
          ? (flow.finalEmail.passBody || "Congratulations! You have been shortlisted.")
          : (flow.finalEmail.failBody || "Thank you for applying. Unfortunately, you were not shortlisted.");
        await sendCandidateScoreEmail({
          to: progress.email,
          name: candidateName || progress.email,
          score: score,
          remarks: body,
          subject,
        });
      }
    }
    progress.updatedAt = new Date().toISOString();
    await progressRef.set(progress);
    res.status(200).json({ success: true, progress });
  } catch (err) {
    console.error("Error advancing candidate in flow:", err);
    res.status(500).json({ error: "Failed to advance candidate in flow" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`TES Backend running on port ${PORT}`));