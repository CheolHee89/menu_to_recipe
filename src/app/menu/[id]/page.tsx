"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

type MenuDetail = {
  id: string;
  name: string;
  nameKo: string | null;
  category: string | null;
  recipe: {
    id: string;
    servings: number;
    description: string | null;
    ingredients: { id: string; name: string; amount: string; sortOrder: number }[];
    steps: { id: string; stepOrder: number; content: string; imageUrl: string | null }[];
  } | null;
};

async function fetchMenu(id: string): Promise<MenuDetail> {
  const res = await fetch(`/api/menus/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "메뉴를 불러오지 못했습니다.");
  }
  return res.json();
}

export default function MenuRecipePage() {
  const params = useParams();
  const id = params.id as string;

  const { data: menu, isLoading, error } = useQuery({
    queryKey: ["menu", id],
    queryFn: () => fetchMenu(id),
    enabled: !!id,
  });

  const recipe = menu?.recipe ?? null;
  const displayName = menu ? (menu.nameKo ?? menu.name) : "레시피";

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-[var(--bg)]">
      {/* 앱 스타일 네비바 */}
      <header className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-sm border-b border-stone-200/80">
        <div className="flex items-center gap-2 px-3 py-3">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 text-stone-700 active:bg-stone-200 transition-colors"
            aria-label="메뉴 목록으로"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="flex-1 font-semibold text-stone-900 truncate text-lg">
            {displayName}
          </h1>
          {menu && (
            <div className="flex items-center gap-1.5">
              <Link
                href={`/menu/${id}/edit`}
                className="flex items-center justify-center w-9 h-9 rounded-full text-stone-500 hover:bg-stone-100 active:bg-stone-200"
                aria-label="메뉴 수정"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
              {recipe ? (
                <Link
                  href={`/menu/${id}/recipe/edit`}
                  className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-2 rounded-lg active:scale-95"
                >
                  레시피 수정
                </Link>
              ) : (
                <Link
                  href={`/menu/${id}/recipe/new`}
                  className="text-sm font-semibold text-white bg-amber-600 px-3 py-2 rounded-lg active:scale-95"
                >
                  레시피 등록
                </Link>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-5 pb-8">
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          </div>
        )}
        {error && (
          <div className="app-card p-4 text-red-600 text-sm flex flex-col gap-3">
            <p>{(error as Error).message}</p>
            <Link href="/" className="text-amber-600 font-medium">
              메뉴 목록으로 돌아가기
            </Link>
          </div>
        )}
        {menu && !recipe && (
          <div className="app-card p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl mx-auto mb-4">📝</div>
            <p className="text-stone-600 font-medium">이 메뉴에 레시피가 없어요</p>
            <Link
              href={`/menu/${id}/recipe/new`}
              className="inline-flex items-center gap-2 mt-4 rounded-xl bg-amber-600 text-white font-semibold px-5 py-3 active:scale-95"
            >
              레시피 등록하기
            </Link>
          </div>
        )}
        {menu && recipe && (
          <article className="space-y-5">
            {recipe.description && (
              <div className="app-card p-4">
                <p className="text-stone-600 leading-relaxed">{recipe.description}</p>
              </div>
            )}
            <section className="app-card overflow-hidden">
              <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                  재료
                </h2>
                {recipe.servings > 0 && (
                  <span className="text-xs text-stone-400">{recipe.servings}인분</span>
                )}
              </div>
              <ul className="divide-y divide-stone-100">
                {recipe.ingredients.length === 0 ? (
                  <li className="px-4 py-4 text-stone-400 text-sm">재료 정보 없음</li>
                ) : (
                  recipe.ingredients.map((ing) => (
                    <li key={ing.id} className="px-4 py-3 flex justify-between gap-4 items-baseline">
                      <span className="text-stone-800">{ing.name}</span>
                      <span className="text-stone-500 text-sm shrink-0">{ing.amount}</span>
                    </li>
                  ))
                )}
              </ul>
            </section>
            <section className="app-card overflow-hidden">
              <div className="px-4 py-3 border-b border-stone-100">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                  조리 순서
                </h2>
              </div>
              <ol className="divide-y divide-stone-100">
                {recipe.steps.length === 0 ? (
                  <li className="px-4 py-4 text-stone-400 text-sm">조리 단계 없음</li>
                ) : (
                  recipe.steps.map((step) => (
                    <li key={step.id} className="flex gap-4 px-4 py-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-sm font-bold">
                        {step.stepOrder + 1}
                      </span>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-stone-800 leading-relaxed whitespace-pre-wrap">
                          {step.content}
                        </p>
                        {step.imageUrl && (
                          <img
                            src={step.imageUrl}
                            alt={`단계 ${step.stepOrder + 1}`}
                            className="mt-3 rounded-xl max-w-full h-auto"
                          />
                        )}
                      </div>
                    </li>
                  ))
                )}
              </ol>
            </section>
          </article>
        )}
      </main>
    </div>
  );
}
