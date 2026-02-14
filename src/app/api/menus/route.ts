import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        recipe: {
          select: { id: true },
        },
      },
    });
    return NextResponse.json(menus);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "메뉴 목록을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, nameKo, category, sortOrder } = body;
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "메뉴명(name)이 필요합니다." },
        { status: 400 }
      );
    }
    const menu = await prisma.menu.create({
      data: {
        name: name.trim(),
        nameKo: nameKo?.trim() ?? null,
        category: category?.trim() ?? null,
        sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
      },
    });
    return NextResponse.json(menu);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "메뉴를 등록하지 못했습니다." },
      { status: 500 }
    );
  }
}
