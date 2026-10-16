"use client";

import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Halo, saya bisa membantu mencari informasi dari dokumen " +
        "yang tersedia. Apa yang ingin kamu tanyakan?",
    },
  ]);

  async function sendMessage(event) {
    event?.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.detail || "Permintaan gagal");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "Belum ada jawaban." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Maaf, terjadi kendala: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed", right: 24, bottom: 24, zIndex: 9999,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {open && (
        <section
          style={{
            width: 340, height: 460, maxWidth: "calc(100vw - 32px)",
            background: "#111827", color: "#F9FAFB", borderRadius: 16,
            boxShadow: "0 12px 40px #0004", display: "flex",
            flexDirection: "column", overflow: "hidden", marginBottom: 12,
          }}
        >
          <header
            style={{
              padding: 16, background: "#1F2937", display: "flex",
              justifyContent: "space-between", alignItems: "center",
            }}
          >
            <div>
              <strong>Virtual Safe Space</strong>
              <div style={{ fontSize: 12, color: "#D1D5DB", marginTop: 4 }}>
                Informasi awal berbasis dokumen
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup chat"
              style={{
                background: "transparent", color: "white", border: 0,
                fontSize: 22, cursor: "pointer",
              }}
            >
              ×
            </button>
          </header>

          <div
            style={{ padding: 12, flex: 1, overflowY: "auto" }}
            aria-live="polite"
          >
            {messages.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: item.role === "user" ? "flex-end" : "flex-start",
                  margin: "8px 0",
                }}
              >
                <div
                  style={{
                    maxWidth: "88%", whiteSpace: "pre-wrap",
                    padding: "10px 12px", borderRadius: 12, lineHeight: 1.45,
                    background: item.role === "user" ? "#0F766E" : "#374151",
                  }}
                >
                  {item.content}
                </div>
              </div>
            ))}
            {loading && (
              <p style={{ color: "#D1D5DB", fontSize: 13 }}>
                Sedang mencari informasi…
              </p>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            style={{
              padding: 12, display: "flex", gap: 8,
              borderTop: "1px solid #374151",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaan…"
              aria-label="Tulis pertanyaan"
              style={{
                minWidth: 0, flex: 1, padding: 10, borderRadius: 8,
                border: "1px solid #4B5563", background: "#1F2937",
                color: "white",
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: "0 12px", borderRadius: 8, border: 0,
                background: "#0F766E", color: "white", cursor: "pointer",
              }}
            >
              Kirim
            </button>
          </form>
          <p
            style={{
              fontSize: 10, color: "#D1D5DB", padding: "0 12px 10px",
              margin: 0,
            }}
          >
            Bukan layanan darurat atau pengganti pendamping profesional.
          </p>
        </section>
      )}

      <button
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Tutup chatbot" : "Buka chatbot"}
        style={{
          float: "right", border: 0, borderRadius: 999, width: 58,
          height: 58, background: "#0F766E", color: "white", fontSize: 24,
          boxShadow: "0 4px 18px #0003", cursor: "pointer",
        }}
      >
        {open ? "×" : "☏"}
      </button>
    </div>
  );
}