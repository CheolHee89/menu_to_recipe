import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: menuId } = await params;
    const recipe = await prisma.recipe.findUnique({
      where: { menuId },
      include: {
        menu: { select: { id: true, name: true, nameKo: true } },
        ingredients: { orderBy: { sortOrder: "asc" } },
        steps: { orderBy: { stepOrder: "asc" } },
      },
    });
    if (!recipe) {
      return NextResponse.json(
        { error: "이 메뉴에 대한 레시피가 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json(recipe);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "레시피를 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: menuId } = await params;
    const body = await request.json();
    const { servings, description, ingredients, steps } = body;

    const existing = await prisma.recipe.findUnique({ where: { menuId } });
    if (existing) {
      return NextResponse.json(
        { error: "이 메뉴에는 이미 레시피가 등록되어 있습니다." },
        { status: 409 }
      );
    }

    const recipe = await prisma.recipe.create({
      data: {
        menuId,
        servings: typeof servings === "number" ? servings : 1,
        description: description?.trim() ?? null,
        ingredients: Array.isArray(ingredients)
          ? {
              create: ingredients.map((ing: { name: string; amount: string }, i: number) => ({
                name: String(ing.name ?? "").trim(),
                amount: String(ing.amount ?? "").trim(),
                sortOrder: i,
              })),
            }
          : undefined,
        steps: Array.isArray(steps)
          ? {
              create: steps.map((step: { content: string; imageUrl?: string }, i: number) => ({
                stepOrder: i,
                content: String(step.content ?? "").trim(),
                imageUrl: step.imageUrl?.trim() ?? null,
              })),
            }
          : undefined,
      },
      include: {
        ingredients: true,
        steps: true,
      },
    });
    return NextResponse.json(recipe);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "레시피를 등록하지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: menuId } = await params;
    const body = await request.json();
    const { servings, description, ingredients, steps } = body;

    const recipe = await prisma.recipe.findUnique({ where: { menuId } });
    if (!recipe) {
      return NextResponse.json(
        { error: "이 메뉴에 대한 레시피가 없습니다." },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.ingredient.deleteMany({ where: { recipeId: recipe.id } });
      await tx.recipeStep.deleteMany({ where: { recipeId: recipe.id } });
      const updateData: Parameters<typeof tx.recipe.update>[0]["data"] = {};
      if (typeof servings === "number") updateData.servings = servings;
      if (description !== undefined) updateData.description = description === null ? null : String(description).trim();
      if (Array.isArray(ingredients)) {
        updateData.ingredients = {
          create: ingredients.map((ing: { name: string; amount: string }, i: number) => ({
            name: String(ing.name ?? "").trim(),
            amount: String(ing.amount ?? "").trim(),
            sortOrder: i,
          })),
        };
      }
      if (Array.isArray(steps)) {
        updateData.steps = {
          create: steps.map((step: { content: string; imageUrl?: string }, i: number) => ({
            stepOrder: i,
            content: String(step.content ?? "").trim(),
            imageUrl: step.imageUrl?.trim() ?? null,
          })),
        };
      }
      await tx.recipe.update({ where: { id: recipe.id }, data: updateData });
    });

    const updated = await prisma.recipe.findUnique({
      where: { menuId },
      include: { ingredients: true, steps: true },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "레시피를 수정하지 못했습니다." },
      { status: 500 }
    );
  }
}
