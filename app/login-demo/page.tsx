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

export default function LoginDemoPage() {
  const handleLogin = async () => {
    const cognitoDomain =
      "https://ap-northeast-1i0hck1lqp.auth.ap-northeast-1.amazoncognito.com";

    const clientId = "4ks7t38vhms54mf058sbm2jap3";

    const redirectUri = "http://localhost:3000/auth/callback";

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await createCodeChallenge(codeVerifier);

    const state = crypto.randomUUID();

    sessionStorage.setItem("pkce_code_verifier", codeVerifier);
    sessionStorage.setItem("oauth_state", state);

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      scope: "openid email",
      redirect_uri: redirectUri,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    window.location.href = `${cognitoDomain}/oauth2/authorize?${params.toString()}`;
  };

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "80px auto",
        padding: "0 24px",
      }}
    >
      <h1>OIDC Login Demo</h1>

      <p>
        Amazon Cognito を使った Authorization Code Flow + PKCE の学習用ページです。
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