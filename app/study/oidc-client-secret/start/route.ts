import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function GET(
  request: NextRequest
) {
  const clientId =
    process.env
      .COGNITO_SERVER_CLIENT_ID;

  const cognitoDomain =
    process.env.COGNITO_DOMAIN;

  if (
    !clientId ||
    !cognitoDomain
  ) {
    return NextResponse.json(
      {
        error:
          "server_configuration_error",
      },
      {
        status: 500,
      }
    );
  }

  const origin =
    request.nextUrl.origin;

  const redirectUri =
    `${origin}/study/oidc-client-secret/callback`;

  const state =
    crypto.randomUUID();

  const params =
    new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      scope: "openid email",
      redirect_uri:
        redirectUri,
      state,
    });

  const authorizeUrl =
    `${cognitoDomain}/oauth2/authorize?${params.toString()}`;

  const response =
    NextResponse.redirect(
      authorizeUrl
    );

  response.cookies.set(
    "oidc_server_state",
    state,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    }
  );

  return response;
}