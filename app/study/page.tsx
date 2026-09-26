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
        Tora Roadで実際に作った認証・認可・Next.js機能を、
        後から確認するための学習用ページです。
      </p>

      <div
        style={{
          display: "grid",
          gap: "40px",
          marginTop: "48px",
        }}
      >
        <section>
          <h2>
            OIDC / Public Client - Authorization Code + PKCE
          </h2>

          <p>
            SPAやモバイルアプリのように、
            Client Secretを安全に保持できないクライアント向けの方式です。
          </p>

          <p>
            Public ClientではClient IDは公開情報であり、
            Client Secretを使ったクライアント認証は行いません。
            そのため、Client IDを名乗っているアプリが
            本当に正規のアプリ自身であることまでは確認できません。
          </p>

          <p>
            代わりにPKCEの
            <code> code_verifier </code>
            と
            <code> code_challenge </code>
            を使い、
            認可を開始したクライアントと、
            後から認可コードをトークンへ交換するクライアントが
            同じ主体であることを確認します。
          </p>

          <p>
            つまりPKCEはクライアントそのものの認証ではなく、
            認可コードの横取り対策と、
            認可フローの連続性を確認するための仕組みです。
          </p>

          <p>
            確認ポイント：
            /authorize、code_challenge、認可コードcode、
            code_verifier、/oauth2/token、ID Token、Access Token。
          </p>

          <Link href="/study/oidc-pkce">
            PKCEデモを開く
          </Link>
        </section>

        <section>
          <h2>
            OIDC / Confidential Client - Client Secret
          </h2>

          <p>
            通常のWebサーバやBFFのように、
            Client Secretをサーバー側で安全に保持できる
            クライアント向けの方式です。
          </p>

          <p>
            Client IDでどのアプリケーションクライアントかを識別し、
            トークン交換時にClient Secretも提示することで、
            Cognitoはクライアント自身を認証できます。
          </p>

          <p>
            今回はClient Secretをブラウザには渡さず、
            Next.jsのRoute HandlerからCognitoの
            /oauth2/tokenへ認可コードを送って、
            サーバー側でトークン交換します。
          </p>

          <p>
            確認ポイント：
            ブラウザから/oauth2/tokenへのPOSTが見えないこと、
            Client Secretがブラウザに存在しないこと、
            サーバー側ではトークン取得に成功していること。
          </p>

          <Link href="/study/oidc-client-secret">
            Client Secretデモを開く
          </Link>
        </section>

        <section>
          <h2>Next.js Server Action</h2>

          <p>
            Client ComponentからServer Actionを呼び出し、
            見た目はJavaScriptの関数呼び出しでも、
            実際にはブラウザからNext.jsサーバーへ
            HTTP通信が発生していることを確認します。
          </p>

          <p>
            Server Actionでは通常のAPIのような専用URLではなく、
            POSTリクエストと
            <code> Next-Action </code>
            ヘッダによって実行対象が識別されます。
          </p>

          <p>
            診断ではServer Actionも通常のサーバー処理と同様に、
            認証・認可・入力値検証の対象として確認します。
          </p>

          <p>
            確認ポイント：
            POSTリクエスト、Next-Actionヘッダ、
            リクエストBodyに渡される引数。
          </p>

          <Link href="/study/server-action">
            Server Actionデモを開く
          </Link>
        </section>
      </div>
    </main>
  );
}