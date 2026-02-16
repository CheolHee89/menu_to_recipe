"use client";

import { useEffect, useState } from "react";

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as unknown as { MSStream?: boolean }).MSStream
    );
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    setMounted(true);
  }, []);

  if (!mounted || isStandalone) {
    return null;
  }

  return (
    <div className="app-card p-4 mb-4">
      <p className="text-sm font-medium text-stone-700">홈 화면에 추가</p>
      <p className="text-xs text-stone-500 mt-1">
        앱처럼 사용하려면 홈 화면에 추가하세요.
      </p>
      {isIOS && (
        <p className="text-xs text-stone-600 mt-2 flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-stone-200 text-stone-600 font-medium">
            ⎋
          </span>
          공유 버튼을 누른 후
          <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-stone-200 text-stone-600 font-medium">
            ➕
          </span>
          「홈 화면에 추가」를 선택하세요.
        </p>
      )}
    </div>
  );
}
