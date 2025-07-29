"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { auth, provider } from "@/lib/firebaseConfig";
import { signInWithPopup } from "firebase/auth";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inviteId = searchParams.get("inviteId");
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!inviteId) {
      setError("No invite ID provided.");
      setLoading(false);
      return;
    }
    // Fetch invite details
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/invites/" + inviteId)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setInvite(data.invite);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch invite details.");
        setLoading(false);
      });
  }, [inviteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId, name, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to accept invitation.");
        setSubmitting(false);
        return;
      }
      
      // After successful invite acceptance, automatically log in with Google
      setSuccess("Invitation accepted! Logging you in...");
      
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const email = user.email;

        // Verify email with backend to get the correct orgId
        const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-org`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const verifyData = await verifyRes.json();

        if (verifyRes.ok && verifyData.orgs && verifyData.orgs.length > 0) {
          // Store user info and set the correct orgId
          localStorage.setItem("orgEmail", email);
          localStorage.setItem("orgId", data.orgId); // Use the orgId from the invite acceptance
          localStorage.setItem("userId", verifyData.userId);
          localStorage.setItem("role", verifyData.role);
          
          // Redirect to dashboard
          router.push("/org/dashboard");
        } else {
          setError("Failed to verify user after invite acceptance.");
        }
      } catch (loginErr) {
        console.error("Login error:", loginErr);
        setError("Failed to log in after accepting invitation. Please try logging in manually.");
      }
      
      setSubmitting(false);
    } catch (err) {
      setError("Failed to accept invitation.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Accept Organization Invitation</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600 font-medium">{error}</div>
        ) : success ? (
          <div className="text-green-600 font-medium">{success}</div>
        ) : invite ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <b>Organization:</b> {invite.orgId}<br />
              <b>Email:</b> {invite.email}<br />
              <b>Role:</b> {invite.role}
            </div>
            <div>
              <label className="block mb-1 font-medium">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Set Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={submitting || !name || !password}
            >
              {submitting ? "Accepting..." : "Accept Invitation"}
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
} 