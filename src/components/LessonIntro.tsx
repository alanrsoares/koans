import type React from "react";
import { useKoanStore } from "../store/koanStore.ts";
import { BrushUnderline } from "./BrushUnderline.tsx";

const ICON_MAPPINGS = [
  { keywords: ["annotation"], path: "/svg/buddha_statue.svg" },
  { keywords: ["interface", "object", "map"], path: "/svg/yin_yang_leaf_symbol.svg" },
  { keywords: ["union", "intersection", "custom type"], path: "/svg/buddhism_lotus.svg" },
  { keywords: ["generic"], path: "/svg/zen_brush_symbol.svg" },
  { keywords: ["higher-order"], path: "/svg/buddhist_flower.svg" },
  { keywords: ["recursion", "pipeline", "data"], path: "/svg/yoga_pose_with_lotus_background.svg" },
  { keywords: ["string"], path: "/svg/pure_water_drop.svg" },
  { keywords: ["equality", "truth"], path: "/svg/yin_yang_leaf_symbol.svg" },
  { keywords: ["array", "vector", "list", "range"], path: "/svg/bamboo_with_leaves.svg" },
  { keywords: ["function", "scope", "arrow"], path: "/svg/two_tea_leaves.svg" },
  { keywords: ["lisp", "temple"], path: "/svg/buddhist_temple.svg" },
  { keywords: ["typing", "sweetness", "hut"], path: "/svg/buddist_hut.svg" },
];

function getCategoryIcon(name: string): string {
  const norm = name.toLowerCase();
  const match = ICON_MAPPINGS.find((m) => m.keywords.some((kw) => norm.includes(kw)));
  return match ? match.path : "/svg/yin_yang_leaf_symbol.svg";
}

export function LessonIntro(): React.JSX.Element {
  const [{ category }] = useKoanStore();
  const iconPath = category ? getCategoryIcon(category.name) : null;

  return (
    <div className="text-center mb-14 select-none flex flex-col items-center">
      {iconPath && (
        <img
          src={iconPath}
          alt=""
          className="size-16 mb-5 opacity-75 filter dark:invert"
          style={{
            filter: "brightness(0.3) sepia(0.1)",
          }}
          aria-hidden="true"
        />
      )}
      <h2 className="text-4xl text-ink tracking-normal font-brush text-balance leading-tight">
        {category?.name}
      </h2>
      <BrushUnderline />
      <p className="mt-6 text-base text-muted-foreground italic font-serif leading-relaxed max-w-[560px] mx-auto text-pretty">
        “{category?.quote}”
      </p>
    </div>
  );
}
