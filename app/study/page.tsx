import Link from "next/link";

export default function StudyPage() {
  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "80px auto",
        padding: "0 24px",
      }}
    >
      <h1>AWS / Next.js Study</h1>

      <p>
        Tora Roadで実際に作った認証・認可・Next.js機能を確認するための
        学習用ページです。
      </p>

      <div
        style={{
          display: "grid",
          gap: "32px",
          marginTop: "48px",
        }}
      >
        <section>
          <h2>OIDC / Authorization Code + PKCE</h2>

          <p>
            Client Secretを持たないPublic Client。
            code_verifierとcode_challengeを使って、
            認可コードの横取り対策を確認します。
          </p>

          <p>
            確認ポイント：
            /authorize、code、code_verifier、/oauth2/token、
            ID Token、Access Token。
          </p>

          <Link href="/study/oidc-pkce">
            PKCEデモを開く
          </Link>
        </section>

        <section>
          <h2>OIDC / Client Secret</h2>

          <p>
            Confidential Client。
            Client Secretをブラウザに渡さず、
            Next.jsサーバー側で認可コードをトークンへ交換します。
          </p>

          <p>
            確認ポイント：
            ブラウザから/oAuth2/tokenが見えないこと、
            Client Secretがブラウザに存在しないこと。
          </p>

          <Link href="/study/oidc-client-secret">
            Client Secretデモを開く
          </Link>
        </section>

        <section>
          <h2>Next.js Server Action</h2>

          <p>
            Client ComponentからServer Actionを呼び出し、
            実際にはHTTP通信が発生していることを確認します。
          </p>

          <p>
            確認ポイント：
            POSTリクエストとNext-Actionヘッダ。
          </p>

          <Link href="/study/server-action">
            Server Actionデモを開く
          </Link>
        </section>
      </div>
    </main>
  );
}