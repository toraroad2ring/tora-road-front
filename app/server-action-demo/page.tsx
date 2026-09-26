"use client";

import { useState } from "react";
import { echoMessage } from "./actions";

export default function ServerActionDemoPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = async () => {
    const response = await echoMessage(input);

    setResult(
      `${response.message}\n${response.timestamp}`
    );
  };

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "80px auto",
        padding: "0 24px",
      }}
    >
      <h1>Server Action Demo</h1>

      <p>
        Client Component から Server Action を呼び出す学習用ページです。
      </p>

      <input
        type="text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="メッセージを入力"
        style={{
          display: "block",
          width: "100%",
          padding: "12px",
          marginTop: "24px",
        }}
      />

      <button
        type="button"
        onClick={handleClick}
        style={{
          marginTop: "16px",
          padding: "12px 24px",
          cursor: "pointer",
        }}
      >
        Server Actionを実行
      </button>

      {result && (
        <pre
          style={{
            marginTop: "24px",
            whiteSpace: "pre-wrap",
          }}
        >
          {result}
        </pre>
      )}
    </main>
  );
}