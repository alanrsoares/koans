import { RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { KOANS } from "../koans.ts";

interface HeaderProps {
  currentLanguage: string;
  currentCategoryIndex: number;
  onLanguageChange: (value: string) => void;
  onCategoryChange: (index: number) => void;
  onResetProgress: () => void;
}

export function Header({
  currentLanguage,
  currentCategoryIndex,
  onLanguageChange,
  onCategoryChange,
  onResetProgress,
}: HeaderProps) {
  const langConfig = KOANS[currentLanguage];

  return (
    <header className="w-full bg-[#eae3db]/80 backdrop-blur-sm border-b border-[#dbd4cb]/60 py-4 px-6 md:px-12 flex flex-wrap items-center justify-between z-10 relative select-none">
      <div className="flex items-center gap-3">
        <span className="text-2xl text-[#2b2626] font-display" aria-hidden="true">
          ☯
        </span>
        <h1 className="text-base font-bold tracking-wide text-[#4a3e3d] font-display">Zen Koans</h1>
      </div>

      <div className="flex items-center gap-6 mt-2 sm:mt-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold text-[#8c827a] uppercase tracking-wider">
            Path
          </span>
          <Select value={currentLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger
              size="sm"
              className="bg-transparent border-none font-bold text-[#4a3e3d] hover:text-[#2b2626] shadow-none h-auto py-1 px-2 cursor-pointer focus-visible:ring-1 focus-visible:ring-[#2b2626] focus-visible:outline-none rounded"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(KOANS).map((langKey) => (
                <SelectItem key={langKey} value={langKey}>
                  {KOANS[langKey].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold text-[#8c827a] uppercase tracking-wider">
            Lesson
          </span>
          <Select
            value={String(currentCategoryIndex)}
            onValueChange={(val) => onCategoryChange(Number(val))}
          >
            <SelectTrigger
              size="sm"
              className="bg-transparent border-none font-bold text-[#4a3e3d] hover:text-[#2b2626] shadow-none h-auto py-1 px-2 cursor-pointer focus-visible:ring-1 focus-visible:ring-[#2b2626] focus-visible:outline-none rounded max-w-[160px] truncate"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {langConfig?.categories.map((cat, idx) => (
                <SelectItem key={cat.name} value={String(idx)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onResetProgress}
              aria-label="Reset Progress"
              className="text-[#8c827a] hover:text-rose-600 focus-visible:ring-1 focus-visible:ring-[#2b2626] focus-visible:outline-none rounded transition-colors p-1"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Reset Progress</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
