// app/study/oidc-pkce/page.tsx

"use client";

function base64UrlEncode(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  return base64UrlEncode(array.buffer);
}

async function createCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return base64UrlEncode(digest);
}

export default function OidcPkcePage() {
  const handleLogin = async () => {
    const cognitoDomain =
      "https://ap-northeast-1i0hck1lqp.auth.ap-northeast-1.amazoncognito.com";

    const clientId =
      "4ks7t38vhms54mf058sbm2jap3";

    const redirectUri =
      `${window.location.origin}/study/oidc-pkce/callback`;

    const codeVerifier = generateCodeVerifier();
    const codeChallenge =
      await createCodeChallenge(codeVerifier);

    const state = crypto.randomUUID();

    sessionStorage.setItem(
      "pkce_code_verifier",
      codeVerifier
    );

    sessionStorage.setItem(
      "oauth_state",
      state
    );

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      scope: "openid email",
      redirect_uri: redirectUri,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    window.location.href =
      `${cognitoDomain}/oauth2/authorize?${params.toString()}`;
  };

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "80px auto",
        padding: "0 24px",
      }}
    >
      <h1>OIDC PKCE Demo</h1>

      <p>
        Authorization Code Flow + PKCE の確認用です。
      </p>

      <p>
        DevToolsでは code_challenge、
        callbackのcode、
        /oauth2/tokenへのcode_verifierを確認します。
      </p>

      <button
        type="button"
        onClick={handleLogin}
        style={{
          marginTop: "24px",
          padding: "12px 24px",
          cursor: "pointer",
        }}
      >
        Cognitoでログイン
      </button>
    </main>
  );
}