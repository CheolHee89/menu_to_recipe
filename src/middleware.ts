import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 루트 경로(/)로의 POST 요청 차단
  // 앱에서 Server Action을 사용하지 않으므로, 봇/스캐너의 잘못된 POST 요청으로 인한
  // "Failed to find Server Action" 에러 방지
  if (request.method === "POST" && request.nextUrl.pathname === "/") {
    return new NextResponse(null, { status: 400 });
  }
  return NextResponse.next();
}
