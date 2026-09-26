import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");
  const errorDescription =
    request.nextUrl.searchParams.get("error_description");

  if (error) {
    return NextResponse.json(
      {
        error,
        error_description: errorDescription,
      },
      {
        status: 400,
      }
    );
  }

  if (!code) {
    return NextResponse.json(
      {
        error: "authorization_code_missing",
      },
      {
        status: 400,
      }
    );
  }

  const clientId = process.env.COGNITO_SERVER_CLIENT_ID;
  const clientSecret =
    process.env.COGNITO_SERVER_CLIENT_SECRET;
  const cognitoDomain = process.env.COGNITO_DOMAIN;
  const redirectUri =
    process.env.COGNITO_SERVER_REDIRECT_URI;

  if (
    !clientId ||
    !clientSecret ||
    !cognitoDomain ||
    !redirectUri
  ) {
    return NextResponse.json(
      {
        error: "server_configuration_error",
      },
      {
        status: 500,
      }
    );
  }

  const basicAuth = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  });

  const tokenResponse = await fetch(
    `${cognitoDomain}/oauth2/token`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body,
      cache: "no-store",
    }
  );

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    return NextResponse.json(
      {
        error: "token_exchange_failed",
        detail: tokenData,
      },
      {
        status: tokenResponse.status,
      }
    );
  }

  return NextResponse.json({
    message: "Server-side token exchange succeeded",
    token_type: tokenData.token_type,
    expires_in: tokenData.expires_in,
    id_token_received: Boolean(tokenData.id_token),
    access_token_received: Boolean(
      tokenData.access_token
    ),
    refresh_token_received: Boolean(
      tokenData.refresh_token
    ),
  });
}