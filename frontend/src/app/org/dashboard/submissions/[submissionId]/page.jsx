"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ViewSubmission() {
  const { submissionId } = useParams();
  const router = useRouter();

  const [orgId, setOrgId] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [score, setScore] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [manualScore, setManualScore] = useState("");
  const [manualRemarks, setManualRemarks] = useState("");
  const [aiScore, setAiScore] = useState(null);
  const [aiJustification, setAiJustification] = useState("");
  const [evaluationEmailSent, setEvaluationEmailSent] = useState(false);
  const [overrideScore, setOverrideScore] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideRemarks, setOverrideRemarks] = useState("");
  const [overrideLoading, setOverrideLoading] = useState(false);

  // Get orgId from localStorage after hydration
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrgId = localStorage.getItem("orgId");
      setOrgId(storedOrgId);
    }
  }, []);

  // Fetch submission once orgId and submissionId are available
  useEffect(() => {
    if (!orgId || !submissionId) return;

    const fetchSubmission = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/submissions/${submissionId}`;
        console.log("🔍 Fetching:", url);

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch submission");
        const data = await res.json();

        console.log("✅ Submission data:", data);
        setSubmission(data.submission);
        setScore(data.submission.score || "");
        setRemarks(data.submission.remarks || "");
        setManualScore(data.submission.manualScore || "");
        setManualRemarks(data.submission.remarks || "");
        setAiScore(data.submission.aiScore ?? null);
        setAiJustification(data.submission.aiJustification || "");
        setEvaluationEmailSent(data.submission.evaluationEmailSent || false);
      } catch (err) {
        console.error("❌ Error fetching submission:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [orgId, submissionId]);

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/submissions/${submissionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score,
            remarks,
            scored: true,
          }),
        }
      );

      if (res.ok) {
        alert("✅ Submission scored successfully.");
        router.push("/org/dashboard/submissions");
      } else {
        alert("❌ Failed to score the submission.");
      }
    } catch (err) {
      console.error("Error during scoring:", err);
      alert("Error occurred while scoring.");
    } finally {
      setUpdating(false);
    }
  };

  // Handle override submit
  const handleOverrideSubmit = async (e) => {
    e.preventDefault();
    setOverrideLoading(true);
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : "";
    const userName = typeof window !== "undefined" ? localStorage.getItem("userName") : "";
    if (!userId || !userName) {
      alert("User info missing. Please log in again.");
      setOverrideLoading(false);
      return;
    }
    if (!overrideScore || !overrideReason) {
      alert("Please provide both a new score and a reason for override.");
      setOverrideLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/submissions/${submissionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            finalScore: Number(overrideScore),
            finalRemarks: overrideRemarks,
            userId,
            userName,
            overrideReason,
          }),
        }
      );
      if (res.ok) {
        alert("✅ Score overridden successfully.");
        window.location.reload();
      } else {
        alert("❌ Failed to override score.");
      }
    } catch (err) {
      alert("Error occurred while overriding score.");
    } finally {
      setOverrideLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading submission...</div>;
  if (!submission)
    return <div className="p-6 text-red-500">Submission not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Candidate Submission</h1>

      <div className="mb-6 bg-gray-50 p-4 rounded">
        <p><strong>Name:</strong> {submission.candidateName}</p>
        <p><strong>Email:</strong> {submission.candidateEmail}</p>
        <p><strong>Phone:</strong> {submission.phone}</p>
        <p><strong>Form ID:</strong> {submission.formId}</p>
        <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
        <p><strong>Email Sent:</strong> {evaluationEmailSent ? "Yes" : "No"}</p>
      </div>

      {/* Evaluation Info */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Evaluation</h2>
        {aiScore !== null ? (
          <div className="mb-2 p-3 border rounded bg-blue-50">
            <p><strong>AI Score:</strong> {aiScore}</p>
            {aiJustification && <p><strong>AI Justification:</strong> {aiJustification}</p>}
          </div>
        ) : (
          <div className="mb-2 p-3 border rounded bg-yellow-50">
            <p>Not yet evaluated by AI.</p>
          </div>
        )}
        {/* Rubric-level breakdown */}
        {submission.questionBreakdown && Array.isArray(submission.questionBreakdown) && (
          <div className="mt-6">
            <h3 className="text-md font-bold mb-2">Rubric-Level Breakdown</h3>
            {submission.questionBreakdown.map((q, qi) => (
              <div key={qi} className="mb-4 p-3 border rounded bg-white">
                <p className="font-semibold">Q{qi + 1}: {q.label}</p>
                <p><strong>Weighted Score:</strong> {q.score}</p>
                {q.justification && <p className="text-sm text-gray-700 mb-1"><strong>Justification:</strong> {q.justification}</p>}
                {q.rubricScores && Array.isArray(q.rubricScores) && submission.responses[qi] && submission.responses[qi].rubrics && Array.isArray(submission.responses[qi].rubrics) ? (
                  <div className="ml-4 mt-2">
                    <p className="font-medium mb-1">Rubrics:</p>
                    <ul className="list-disc ml-6">
                      {submission.responses[qi].rubrics.map((rubric, ri) => (
                        <li key={ri} className="mb-1">
                          <span className="font-semibold">{rubric.label}</span> (Weight: {rubric.weight})
                          {rubric.description && <span className="ml-2 text-gray-500">{rubric.description}</span>}
                          <span className="ml-2">Score: <span className="font-bold">{q.rubricScores[ri]}</span></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Responses</h2>
        {submission.responses.map((r, i) => (
          <div key={i} className="mb-4 p-3 border rounded">
            <p><strong>Section:</strong> {r.sectionTitle}</p>
            <p><strong>Question:</strong> {r.label}</p>
            <p><strong>Answer:</strong> {r.answer}</p>
          </div>
        ))}
      </div>

      {/* Override Score Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Override Score (Admin Only)</h2>
        <form onSubmit={handleOverrideSubmit} className="mb-4 flex flex-col gap-2 max-w-lg">
          <label>
            New Score:
            <input
              type="number"
              min={0}
              max={100}
              value={overrideScore}
              onChange={e => setOverrideScore(e.target.value)}
              className="border p-2 w-32 ml-2"
              required
            />
          </label>
          <label>
            Reason for Override:
            <input
              type="text"
              value={overrideReason}
              onChange={e => setOverrideReason(e.target.value)}
              className="border p-2 w-full ml-2"
              required
            />
          </label>
          <label>
            Remarks (optional):
            <input
              type="text"
              value={overrideRemarks}
              onChange={e => setOverrideRemarks(e.target.value)}
              className="border p-2 w-full ml-2"
            />
          </label>
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded mt-2 w-fit"
            disabled={overrideLoading}
          >
            {overrideLoading ? "Saving..." : "Override Score"}
          </button>
        </form>
      </div>

      {/* Override History Section */}
      {submission.overrides && Array.isArray(submission.overrides) && submission.overrides.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Override History</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">User</th>
                <th className="p-2 border">Timestamp</th>
                <th className="p-2 border">Old Score</th>
                <th className="p-2 border">New Score</th>
                <th className="p-2 border">Reason</th>
              </tr>
            </thead>
            <tbody>
              {submission.overrides.map((o, i) => (
                <tr key={i}>
                  <td className="p-2 border">{o.userName}</td>
                  <td className="p-2 border">{new Date(o.timestamp).toLocaleString()}</td>
                  <td className="p-2 border">{o.oldScore}</td>
                  <td className="p-2 border">{o.newScore}</td>
                  <td className="p-2 border">{o.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
