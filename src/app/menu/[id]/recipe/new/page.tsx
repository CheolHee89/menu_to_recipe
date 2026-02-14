"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import type { IngredientRow, StepRow } from "../RecipeForm";
import { RecipeForm } from "../RecipeForm";

async function createRecipe(menuId: string, body: { servings: number; description?: string; ingredients: IngredientRow[]; steps: StepRow[] }) {
  const res = await fetch(`/api/menus/${menuId}/recipe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      servings: body.servings,
      description: body.description?.trim() || null,
      ingredients: body.ingredients.filter((i) => i.name.trim()).map((i) => ({ name: i.name.trim(), amount: i.amount.trim() })),
      steps: body.steps.filter((s) => s.content.trim()).map((s) => ({ content: s.content.trim() })),
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "등록에 실패했습니다.");
  return data;
}

export default function NewRecipePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const menuId = params.id as string;

  const [servings, setServings] = useState(1);
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<IngredientRow[]>([{ name: "", amount: "" }]);
  const [steps, setSteps] = useState<StepRow[]>([{ content: "" }]);

  const mutation = useMutation({
    mutationFn: (body: Parameters<typeof createRecipe>[1]) => createRecipe(menuId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu", menuId] });
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      router.push(`/menu/${menuId}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ servings, description, ingredients, steps });
  };

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
          <h1 className="flex-1 font-semibold text-stone-900 text-lg">레시피 등록</h1>
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
          submitLabel="등록"
          cancelHref={`/menu/${menuId}`}
        />
      </main>
    </div>
  );
}
