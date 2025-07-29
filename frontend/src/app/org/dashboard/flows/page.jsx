"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FlowForm from "../../../../components/FlowForm";

export default function FlowsPage() {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editFlow, setEditFlow] = useState(null);
  const router = useRouter();
  const orgId = typeof window !== "undefined" && localStorage.getItem("orgId");

  useEffect(() => {
    if (!orgId) return;
    const fetchFlows = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/flows`);
        const data = await res.json();
        setFlows(data.flows || []);
      } catch (err) {
        setFlows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFlows();
  }, [orgId, showForm]);

  const handleEdit = (flow) => {
    setEditFlow(flow);
    setShowForm(true);
  };
  const handleDelete = async (flowId) => {
    if (!window.confirm("Delete this flow?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}/flows/${flowId}`, { method: "DELETE" });
    setFlows(flows.filter(f => f.flowId !== flowId));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Form Flows</h1>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={() => { setEditFlow(null); setShowForm(true); }}>+ Create New Flow</button>
      {showForm && (
        <FlowForm
          orgId={orgId}
          flow={editFlow}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); }}
        />
      )}
      {loading ? (
        <div>Loading...</div>
      ) : flows.length === 0 ? (
        <div>No flows found.</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border"># Stages</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flows.map(flow => (
              <tr key={flow.flowId}>
                <td className="p-2 border">{flow.name}</td>
                <td className="p-2 border">{flow.stages?.length || 0}</td>
                <td className="p-2 border">{new Date(flow.createdAt).toLocaleString()}</td>
                <td className="p-2 border">
                  <button className="text-blue-600 underline mr-2" onClick={() => handleEdit(flow)}>Edit</button>
                  <button className="text-red-600 underline" onClick={() => handleDelete(flow.flowId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 