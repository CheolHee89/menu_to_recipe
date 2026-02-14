"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type Menu = {
  id: string;
  name: string;
  nameKo: string | null;
  category: string | null;
  sortOrder: number;
  recipe: { id: string } | null;
};

async function fetchMenus(): Promise<Menu[]> {
  const res = await fetch("/api/menus");
  if (!res.ok) throw new Error("메뉴 목록을 불러오지 못했습니다.");
  return res.json();
}

export default function Home() {
  const { data: menus, isLoading, error } = useQuery({
    queryKey: ["menus"],
    queryFn: fetchMenus,
  });

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto">
      {/* 앱 스타일 헤더 */}
      <header className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-sm border-b border-stone-200/80">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">메뉴</h1>
              <p className="text-xs text-stone-500 mt-0.5">탭하면 레시피가 열려요</p>
            </div>
            <Link
              href="/menu/new"
              className="flex items-center gap-2 rounded-full bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 shadow-sm active:scale-95 transition-transform"
            >
              <span className="text-lg leading-none">+</span>
              메뉴 등록
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 pb-8">
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          </div>
        )}
        {error && (
          <div className="app-card p-4 text-red-600 text-sm">
            {(error as Error).message}
          </div>
        )}
        {menus && menus.length === 0 && (
          <div className="app-card p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl mx-auto mb-4">📋</div>
            <p className="text-stone-600 font-medium">등록된 메뉴가 없어요</p>
            <p className="text-stone-500 text-sm mt-1">위의 「메뉴 등록」으로 추가해 보세요</p>
          </div>
        )}
        {menus && menus.length > 0 && (
          <ul className="space-y-3">
            {menus.map((menu) => (
              <li key={menu.id}>
                <Link
                  href={`/menu/${menu.id}`}
                  className="app-card block p-4 active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 text-lg truncate">
                        {menu.nameKo ?? menu.name}
                      </p>
                      {menu.category && (
                        <p className="text-xs text-stone-500 mt-0.5">{menu.category}</p>
                      )}
                    </div>
                    {menu.recipe ? (
                      <span className="shrink-0 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                        레시피
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs text-stone-400">미등록</span>
                    )}
                    <span className="text-stone-300">›</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
