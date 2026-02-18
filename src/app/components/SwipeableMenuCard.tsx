"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

type Menu = {
  id: string;
  name: string;
  nameKo: string | null;
  category: string | null;
  sortOrder: number;
  recipe: { id: string } | null;
};

const DELETE_WIDTH = 80;

type Props = {
  menu: Menu;
  onDelete: (id: string) => void;
};

export function SwipeableMenuCard({ menu, onDelete }: Props) {
  const [offset, setOffset] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart === null) return;
      const delta = e.touches[0].clientX - touchStart;
      // 왼쪽으로만 스와이프 (음수값)
      const newOffset = Math.max(-DELETE_WIDTH, Math.min(0, delta));
      setOffset(newOffset);
    },
    [touchStart]
  );

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
    setIsDragging(false);
    // 스와이프가 절반 넘으면 열림
    setOffset((prev) => (prev < -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0));
  }, []);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("이 메뉴를 삭제할까요? 연결된 레시피도 함께 삭제됩니다.")) {
      onDelete(menu.id);
    }
  };

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)]">
      <div
        className="flex relative"
        style={{
          transform: `translateX(${offset}px)`,
          transition: isDragging ? "none" : "transform 0.2s ease-out",
          touchAction: "pan-y",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Link
          href={`/menu/${menu.id}`}
          className="app-card block p-4 active:scale-[0.99] transition-transform shrink-0 w-full"
          onClick={(e) => {
            if (offset < 0) {
              e.preventDefault();
              setOffset(0);
            }
          }}
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
        <button
          type="button"
          onClick={handleDeleteClick}
          className="shrink-0 w-20 flex items-center justify-center bg-red-500 text-white text-sm font-medium active:bg-red-600"
          aria-label="메뉴 삭제"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
