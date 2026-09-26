"use client";

import {
  useState,
} from "react";

import {
  echoMessage,
} from "./actions";

export default function ServerActionPage() {
  const [input, setInput] =
    useState("");

  const [result, setResult] =
    useState("");

  const handleClick =
    async () => {
      const response =
        await echoMessage(input);

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
      <h1>
        Next.js Server Action
      </h1>

      <p>
        見た目はJavaScriptの関数呼び出しですが、
        実際にはブラウザからNext.jsサーバーへ
        HTTPリクエストが発生します。
      </p>

      <h2>見るところ</h2>

      <pre>
{`DevTools
↓
Network
↓
POSTリクエスト
↓
Request Headers
↓
Next-Action: xxxxx`}
      </pre>

      <input
        type="text"
        value={input}
        onChange={(event) =>
          setInput(
            event.target.value
          )
        }
        placeholder="hello"
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
            whiteSpace:
              "pre-wrap",
          }}
        >
          {result}
        </pre>
      )}
    </main>
  );
}