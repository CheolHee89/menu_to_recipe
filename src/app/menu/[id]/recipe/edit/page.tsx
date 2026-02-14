"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { IngredientRow, StepRow } from "../RecipeForm";
import { RecipeForm } from "../RecipeForm";

type Recipe = {
  id: string;
  servings: number;
  description: string | null;
  ingredients: { name: string; amount: string }[];
  steps: { content: string }[];
};

async function fetchRecipe(menuId: string): Promise<Recipe> {
  const res = await fetch(`/api/menus/${menuId}/recipe`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "레시피를 불러오지 못했습니다.");
  }
  return res.json();
}

async function updateRecipe(menuId: string, body: { servings: number; description?: string; ingredients: IngredientRow[]; steps: StepRow[] }) {
  const res = await fetch(`/api/menus/${menuId}/recipe`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      servings: body.servings,
      description: body.description?.trim() || null,
      ingredients: body.ingredients.filter((i) => i.name.trim()).map((i) => ({ name: i.name.trim(), amount: i.amount.trim() })),
      steps: body.steps.filter((s) => s.content.trim()).map((s) => ({ content: s.content.trim() })),
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "수정에 실패했습니다.");
  return data;
}

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const menuId = params.id as string;

  const { data: recipe, isLoading, error: loadError } = useQuery({
    queryKey: ["recipe", menuId],
    queryFn: () => fetchRecipe(menuId),
    enabled: !!menuId,
  });

  const [servings, setServings] = useState(1);
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<IngredientRow[]>([{ name: "", amount: "" }]);
  const [steps, setSteps] = useState<StepRow[]>([{ content: "" }]);

  useEffect(() => {
    if (!recipe) return;
    setServings(recipe.servings);
    setDescription(recipe.description ?? "");
    setIngredients(
      recipe.ingredients.length > 0
        ? recipe.ingredients.map((i) => ({ name: i.name, amount: i.amount }))
        : [{ name: "", amount: "" }]
    );
    setSteps(recipe.steps.length > 0 ? recipe.steps.map((s) => ({ content: s.content })) : [{ content: "" }]);
  }, [recipe]);

  const mutation = useMutation({
    mutationFn: (body: Parameters<typeof updateRecipe>[1]) => updateRecipe(menuId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu", menuId] });
      queryClient.invalidateQueries({ queryKey: ["recipe", menuId] });
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      router.push(`/menu/${menuId}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ servings, description, ingredients, steps });
  };

  if (isLoading || !recipe) {
    return (
      <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-[var(--bg)]">
        <header className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-sm border-b border-stone-200/80">
          <div className="px-4 py-3">
            <h1 className="text-lg font-semibold text-stone-900">레시피 수정</h1>
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
            <Link href={`/menu/${menuId}`} className="text-amber-600 font-medium">← 돌아가기</Link>
            <h1 className="text-lg font-semibold">레시피 수정</h1>
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
            href={`/menu/${menuId}`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 text-stone-700 active:bg-stone-200"
            aria-label="취소"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="flex-1 font-semibold text-stone-900 text-lg">레시피 수정</h1>
        </div>
      </header>
      <main className="flex-1 px-4 py-5 pb-8">
        <RecipeForm
          servings={servings}
          description={description}
          ingredients={ingredients}
          steps={steps}
          onServingsChange={setServings}
          onDescriptionChange={setDescription}
          onIngredientsChange={setIngredients}
          onStepsChange={setSteps}
          onSubmit={handleSubmit}
          isPending={mutation.isPending}
          error={mutation.error as Error | null}
          submitLabel="저장"
          cancelHref={`/menu/${menuId}`}
        />
      </main>
    </div>
  );
}
