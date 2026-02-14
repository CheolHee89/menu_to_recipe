"use client";

import Link from "next/link";

export type IngredientRow = { name: string; amount: string };
export type StepRow = { content: string };

type RecipeFormProps = {
  servings: number;
  description: string;
  ingredients: IngredientRow[];
  steps: StepRow[];
  onServingsChange: (v: number) => void;
  onDescriptionChange: (v: string) => void;
  onIngredientsChange: (v: IngredientRow[]) => void;
  onStepsChange: (v: StepRow[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  error: Error | null;
  submitLabel: string;
  cancelHref: string;
};

export function RecipeForm({
  servings,
  description,
  ingredients,
  steps,
  onServingsChange,
  onDescriptionChange,
  onIngredientsChange,
  onStepsChange,
  onSubmit,
  isPending,
  error,
  submitLabel,
  cancelHref,
}: RecipeFormProps) {
  const addIngredient = () => onIngredientsChange([...ingredients, { name: "", amount: "" }]);
  const removeIngredient = (i: number) => onIngredientsChange(ingredients.filter((_, idx) => idx !== i));
  const updateIngredient = (i: number, field: "name" | "amount", value: string) => {
    const next = [...ingredients];
    next[i] = { ...next[i], [field]: value };
    onIngredientsChange(next);
  };

  const addStep = () => onStepsChange([...steps, { content: "" }]);
  const removeStep = (i: number) => onStepsChange(steps.filter((_, idx) => idx !== i));
  const updateStep = (i: number, value: string) => {
    const next = [...steps];
    next[i] = { content: value };
    onStepsChange(next);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="app-card p-4">
        <label className="block text-sm font-medium text-stone-600 mb-1.5">인분</label>
        <input
          type="number"
          min={1}
          value={servings}
          onChange={(e) => onServingsChange(Number(e.target.value) || 1)}
          className="app-input"
        />
      </div>
      <div className="app-card p-4">
        <label className="block text-sm font-medium text-stone-600 mb-1.5">요약 설명</label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={2}
          className="app-input resize-none"
          placeholder="간단한 소개 (선택)"
        />
      </div>

      <div className="app-card overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex justify-between items-center">
          <span className="text-sm font-semibold text-stone-600">재료</span>
          <button type="button" onClick={addIngredient} className="text-amber-600 font-semibold text-sm py-1">
            + 추가
          </button>
        </div>
        <div className="divide-y divide-stone-100">
          {ingredients.map((ing, i) => (
            <div key={i} className="px-4 py-3 flex gap-2 items-center">
              <input
                value={ing.name}
                onChange={(e) => updateIngredient(i, "name", e.target.value)}
                placeholder="재료명"
                className="flex-[4] min-w-0 app-input py-2.5"
              />
              <input
                value={ing.amount}
                onChange={(e) => updateIngredient(i, "amount", e.target.value)}
                placeholder="양"
                className="flex-[1] min-w-0 app-input py-2.5"
              />
              <button type="button" onClick={() => removeIngredient(i)} className="text-red-500 text-sm font-medium px-2 py-1.5 shrink-0">
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="app-card overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100 flex justify-between items-center">
          <span className="text-sm font-semibold text-stone-600">조리 순서</span>
          <button type="button" onClick={addStep} className="text-amber-600 font-semibold text-sm py-1">
            + 단계 추가
          </button>
        </div>
        <div className="divide-y divide-stone-100">
          {steps.map((step, i) => (
            <div key={i} className="px-4 py-3 flex gap-3 items-start">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-sm font-bold">
                {i + 1}
              </span>
              <textarea
                value={step.content}
                onChange={(e) => updateStep(i, e.target.value)}
                placeholder="조리 내용"
                rows={2}
                className="flex-1 min-w-0 app-input py-2.5 resize-none"
              />
              <button type="button" onClick={() => removeStep(i)} className="text-red-500 text-sm font-medium px-2 py-1.5 shrink-0 mt-1">
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error.message}</p>}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-xl font-semibold py-3.5 bg-amber-600 text-white active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPending ? "저장 중…" : submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="rounded-xl font-medium py-3.5 px-5 border border-stone-200 text-stone-700 bg-white text-center active:scale-[0.98]"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
