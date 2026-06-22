// Fontsource packages ship CSS with no type declarations; these are
// side-effect imports only.
declare module "@fontsource-variable/*";
declare module "@fontsource/*";

interface TypeScriptCompiler {
  ScriptTarget: {
    ES2020: number;
  };
  ModuleKind: {
    None: number;
  };
  transpileModule: (
    code: string,
    options: {
      compilerOptions: {
        target: number;
        module: number;
      };
    }
  ) => { outputText: string };
}

interface SquintCompiler {
  compileString: (code: string, options: { "elide-imports": boolean; context: string }) => string;
}

interface CoffeeScriptCompiler {
  compile: (code: string, options: { bare: boolean }) => string;
}

interface CivetCompiler {
  compile: (code: string, options?: { js?: boolean }) => Promise<string>;
}

interface GleamCompiler {
  default: (wasmUrl: string) => Promise<void>;
  reset_filesystem: (id: number) => void;
  write_module: (id: number, name: string, code: string) => void;
  compile_package: (id: number, target: string) => void;
  pop_warning: (id: number) => string | undefined;
  read_compiled_javascript: (id: number, name: string) => string | undefined;
}

interface Window {
  ts?: TypeScriptCompiler;
  squint_compiler?: SquintCompiler;
  squint_core?: unknown;
  CoffeeScript?: CoffeeScriptCompiler;
  Civet?: CivetCompiler;
  gleam_compiler?: GleamCompiler;
  webkitAudioContext?: typeof AudioContext;
}
