import type { LanguagePath } from "./types.ts";

export const typescript: LanguagePath = {
  name: "TypeScript",
  theme: "ts-theme",
  categories: [
    {
      name: "Type Annotations",
      quote: "Structure brings order to chaos.",
      exercises: [
        {
          description: "TypeScript lets you annotate variables with types. What type is age?",
          template:
            'const age: number = __;\nassert.equal(typeof age, "number");\nassert.equal(age, 42);',
        },
        {
          description: "Strings are annotated with 'string'. Provide a matching string.",
          template:
            'const language: string = __;\nassert.equal(typeof language, "string");\nassert.equal(language, "TypeScript");',
        },
        {
          description: "Boolean values represent true/false states. Set this boolean correctly.",
          template: "const isEnlightened: boolean = __;\nassert.equal(isEnlightened, true);",
        },
      ],
    },
    {
      name: "Interfaces & Objects",
      quote: "Clear agreements make harmonious systems.",
      exercises: [
        {
          description:
            "Interfaces define the structure of an object. Complete the point coordinate.",
          template:
            "interface Point {\n  x: number;\n  y: number;\n}\nconst p: Point = { x: 5, y: __ };\nassert.equal(p.x * p.y, 50);",
        },
        {
          description:
            "Optional properties are marked with a '?'. They default to undefined if omitted.",
          template:
            'interface Profile {\n  name: string;\n  status?: string;\n}\nconst p: Profile = { name: "Zen" };\nassert.equal(p.status, __);',
        },
        {
          description:
            "Readonly properties cannot be reassigned after initialization. What happens if we try?",
          template:
            'interface Config {\n  readonly apiKey: string;\n}\nconst c: Config = { apiKey: "safe-key" };\n// c.apiKey = "new-key"; // This would cause a compile error\nassert.equal(c.apiKey, __);',
        },
      ],
    },
    {
      name: "Unions & Intersection",
      quote: "Truth is multi-faceted; it can exist in multiple forms.",
      exercises: [
        {
          description:
            "Union types allow a variable to hold values of multiple types. Assign a string.",
          template: 'let id: string | number = __;\nassert.equal(typeof id, "string");',
        },
        {
          description: "You can constrain values to specific literals using literal types.",
          template:
            'let direction: "left" | "right" | "up" | "down";\ndirection = __;\nassert.equal(direction, "up");',
        },
        {
          description: "Type aliases create custom names for types. Assign a type-safe age.",
          template:
            'type UserId = number;\nconst user: UserId = __;\nassert.equal(typeof user, "number");',
        },
      ],
    },
    {
      name: "Generics",
      quote: "Generality is the key to reuse and abstraction.",
      exercises: [
        {
          description: "Generics create reusable components that work over a variety of types.",
          template:
            'function wrapValue<T>(val: T): { value: T } {\n  return { value: val };\n}\nconst wrapped = wrapValue<string>(__);\nassert.equal(wrapped.value, "enlightened");',
        },
        {
          description:
            "Generics can also be used with interfaces. Complete the generic box content.",
          template:
            "interface Box<T> {\n  contents: T;\n}\nconst box: Box<number> = { contents: __ };\nassert.equal(box.contents + 10, 100);",
        },
      ],
    },
    {
      name: "Higher-Order Functions",
      quote: "Functions that take functions reveal the shape of abstraction.",
      exercises: [
        {
          description: "A callback's type describes what it accepts and returns.",
          template:
            'const nums: number[] = [1, 2, 3];\nconst strs: string[] = nums.map(n => String(n * __));\nassert.deepEqual(strs, ["2", "4", "6"]);',
        },
        {
          description: "Functions can be typed parameters. applyTwice runs fn on its own output.",
          template:
            "function applyTwice(fn: (n: number) => number, x: number): number {\n  return fn(fn(x));\n}\nassert.equal(applyTwice(n => n + 3, __), 7);",
        },
        {
          description: "A predicate is a function returning boolean. Keep the positives.",
          template:
            "const isPositive = (n: number): boolean => n > __;\nassert.equal([-1, 2, 3].filter(isPositive).length, 2);",
        },
      ],
    },
    {
      name: "Recursion",
      quote: "A type may refer to itself, as a thought reflects upon a thought.",
      exercises: [
        {
          description: "A typed recursive function returns the factorial. What is factorial(5)?",
          template:
            "function factorial(n: number): number {\n  return n <= 1 ? 1 : n * factorial(n - 1);\n}\nassert.equal(factorial(5), __);",
        },
        {
          description: "Recursion can sum a list by peeling off the head.",
          template:
            "function sumList(xs: number[]): number {\n  return xs.length === 0 ? 0 : xs[0] + sumList(xs.slice(1));\n}\nassert.equal(sumList([1, 2, 3, 4]), __);",
        },
      ],
    },
    {
      name: "Strings",
      quote: "Even the string is typed; nothing escapes structure.",
      exercises: [
        {
          description: "String concatenation produces a string. Complete the result.",
          template: 'const message: string = "Type" + "Script";\nassert.equal(message, __);',
        },
        {
          description: "Strings have a typed .length. How many characters?",
          template: 'const lang: string = "TypeScript";\nassert.equal(lang.length, __);',
        },
        {
          description: "Use .repeat() to repeat a string a number of times.",
          template: 'const echo: string = "ah".repeat(__);\nassert.equal(echo, "ahah");',
        },
      ],
    },
  ],
};
