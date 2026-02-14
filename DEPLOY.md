# Vercel 배포 가이드

## 1. 지금 상태로 배포 (빠르게 확인용)

현재 프로젝트는 **SQLite**를 사용합니다. Vercel은 서버리스 환경이라 **파일 기반 DB가 유지되지 않습니다.**  
그래서 “배포는 되지만, 메뉴/레시피가 저장·유지되지 않는” 상태로 뜹니다. 화면만 확인할 때만 사용하세요.

### 절차

1. **GitHub에 코드 올리기**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/본인아이디/저장소이름.git
   git push -u origin main
   ```

2. **Vercel에서 프로젝트 연결**
   - [vercel.com](https://vercel.com) 로그인 후 **Add New → Project**
   - GitHub 저장소 선택 후 **Import**
   - **Environment Variables**는 일단 비워두고 **Deploy** (SQLite는 Vercel에서 동작하지 않음)

3. **배포 후**
   - URL이 생성되면 접속해 보면 앱은 뜨지만, 메뉴/레시피 데이터는 비어 있고 저장해도 유지되지 않습니다.

---

## 2. 실제로 쓰려면: PostgreSQL(Neon) 사용 권장

데이터가 유지되는 서비스를 쓰려면 **PostgreSQL** 같은 클라우드 DB가 필요합니다.

### 2-1. Neon에서 무료 DB 만들기

1. [neon.tech](https://neon.tech) 가입
2. **Create Project** → 리전 선택 후 생성
3. 대시보드에서 **Connection string** 복사 (예: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`)

### 2-2. 프로젝트를 PostgreSQL로 전환

프로젝트에 PostgreSQL + Neon 지원이 들어가 있으면, 아래만 설정하면 됩니다.

1. **Vercel 환경 변수**
   - Vercel 프로젝트 → **Settings → Environment Variables**
   - `DATABASE_URL` = Neon에서 복사한 Postgres URL (Production, Preview 등 필요한 환경에 설정)

2. **배포 시 DB 마이그레이션**
   - Vercel **Build Command**에 마이그레이션 포함하거나, 최초 1회 로컬/CI에서 다음 실행:
   ```bash
   npx prisma migrate deploy
   ```
   - (프로젝트에 Postgres 스키마와 `migrate deploy` 스크립트가 있다고 가정)

3. **시드(선택)**
   - Neon DB에 초기 데이터를 넣으려면 로컬에서:
   ```bash
   DATABASE_URL="postgresql://..." npm run db:seed
   ```

---

## 3. 요약

| 목적 | 방법 |
|------|------|
| “배포만 해서 화면 확인” | GitHub → Vercel Import → Deploy (현재 SQLite 그대로, 데이터는 안 남음) |
| “실제로 메뉴/레시피 저장” | Neon 등으로 PostgreSQL 만들고, 프로젝트를 Postgres로 전환 후 `DATABASE_URL` 설정 |

지금 이 프로젝트는 **SQLite 전용**이라, “실제로 쓰는 배포”를 원하면 Prisma를 **PostgreSQL**로 바꾸고, Neon 연결용 마이그레이션·스크립트를 추가하는 작업이 필요합니다. 원하시면 그 단계별 변경 방법도 정리해 드리겠습니다.
