"use client";

import { useEffect, useState } from "react";

const cognitoDomain =
  "https://ap-northeast-1i0hck1lqp.auth.ap-northeast-1.amazoncognito.com";

const clientId = "4ks7t38vhms54mf058sbm2jap3";

const redirectUri = "http://localhost:3000/auth/callback";

type TokenResponse = {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

function decodeJwtPayload(token?: string) {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];

    const normalized = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded =
      normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

    const decoded = atob(padded);

    const json = decodeURIComponent(
      Array.from(decoded)
        .map(
          (char) =>
            "%" + char.charCodeAt(0).toString(16).padStart(2, "0")
        )
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("認可コードを確認しています...");
  const [tokens, setTokens] = useState<TokenResponse | null>(null);

  useEffect(() => {
    const exchangeCode = async () => {
      const params = new URLSearchParams(window.location.search);

      const code = params.get("code");
      const returnedState = params.get("state");
      const error = params.get("error");
      const errorDescription = params.get("error_description");

      if (error) {
        setStatus(
          `Cognitoからエラーが返されました: ${error} ${
            errorDescription ?? ""
          }`
        );
        return;
      }

      if (!code) {
        setStatus("認可コードがURLにありません。");
        return;
      }

      const savedState = sessionStorage.getItem("oauth_state");
      const codeVerifier = sessionStorage.getItem(
        "pkce_code_verifier"
      );

      if (!savedState || returnedState !== savedState) {
        setStatus("stateが一致しません。処理を中止しました。");
        return;
      }

      if (!codeVerifier) {
        setStatus("PKCE code_verifierが見つかりません。");
        return;
      }

      try {
        setStatus("認可コードをトークンへ交換しています...");

        const body = new URLSearchParams({
          grant_type: "authorization_code",
          client_id: clientId,
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        });

        const response = await fetch(
          `${cognitoDomain}/oauth2/token`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded",
            },
            body,
          }
        );

        const data: TokenResponse = await response.json();

        if (!response.ok) {
          console.error(data);

          setStatus(
            `トークン取得に失敗しました: ${
              data.error ?? response.status
            } ${data.error_description ?? ""}`
          );

          return;
        }

        setTokens(data);
        setStatus("ログイン成功。トークンを取得しました。");

        sessionStorage.removeItem("oauth_state");
        sessionStorage.removeItem("pkce_code_verifier");
      } catch (error) {
        console.error(error);
        setStatus("トークン交換処理でエラーが発生しました。");
      }
    };

    exchangeCode();
  }, []);

  const idTokenPayload = decodeJwtPayload(tokens?.id_token);
  const accessTokenPayload = decodeJwtPayload(
    tokens?.access_token
  );

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "60px auto",
        padding: "0 24px",
      }}
    >
      <h1>OIDC Callback</h1>

      <p>{status}</p>

      {tokens && (
        <>
          <h2>ID Token</h2>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              background: "#111",
              color: "#eee",
              padding: "16px",
            }}
          >
            {tokens.id_token}
          </pre>

          <h3>ID Token Payload</h3>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#111",
              color: "#eee",
              padding: "16px",
            }}
          >
            {JSON.stringify(idTokenPayload, null, 2)}
          </pre>

          <h2>Access Token</h2>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              background: "#111",
              color: "#eee",
              padding: "16px",
            }}
          >
            {tokens.access_token}
          </pre>

          <h3>Access Token Payload</h3>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#111",
              color: "#eee",
              padding: "16px",
            }}
          >
            {JSON.stringify(accessTokenPayload, null, 2)}
          </pre>

          <h2>Token Response</h2>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#111",
              color: "#eee",
              padding: "16px",
            }}
          >
            {JSON.stringify(
              {
                token_type: tokens.token_type,
                expires_in: tokens.expires_in,
                refresh_token_received: Boolean(
                  tokens.refresh_token
                ),
              },
              null,
              2
            )}
          </pre>

          <p>
            ※ JWTのPayloadはデコードして表示しているだけで、
            署名検証はしていません。
          </p>
        </>
      )}
    </main>
  );
}