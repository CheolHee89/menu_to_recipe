"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

async function createMenu(body: { name: string; nameKo?: string; category?: string; sortOrder?: number }) {
  const res = await fetch("/api/menus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "등록에 실패했습니다.");
  return data;
}

export default function NewMenuPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [nameKo, setNameKo] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const mutation = useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      router.push("/");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      mutation.reset();
      return;
    }
    mutation.mutate({
      name: name.trim(),
      nameKo: nameKo.trim() || undefined,
      category: category.trim() || undefined,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
    });
  };

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-[var(--bg)]">
      <header className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-sm border-b border-stone-200/80">
        <div className="flex items-center gap-2 px-3 py-3">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 text-stone-700 active:bg-stone-200"
            aria-label="취소"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="flex-1 font-semibold text-stone-900 text-lg">메뉴 등록</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 pb-8">
        <form onSubmit={handleSubmit} className="app-card overflow-hidden">
          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-600 mb-1.5">
                메뉴명 (영문) <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="app-input"
                placeholder="예: Spicy Tofu Soup"
              />
            </div>
            <div>
              <label htmlFor="nameKo" className="block text-sm font-medium text-stone-600 mb-1.5">
                메뉴명 (한글)
              </label>
              <input
                id="nameKo"
                type="text"
                value={nameKo}
                onChange={(e) => setNameKo(e.target.value)}
                className="app-input"
                placeholder="예: 매운 두부찌개"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-stone-600 mb-1.5">
                카테고리
              </label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="app-input"
                placeholder="예: 메인, 사이드, 음료"
              />
            </div>
            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-stone-600 mb-1.5">
                정렬 순서
              </label>
              <input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="app-input"
                min={0}
              />
              <p className="mt-1.5 text-xs text-stone-500">
                숫자가 작을수록 목록에서 먼저 보입니다. (0이 가장 앞)
              </p>
            </div>
            {mutation.isError && (
              <p className="text-red-600 text-sm">{(mutation.error as Error).message}</p>
            )}
          </div>
          <div className="flex gap-3 p-4 border-t border-stone-100 bg-stone-50/50">
            <button
              type="submit"
              disabled={mutation.isPending || !name.trim()}
              className="flex-1 rounded-xl font-semibold py-3.5 bg-amber-600 text-white active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {mutation.isPending ? "등록 중…" : "등록"}
            </button>
            <Link
              href="/"
              className="rounded-xl font-medium py-3.5 px-5 border border-stone-200 text-stone-700 bg-white text-center active:scale-[0.98]"
            >
              취소
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
