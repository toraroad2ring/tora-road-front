export default function OidcClientSecretPage() {
  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "80px auto",
        padding: "0 24px",
      }}
    >
      <h1>
        OIDC Client Secret Demo
      </h1>

      <p>
        Client Secretを持つ
        Confidential Clientの
        Authorization Code Flowです。
      </p>

      <h2>PKCE版との違い</h2>

      <pre>
{`PKCE版

Browser
  ↓
Cognito
  ↓ code
Browser
  ↓ code + code_verifier
Cognito /oauth2/token


Client Secret版

Browser
  ↓
Cognito
  ↓ code
Next.js Server
  ↓ code + Client Secret
Cognito /oauth2/token`}
      </pre>

      <h2>見るところ</h2>

      <p>
        DevToolsのNetworkを開いてください。
      </p>

      <p>
        ログイン成功後も、
        ブラウザからCognitoの
        /oauth2/tokenへPOSTしていないことを確認します。
      </p>

      <p>
        Client SecretもAccess Tokenも
        ブラウザへ返しません。
      </p>

      <a
        href="/study/oidc-client-secret/start"
        style={{
          display: "inline-block",
          marginTop: "24px",
        }}
      >
        Cognitoでログイン
      </a>
    </main>
  );
}