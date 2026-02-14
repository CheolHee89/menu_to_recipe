import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        recipe: {
          include: {
            ingredients: { orderBy: { sortOrder: "asc" } },
            steps: { orderBy: { stepOrder: "asc" } },
          },
        },
      },
    });
    if (!menu) {
      return NextResponse.json({ error: "메뉴를 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json(menu);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "메뉴를 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, nameKo, category, sortOrder } = body;
    const menu = await prisma.menu.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(nameKo !== undefined && { nameKo: nameKo === null ? null : String(nameKo).trim() }),
        ...(category !== undefined && { category: category === null ? null : String(category).trim() }),
        ...(typeof sortOrder === "number" && { sortOrder }),
      },
    });
    return NextResponse.json(menu);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "메뉴를 수정하지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.menu.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "메뉴를 삭제하지 못했습니다." },
      { status: 500 }
    );
  }
}
