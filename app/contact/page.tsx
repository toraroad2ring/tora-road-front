"use client";

import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSending(true);
    setSubmitted(false);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_CONTACT_API_URL;

      if (!apiUrl) {
        throw new Error("CONTACT API URL is not configured");
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          website,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error("送信に失敗しました");
      }

      setSubmitted(true);

      setName("");
      setEmail("");
      setMessage("");
      setWebsite("");
    } catch (err) {
      console.error(err);

      setError(
        "送信に失敗しました。時間をおいてもう一度お試しください。"
      );
    } finally {
      setSending(false);
    }
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "14px 16px",
    marginTop: "8px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "#ffffff",
    outline: "none",
  };

  return (
    <main
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "56px 20px 80px",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#6b7280",
          }}
        >
          CONTACT
        </p>

        <h1
          style={{
            margin: "8px 0 12px",
            fontSize: "32px",
            lineHeight: 1.3,
          }}
        >
          お問い合わせ
        </h1>

        <p
          style={{
            margin: 0,
            color: "#555",
            lineHeight: 1.8,
          }}
        >
          TORA ROADへのご連絡はこちらからお願いします。
          <br />
          内容を確認後、必要に応じて返信します。
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          padding: "32px",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          backgroundColor: "#fafafa",
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="name"
            style={{
              display: "block",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            お名前
            <span
              style={{
                marginLeft: "8px",
                fontSize: "12px",
                color: "#b91c1c",
              }}
            >
              必須
            </span>
          </label>

          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="例：山田 太郎"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            メールアドレス
            <span
              style={{
                marginLeft: "8px",
                fontSize: "12px",
                color: "#b91c1c",
              }}
            >
              必須
            </span>
          </label>

          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@example.com"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "28px" }}>
          <label
            htmlFor="message"
            style={{
              display: "block",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            お問い合わせ内容
            <span
              style={{
                marginLeft: "8px",
                fontSize: "12px",
                color: "#b91c1c",
              }}
            >
              必須
            </span>
          </label>

          <textarea
            id="message"
            required
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={9}
            placeholder="お問い合わせ内容をご入力ください"
            style={{
              ...inputStyle,
              resize: "vertical",
              lineHeight: 1.7,
              minHeight: "180px",
            }}
          />
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          style={{
            width: "100%",
            padding: "14px 20px",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: sending ? "not-allowed" : "pointer",
            backgroundColor: sending ? "#9ca3af" : "#111827",
            color: "#ffffff",
          }}
        >
          {sending ? "送信中..." : "送信する"}
        </button>

        {submitted && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px 16px",
              borderRadius: "8px",
              backgroundColor: "#ecfdf5",
              color: "#065f46",
              lineHeight: 1.6,
            }}
          >
            お問い合わせを送信しました。
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px 16px",
              borderRadius: "8px",
              backgroundColor: "#fef2f2",
              color: "#991b1b",
              lineHeight: 1.6,
            }}
          >
            {error}
          </div>
        )}
      </form>
    </main>
  );
}