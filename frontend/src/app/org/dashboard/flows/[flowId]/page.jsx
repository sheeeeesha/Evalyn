"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function FlowCandidatesPage() {
  const { flowId } = useParams();
  const [flow, setFlow] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const orgId = typeof window !== "undefined" && localStorage.getItem("orgId");

  useEffect(() => {
    if (!orgId || !flowId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const flowRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/flows/${flowId}`);
        const flowData = await flowRes.json();
        setFlow(flowData.flow);
        // Fetch all candidateProgress for this flow
        const progressRes = await fetch(`/api/candidateProgress?flowId=${flowId}`); // We'll use a local API route for now
        const progressData = await progressRes.json();
        setCandidates(progressData.candidates || []);
      } catch (err) {
        setFlow(null);
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orgId, flowId]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Candidate Progress</h1>
      {loading ? (
        <div>Loading...</div>
      ) : !flow ? (
        <div>Flow not found.</div>
      ) : (
        <>
          <h2 className="text-lg font-semibold mb-4">{flow.name}</h2>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Candidate Email</th>
                <th className="p-2 border">Current Stage</th>
                {flow.stages.map((stage, idx) => (
                  <th key={idx} className="p-2 border">{stage.name || `Stage ${idx + 1}`}</th>
                ))}
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Final Result</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(cand => (
                <tr key={cand.candidateId}>
                  <td className="p-2 border">{cand.email}</td>
                  <td className="p-2 border">{flow.stages[cand.currentStage]?.name || `Stage ${cand.currentStage + 1}`}</td>
                  {flow.stages.map((stage, idx) => (
                    <td key={idx} className="p-2 border text-center">
                      {cand.stages[idx]?.score !== null && cand.stages[idx]?.score !== undefined ? cand.stages[idx].score : "-"}
                      {cand.stages[idx]?.passed === false && <span className="text-red-600 ml-1">✗</span>}
                      {cand.stages[idx]?.passed === true && <span className="text-green-600 ml-1">✓</span>}
                    </td>
                  ))}
                  <td className="p-2 border">{cand.status}</td>
                  <td className="p-2 border">{cand.finalResult || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
} 