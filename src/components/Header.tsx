import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { KOANS } from "../koans.ts";
import { LangIcon } from "./LangIcon.tsx";
import { ZenIcon } from "./ZenIcon.tsx";

interface HeaderProps {
  currentLanguage: string;
  currentCategoryIndex: number;
  soundEnabled: boolean;
  onLanguageChange: (value: string) => void;
  onCategoryChange: (index: number) => void;
  onToggleSound: () => void;
  onResetProgress: () => void;
}

export function Header({
  currentLanguage,
  currentCategoryIndex,
  soundEnabled,
  onLanguageChange,
  onCategoryChange,
  onToggleSound,
  onResetProgress,
}: HeaderProps) {
  const langConfig = KOANS[currentLanguage];

  return (
    <header className="w-full bg-[#eae3db]/80 backdrop-blur-sm border-b border-[#dbd4cb]/60 py-4 px-6 md:px-12 flex flex-wrap items-center justify-between z-10 relative select-none">
      <div className="flex items-center gap-3">
        <ZenIcon
          src="svg/yin_yang_leaf_symbol.svg"
          className="size-6 opacity-85"
          style={{
            filter: "brightness(0.3) sepia(0.1)",
          }}
        />
        <h1 className="text-base font-bold tracking-wide text-[#4a3e3d] font-display">Zen Koans</h1>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleSound}
              aria-label={soundEnabled ? "Mute sound effects" : "Unmute sound effects"}
              aria-pressed={!soundEnabled}
              className="ml-1 text-[#8c827a] hover:text-[#2b2626] focus-visible:ring-1 focus-visible:ring-[#2b2626] focus-visible:outline-none rounded transition-colors p-1"
            >
              {soundEnabled ? (
                <Volume2 className="size-4" aria-hidden="true" />
              ) : (
                <VolumeX className="size-4" aria-hidden="true" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>{soundEnabled ? "Mute chime" : "Unmute chime"}</TooltipContent>
        </Tooltip>
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
                  <LangIcon lang={langKey} className="size-4 shrink-0" />
                  {KOANS[langKey]?.name ?? ""}
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
