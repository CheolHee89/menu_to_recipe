import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 스캐너/봇이 탐색하는 민감 경로 패턴 (즉시 403 반환)
const SCANNER_PATH_PATTERNS = [
  /^\/\.env/i,
  /\/\.env/i,
  /\.env\./i,
  /\.env$/i,
  /\.(git|gitignore|gitconfig|git-credentials)$/i,
  /\.(htaccess|htpasswd|boto)$/i,
  /\.(key|pem|crt|secret|credentials)$/i,
  /\.(sql|bak|backup|old|save|swp|dist|template)$/i,
  /\.(json|yml|yaml|ini|conf|config)\.(bak|old|backup|save)$/i,
  /^(\/config|\/storage|\/backup|\/tmp|\/temp|\/var)(\/|$)/i,
  /\/wp-config/i,
  /\/config\.(php|inc|yml|yaml|json)$/i,
  /\/database\.(php|yml|yaml|sql)$/i,
  /\/\.(terraform|aws|s3cfg|vault-token|sentryclirc)/i,
  /\/aws[_-]?(key|secret|config|credentials)/i,
  /\/stripe[_-]?(key|secret|config)/i,
  /\/credentials?(\.(json|yml|txt))?$/i,
  /\/secrets?(\.(json|yml|txt))?$/i,
  /\/\.(svn|vscode|idea|project|classpath|DS_Store)/i,
  /\/admin(er)?\.php$/i,
  /\/debug\.(php|log)$/i,
  /\/error(_log)?$/i,
  /\/artisan$/i,
  /\/composer\.lock$/i,
  /\/package(-lock)?\.json$/i,
  /\/Pipfile(\.lock)?$/i,
  /\/Gemfile\.lock$/i,
  /\/terraform\.(tfstate|tfvars)$/i,
  /\/docker-compose/i,
  /\/\.(npmrc|yarnrc)$/i,
];

function isScannerPath(pathname: string): boolean {
  return SCANNER_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 스캐너 경로 즉시 차단 (403)
  if (isScannerPath(pathname)) {
    return new NextResponse(null, { status: 403 });
  }

  // 루트 경로(/)로의 POST 요청 차단
  if (request.method === "POST" && pathname === "/") {
    return new NextResponse(null, { status: 400 });
  }

  return NextResponse.next();
}
