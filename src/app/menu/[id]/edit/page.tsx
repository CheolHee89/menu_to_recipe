"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Menu = {
  id: string;
  name: string;
  nameKo: string | null;
  category: string | null;
  sortOrder: number;
};

async function fetchMenu(id: string): Promise<Menu> {
  const res = await fetch(`/api/menus/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "메뉴를 불러오지 못했습니다.");
  }
  return res.json();
}

async function updateMenu(id: string, body: { name: string; nameKo?: string; category?: string; sortOrder?: number }) {
  const res = await fetch(`/api/menus/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "수정에 실패했습니다.");
  return data;
}

async function deleteMenu(id: string) {
  const res = await fetch(`/api/menus/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "삭제에 실패했습니다.");
  return data;
}

export default function EditMenuPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: menu, isLoading, error: loadError } = useQuery({
    queryKey: ["menu", id],
    queryFn: () => fetchMenu(id),
    enabled: !!id,
  });

  const [name, setName] = useState("");
  const [nameKo, setNameKo] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    if (!menu) return;
    setName(menu.name);
    setNameKo(menu.nameKo ?? "");
    setCategory(menu.category ?? "");
    setSortOrder(menu.sortOrder);
  }, [menu]);

  const mutation = useMutation({
    mutationFn: (body: Parameters<typeof updateMenu>[1]) => updateMenu(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      queryClient.invalidateQueries({ queryKey: ["menu", id] });
      router.push(`/menu/${id}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteMenu(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      router.push("/");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate({
      name: name.trim(),
      nameKo: nameKo.trim() || undefined,
      category: category.trim() || undefined,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
    });
  };

  const handleDelete = () => {
    if (!confirm("이 메뉴를 삭제할까요? 연결된 레시피도 함께 삭제됩니다.")) return;
    deleteMutation.mutate();
  };

  if (isLoading || !menu) {
    return (
      <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-[var(--bg)]">
        <header className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-sm border-b border-stone-200/80">
          <div className="px-4 py-3">
            <h1 className="text-lg font-semibold text-stone-900">메뉴 수정</h1>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        </main>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-[var(--bg)]">
        <header className="sticky top-0 z-10 border-b border-stone-200">
          <div className="px-4 py-3 flex items-center gap-2">
            <Link href={`/menu/${id}`} className="text-amber-600 font-medium">← 돌아가기</Link>
            <h1 className="text-lg font-semibold">메뉴 수정</h1>
          </div>
        </header>
        <main className="flex-1 px-4 py-6">
          <p className="text-red-600">{(loadError as Error).message}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-[var(--bg)]">
      <header className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-sm border-b border-stone-200/80">
        <div className="flex items-center gap-2 px-3 py-3">
          <Link
            href={`/menu/${id}`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 text-stone-700 active:bg-stone-200"
            aria-label="취소"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="flex-1 font-semibold text-stone-900 text-lg">메뉴 수정</h1>
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
              {mutation.isPending ? "저장 중…" : "저장"}
            </button>
            <Link
              href={`/menu/${id}`}
              className="rounded-xl font-medium py-3.5 px-5 border border-stone-200 text-stone-700 bg-white text-center active:scale-[0.98]"
            >
              취소
            </Link>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-200">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="w-full rounded-xl font-medium py-3 text-red-600 border border-red-200 bg-red-50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {deleteMutation.isPending ? "삭제 중…" : "메뉴 삭제"}
          </button>
          {deleteMutation.isError && (
            <p className="mt-2 text-red-600 text-sm text-center">{(deleteMutation.error as Error).message}</p>
          )}
        </div>
      </main>
    </div>
  );
}
