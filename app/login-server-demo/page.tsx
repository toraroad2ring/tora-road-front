"use client";

const cognitoDomain =
  "https://ap-northeast-1i0hck1lqp.auth.ap-northeast-1.amazoncognito.com";

const clientId = process.env.NEXT_PUBLIC_COGNITO_SERVER_CLIENT_ID ?? "";

const redirectUri =
  "http://localhost:3000/auth/server-callback";

export default function LoginServerDemoPage() {
  const handleLogin = () => {
    if (!clientId) {
      alert("Client ID が設定されていません。");
      return;
    }

    const state = crypto.randomUUID();

    sessionStorage.setItem("server_oauth_state", state);

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      scope: "openid email",
      redirect_uri: redirectUri,
      state,
    });

    window.location.href =
      `${cognitoDomain}/oauth2/authorize?${params.toString()}`;
  };

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "80px auto",
        padding: "0 24px",
      }}
    >
      <h1>Server-side OIDC Demo</h1>

      <p>
        Client Secret をNext.jsサーバー側だけで保持して、
        Authorization Codeをトークンへ交換するデモです。
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