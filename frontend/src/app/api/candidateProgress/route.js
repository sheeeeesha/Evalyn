import { NextResponse } from "next/server";
import admin from "../../../../backend/firebase";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const flowId = searchParams.get("flowId");
  if (!flowId) return NextResponse.json({ candidates: [] });
  try {
    const snapshot = await admin.db.collection("candidateProgress").where("flowId", "==", flowId).get();
    const candidates = snapshot.docs.map(doc => doc.data());
    return NextResponse.json({ candidates });
  } catch (err) {
    return NextResponse.json({ candidates: [] });
  }
} 