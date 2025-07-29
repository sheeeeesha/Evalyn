"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SelectOrgPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [orgNames, setOrgNames] = useState({});
  const [loadingNames, setLoadingNames] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("orgLoginUser");
    if (stored) {
      const info = JSON.parse(stored);
      setUserInfo(info);
      // Fetch org names
      if (info.orgs && info.orgs.length > 0) {
        Promise.all(
          info.orgs.map(async (orgId) => {
            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/org/${orgId}`);
              const data = await res.json();
              return { orgId, orgName: data.org?.orgName || orgId };
            } catch {
              return { orgId, orgName: orgId };
            }
          })
        ).then((results) => {
          const names = {};
          results.forEach(({ orgId, orgName }) => {
            names[orgId] = orgName;
          });
          setOrgNames(names);
          setLoadingNames(false);
        });
      } else {
        setLoadingNames(false);
      }
    } else {
      setError("No login info found. Please login again.");
      setLoadingNames(false);
    }
  }, []);

  const handleSelect = (orgId) => {
    if (!userInfo) return;
    localStorage.setItem("orgEmail", userInfo.email);
    localStorage.setItem("orgId", orgId);
    localStorage.setItem("userId", userInfo.userId);
    localStorage.setItem("role", userInfo.role);
    router.push("/org/dashboard");
  };

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">{error}</div>;
  }

  if (!userInfo || loadingNames) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Select Organization</h2>
        <p className="mb-4">You are a member of multiple organizations. Please select one to continue:</p>
        <ul className="space-y-3">
          {userInfo.orgs.map((orgId) => (
            <li key={orgId}>
              <button
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={() => handleSelect(orgId)}
              >
                {orgNames[orgId] || orgId}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 