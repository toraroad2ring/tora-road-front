import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function GET(
  request: NextRequest
) {
  const code =
    request.nextUrl.searchParams.get(
      "code"
    );

  const returnedState =
    request.nextUrl.searchParams.get(
      "state"
    );

  const error =
    request.nextUrl.searchParams.get(
      "error"
    );

  const errorDescription =
    request.nextUrl.searchParams.get(
      "error_description"
    );

  if (error) {
    return NextResponse.json(
      {
        error,
        error_description:
          errorDescription,
      },
      {
        status: 400,
      }
    );
  }

  if (!code) {
    return NextResponse.json(
      {
        error:
          "authorization_code_missing",
      },
      {
        status: 400,
      }
    );
  }

  const savedState =
    request.cookies.get(
      "oidc_server_state"
    )?.value;

  if (
    !savedState ||
    !returnedState ||
    savedState !== returnedState
  ) {
    return NextResponse.json(
      {
        error:
          "oauth_state_mismatch",
      },
      {
        status: 400,
      }
    );
  }

  const clientId =
    process.env
      .COGNITO_SERVER_CLIENT_ID;

  const clientSecret =
    process.env
      .COGNITO_SERVER_CLIENT_SECRET;

  const cognitoDomain =
    process.env.COGNITO_DOMAIN;

  if (
    !clientId ||
    !clientSecret ||
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

  const redirectUri =
    `${request.nextUrl.origin}/study/oidc-client-secret/callback`;

  const basicAuth =
    Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

  const body =
    new URLSearchParams({
      grant_type:
        "authorization_code",
      code,
      redirect_uri:
        redirectUri,
    });

  const tokenResponse =
    await fetch(
      `${cognitoDomain}/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",

          Authorization:
            `Basic ${basicAuth}`,
        },
        body,
        cache: "no-store",
      }
    );

  const tokenData =
    await tokenResponse.json();

  if (!tokenResponse.ok) {
    return NextResponse.json(
      {
        error:
          "token_exchange_failed",
        detail: tokenData,
      },
      {
        status:
          tokenResponse.status,
      }
    );
  }

  const response =
    NextResponse.json({
      message:
        "Server-side Authorization Code Flow succeeded",

      explanation:
        "Client Secret and tokens stayed on the Next.js server.",

      token_type:
        tokenData.token_type,

      expires_in:
        tokenData.expires_in,

      access_token_received:
        Boolean(
          tokenData.access_token
        ),

      id_token_received:
        Boolean(
          tokenData.id_token
        ),

      refresh_token_received:
        Boolean(
          tokenData.refresh_token
        ),
    });

  response.cookies.delete(
    "oidc_server_state"
  );

  return response;
}