// app/study/oidc-pkce/callback/page.tsx

"use client";

import { useEffect, useState } from "react";

const cognitoDomain =
  "https://ap-northeast-1i0hck1lqp.auth.ap-northeast-1.amazoncognito.com";

const clientId =
  "4ks7t38vhms54mf058sbm2jap3";

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
      normalized +
      "=".repeat(
        (4 - (normalized.length % 4)) % 4
      );

    const decoded = atob(padded);

    const json = decodeURIComponent(
      Array.from(decoded)
        .map(
          (char) =>
            "%" +
            char
              .charCodeAt(0)
              .toString(16)
              .padStart(2, "0")
        )
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function OidcPkceCallbackPage() {
  const [status, setStatus] =
    useState("認可コードを確認しています...");

  const [tokens, setTokens] =
    useState<TokenResponse | null>(null);

  useEffect(() => {
    const exchangeCode = async () => {
      const params =
        new URLSearchParams(
          window.location.search
        );

      const code = params.get("code");
      const returnedState =
        params.get("state");

      const error = params.get("error");

      if (error) {
        setStatus(
          `Cognitoエラー: ${error}`
        );
        return;
      }

      if (!code) {
        setStatus(
          "認可コードがありません。"
        );
        return;
      }

      const savedState =
        sessionStorage.getItem(
          "oauth_state"
        );

      const codeVerifier =
        sessionStorage.getItem(
          "pkce_code_verifier"
        );

      if (
        !savedState ||
        returnedState !== savedState
      ) {
        setStatus(
          "stateが一致しません。"
        );
        return;
      }

      if (!codeVerifier) {
        setStatus(
          "code_verifierがありません。"
        );
        return;
      }

      const redirectUri =
        `${window.location.origin}/study/oidc-pkce/callback`;

      const body =
        new URLSearchParams({
          grant_type:
            "authorization_code",
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

      const data: TokenResponse =
        await response.json();

      if (!response.ok) {
        setStatus(
          `トークン交換失敗: ${
            data.error ?? response.status
          }`
        );

        return;
      }

      setTokens(data);
      setStatus(
        "ログイン成功。トークン取得済み。"
      );

      sessionStorage.removeItem(
        "oauth_state"
      );

      sessionStorage.removeItem(
        "pkce_code_verifier"
      );
    };

    exchangeCode();
  }, []);

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "60px auto",
        padding: "0 24px",
      }}
    >
      <h1>OIDC PKCE Callback</h1>

      <p>{status}</p>

      {tokens && (
        <>
          <h2>ID Token Payload</h2>

          <pre>
            {JSON.stringify(
              decodeJwtPayload(
                tokens.id_token
              ),
              null,
              2
            )}
          </pre>

          <h2>Access Token Payload</h2>

          <pre>
            {JSON.stringify(
              decodeJwtPayload(
                tokens.access_token
              ),
              null,
              2
            )}
          </pre>
        </>
      )}
    </main>
  );
}