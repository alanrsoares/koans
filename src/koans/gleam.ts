import type { LanguagePath } from "./types.ts";

export const gleam: LanguagePath = {
  name: "Gleam",
  theme: "gleam-theme",
  categories: [
    {
      name: "Equality & Truth",
      quote: "The truth has no sides, only paths that converge.",
      exercises: [
        {
          description: "Gleam has True and False booleans. Bind the truth variable to True.",
          template: "pub fn exercise() {\n  let truth = __\n  truth == True\n}",
        },
        {
          description: "Equality is checked with ==. Find the sum.",
          template: "pub fn exercise() {\n  let result = 1 + 1 == __\n  result == True\n}",
        },
        {
          description: "Inequality is checked using != operator. Make this true.",
          template: "pub fn exercise() {\n  let result = 42 != __\n  result == True\n}",
        },
      ],
    },
    {
      name: "Functions & Pipelines",
      quote: "Input flows through functions like water through bamboo pipes.",
      exercises: [
        {
          description: "Functions are declared with fn. Call add_one with a number to get 6.",
          template: "fn add_one(x) { x + 1 }\npub fn exercise() {\n  add_one(__) == 6\n}",
        },
        {
          description: "Anonymous functions use fn(args) { body }. What multiplier yields 20?",
          template: "pub fn exercise() {\n  let double = fn(x) { x * __ }\n  double(10) == 20\n}",
        },
        {
          description: "Gleam has a pipe operator |> which chains function calls.",
          template:
            "fn add_one(x) { x + 1 }\nfn double(x) { x * 2 }\npub fn exercise() {\n  let result = 5 |> add_one |> double |> __\n  result == 13\n}",
        },
      ],
    },
    {
      name: "Custom Types",
      quote: "Design the world with types that describe the reality.",
      exercises: [
        {
          description: "Custom types declare custom constructors. Complete the match branch.",
          template:
            "pub type Answer {\n  Yes\n  No\n}\npub fn exercise() {\n  let val = __\n  case val {\n    Yes -> True\n    No -> False\n  }\n}",
        },
        {
          description: "Custom types can hold data payload. Extract the value from the container.",
          template:
            "pub type Container {\n  Hold(Int)\n}\npub fn exercise() {\n  let box = Hold(42)\n  let Hold(value) = box\n  value == __\n}",
        },
      ],
    },
    {
      name: "Higher-Order Functions",
      quote: "Pass the verb, and the sentence writes itself.",
      exercises: [
        {
          description: "Functions are values. apply runs f on its argument.",
          template:
            "fn apply(f, x) { f(x) }\npub fn exercise() {\n  apply(fn(n) { n * 3 }, __) == 15\n}",
        },
        {
          description: "A function can return another function that captures a value.",
          template:
            "fn adder(n) { fn(x) { x + n } }\npub fn exercise() {\n  let add5 = adder(5)\n  add5(__) == 12\n}",
        },
        {
          description: "twice applies a function to its own result.",
          template:
            "fn twice(f, x) { f(f(x)) }\npub fn exercise() {\n  twice(fn(n) { n + 3 }, __) == 7\n}",
        },
      ],
    },
    {
      name: "Recursion",
      quote: "Down the spiral, each step calls the next.",
      exercises: [
        {
          description: "A function calls itself, branching on a case. What is fact(4)?",
          template:
            "fn fact(n) {\n  case n {\n    0 -> 1\n    _ -> n * fact(n - 1)\n  }\n}\npub fn exercise() {\n  fact(4) == __\n}",
        },
        {
          description: "The base case ends the recursion. What input sums to 15?",
          template:
            "fn sum_to(n) {\n  case n {\n    0 -> 0\n    _ -> n + sum_to(n - 1)\n  }\n}\npub fn exercise() {\n  sum_to(__) == 15\n}",
        },
      ],
    },
    {
      name: "Strings",
      quote: "Letters joined by intent become speech.",
      exercises: [
        {
          description: "Gleam concatenates strings with the <> operator.",
          template:
            'pub fn exercise() {\n  let message = "Type" <> __\n  message == "TypeScript"\n}',
        },
        {
          description: "Build a greeting by joining two strings.",
          template:
            'pub fn exercise() {\n  let greeting = "Hello " <> "Master"\n  greeting == __\n}',
        },
        {
          description: "Complete the left side so the joined string matches.",
          template: 'pub fn exercise() {\n  __ <> " mind" == "quiet mind"\n}',
        },
      ],
    },
  ],
};
