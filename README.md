# 메뉴 → 레시피

식당 직원이 메뉴를 선택하면 해당 레시피를 볼 수 있는 웹앱 서비스입니다.

## 기능

- **메뉴 목록**: 등록된 메뉴를 카드 형태로 표시 (터치·태블릿 친화적)
- **레시피 보기**: 메뉴 선택 시 재료·인분·조리 순서 표시
- **API**: 메뉴/레시피 CRUD (추가·수정·삭제)

## 정렬 순서

메뉴 목록은 **정렬 순서(sortOrder)** 값으로 순서가 정해집니다.

- **숫자가 작을수록** 목록에서 **앞**에 표시됩니다. (0이 가장 앞)
- 같은 정렬 순서인 메뉴는 **메뉴명(영문) 가나다순**으로 정렬됩니다.
- 메뉴 등록·수정 화면에서 "정렬 순서" 필드로 값을 바꿀 수 있습니다.

## 개발 스택

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Prisma** + **SQLite** (로컬 DB)
- **React Query** (캐싱·서버 상태)
- **@prisma/adapter-better-sqlite3** (Prisma 7 SQLite 연결)

## 사전 요구사항

- Node.js 18+
- npm

## 설치 및 실행

```bash
# 의존성 설치 (이미 되어 있다면 생략)
npm install

# DB 마이그레이션 (최초 1회)
npx prisma migrate dev

# 시드 데이터 넣기 (예시 메뉴 2개·레시피 2개)
npm run db:seed

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다.

## 환경 변수

`.env` 파일 (또는 `.env.example` 참고):

```
DATABASE_URL="file:./dev.db"
```

- SQLite 파일 경로는 프로젝트 루트 기준입니다. `dev.db`는 루트에 생성됩니다.

## API 요약

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/menus` | 메뉴 목록 조회 |
| POST | `/api/menus` | 메뉴 등록 (`name`, `nameKo`, `category`, `sortOrder`) |
| GET | `/api/menus/[id]` | 메뉴 상세 + 레시피 포함 조회 |
| PUT | `/api/menus/[id]` | 메뉴 수정 |
| DELETE | `/api/menus/[id]` | 메뉴 삭제 (연결된 레시피 함께 삭제) |
| GET | `/api/menus/[id]/recipe` | 해당 메뉴의 레시피만 조회 |
| POST | `/api/menus/[id]/recipe` | 레시피 등록 (`servings`, `description`, `ingredients[]`, `steps[]`) |
| PUT | `/api/menus/[id]/recipe` | 레시피 수정 |

## 스크립트

- `npm run dev` — 개발 서버
- `npm run build` — 프로덕션 빌드
- `npm run start` — 프로덕션 서버 실행
- `npm run db:seed` — 시드 데이터 삽입 (메뉴가 없을 때만)
- `npx prisma migrate dev` — 마이그레이션 적용
- `npx prisma generate` — Prisma Client 재생성

## 사용법 (직원)

1. 메인 화면에서 메뉴 카드를 누릅니다.
2. 해당 메뉴의 레시피(재료·조리 순서)가 표시됩니다.
3. 상단 "← 메뉴"로 목록으로 돌아갑니다.

식당 조리실·태블릿 환경을 고려해 버튼과 텍스트를 크게, 대비가 잘 보이도록 구성했습니다.
