"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SubmissionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assume orgId is stored in localStorage after login
  const orgId = typeof window !== "undefined" && localStorage.getItem("orgId");

  useEffect(() => {
    if (!orgId) return;

    const fetchSubmissions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/submissions`
        );
        const data = await res.json();
        setSubmissions(data.submissions || []);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [orgId]);

  const formIdFilter = searchParams.get("formId");

  if (loading) return <div className="p-6">Loading submissions...</div>;

  const filteredSubmissions = formIdFilter
    ? submissions.filter((s) => s.formId === formIdFilter)
    : submissions;

  if (filteredSubmissions.length === 0)
    return <div className="p-6 text-gray-500">No submissions yet.</div>;

  const handleSendEmail = async (submission) => {
    if (!orgId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/submissions/${submission.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ evaluationEmailSent: true }),
        }
      );
      if (res.ok) {
        alert("Evaluation email sent!");
        // Optionally refresh submissions
        const updated = submissions.map((s) =>
          s.id === submission.id ? { ...s, evaluationEmailSent: true } : s
        );
        setSubmissions(updated);
      } else {
        alert("Failed to send email.");
      }
    } catch (err) {
      alert("Error sending email.");
    }
  };

  // Add handler for sending evaluation emails
  const handleSendAllEvaluationEmails = async () => {
    if (!orgId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/send-evaluation-emails`,
        { method: "POST" }
      );
      const data = await res.json();
      if (res.ok) {
        alert(`Evaluation emails sent to ${data.sentCount} candidate(s).`);
        // Refresh submissions
        const res2 = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/submissions`
        );
        const data2 = await res2.json();
        setSubmissions(data2.submissions || []);
      } else {
        alert(data.error || "Failed to send evaluation emails.");
      }
    } catch (err) {
      alert("Error sending evaluation emails.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Candidate Submissions</h1>
      {/* Send Evaluation Emails Button */}
      <button
        className="mb-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        onClick={handleSendAllEvaluationEmails}
      >
        Send Evaluation Emails
      </button>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Form ID</th>
            <th className="p-3 border">Submitted At</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">AI Score</th>
            <th className="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubmissions.map((s) => {
            // Determine status
            let status = "Pending";
            if (s.aiScore !== null && s.evaluationEmailSent) status = "Emailed";
            else if (s.aiScore !== null) status = "AI Scored";

            // Score display
            let scoreDisplay = s.aiScore !== null ? s.aiScore : "-";

            return (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-3 border">{s.candidateName}</td>
                <td className="p-3 border">{s.candidateEmail}</td>
                <td className="p-3 border">{s.formId}</td>
                <td className="p-3 border">{new Date(s.submittedAt).toLocaleString()}</td>
                <td className="p-3 border">
                  <span className={
                    status === "Pending"
                      ? "text-red-500 font-medium"
                      : status === "Emailed"
                      ? "text-blue-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }>
                    {status}
                  </span>
                </td>
                <td className="p-3 border">{scoreDisplay}</td>
                <td className="p-3 border">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => router.push(`/org/dashboard/submissions/${s.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
