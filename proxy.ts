import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  const username = process.env.STUDY_BASIC_USER;
  const password = process.env.STUDY_BASIC_PASSWORD;

  if (!username || !password) {
    return new NextResponse("Server configuration error", {
      status: 500,
    });
  }

  if (authorization) {
    const [scheme, encoded] = authorization.split(" ");

    if (scheme === "Basic" && encoded) {
      try {
        const decoded = atob(encoded);
        const separatorIndex = decoded.indexOf(":");

        if (separatorIndex !== -1) {
          const inputUsername = decoded.slice(0, separatorIndex);
          const inputPassword = decoded.slice(separatorIndex + 1);

          if (
            inputUsername === username &&
            inputPassword === password
          ) {
            return NextResponse.next();
          }
        }
      } catch {
        // 不正なAuthorizationヘッダーは認証失敗として扱う
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Tora Road Study"',
    },
  });
}

export const config = {
  matcher: ["/study/:path*"],
};