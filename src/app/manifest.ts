import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "메뉴 → 레시피",
    short_name: "메뉴레시피",
    description: "식당 직원용 메뉴 선택 시 레시피를 보여주는 서비스",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f6f3",
    theme_color: "#b45309",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
