import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { message } = await request.json();
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Pertanyaan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.FASTAPI_BASE_URL || "http://127.0.0.1:8000";
    const upstream = await fetch(`${baseUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      cache: "no-store",
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Layanan chatbot belum dapat dihubungi." },
      { status: 500 }
    );
  }
}