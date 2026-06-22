import type { LanguagePath } from "./types.ts";

export const civet: LanguagePath = {
  name: "Civet",
  theme: "civet-theme",
  categories: [
    {
      name: "Less Typing",
      quote: "Say more with fewer keystrokes.",
      exercises: [
        {
          description: "Civet declares constants with := and no keyword. Bind truth to true.",
          template: "truth := __\nassert.equal(truth, true)",
        },
        {
          description: "The 'is' operator compiles to strict equality (===). Make this true.",
          template: "result := 2 is __\nassert.equal(result, true)",
        },
        {
          description: "Bindings infer their type. What value, when doubled, equals 10?",
          template: "count := __\nassert.equal(count * 2, 10)",
        },
      ],
    },
    {
      name: "Arrows & Implicit Return",
      quote: "The last expression flows out on its own.",
      exercises: [
        {
          description: "Arrow functions return their last expression implicitly.",
          template: "square := (x) => x * x\nassert.equal(square(4), __)",
        },
        {
          description: "Strings concatenate with +. What argument yields 'Hi Zen'?",
          template: 'greet := (name) => "Hi " + name\nassert.equal(greet(__), "Hi Zen")',
        },
        {
          description: "The pipe operator |> feeds a value into a function.",
          template: "double := (x) => x * 2\nresult := 5 |> double\nassert.equal(result, __)",
        },
      ],
    },
    {
      name: "Pipelines & Data",
      quote: "Data flows left to right, one step at a time.",
      exercises: [
        {
          description: "Pipes chain: 5 flows through inc then double. What comes out?",
          template:
            "inc := (x) => x + 1\ndouble := (x) => x * 2\nresult := 5 |> inc |> double\nassert.equal(result, __)",
        },
        {
          description: "Array methods work as in JS. What multiplier doubles each element?",
          template:
            "nums := [1, 2, 3]\ndoubled := nums.map((n) => n * __)\nassert.deepEqual(doubled, [2, 4, 6])",
        },
        {
          description: "Spread expands an array into a new one. Add the missing element.",
          template:
            "nums := [1, 2, 3]\nmore := [...nums, __]\nassert.deepEqual(more, [1, 2, 3, 4])",
        },
      ],
    },
    {
      name: "Higher-Order Functions",
      quote: "Functions handed to functions: brevity meets power.",
      exercises: [
        {
          description: "filter keeps the elements matching the predicate.",
          template:
            "nums := [1, 2, 3, 4]\nevens := nums.filter (n) => n % 2 is __\nassert.deepEqual(evens, [2, 4])",
        },
        {
          description: "reduce folds an array into a single value.",
          template: "total := [1, 2, 3, 4].reduce((a, b) => a + b, 0)\nassert.equal(total, __)",
        },
        {
          description: "Functions are values you can pass as arguments.",
          template: "apply := (fn, x) => fn(x)\nassert.equal(apply((n) => n * 3, __), 15)",
        },
      ],
    },
    {
      name: "Recursion",
      quote: "Call yourself, and the answer unfolds.",
      exercises: [
        {
          description: "A function may call itself. Find the factorial of 4.",
          template:
            "factorial := (n) => n <= 1 ? 1 : n * factorial(n - 1)\nassert.equal(factorial(4), __)",
        },
        {
          description: "The base case ends the recursion. What input sums to 15?",
          template: "sumTo := (n) => n is 0 ? 0 : n + sumTo(n - 1)\nassert.equal(sumTo(__), 15)",
        },
      ],
    },
    {
      name: "Strings",
      quote: "Short words, deep silence between them.",
      exercises: [
        {
          description: "Strings have a .length property. How long is this word?",
          template: 'word := "civet"\nassert.equal(word.length, __)',
        },
        {
          description: "Concatenate two strings with +.",
          template: 'greeting := "Hi " + "Zen"\nassert.equal(greeting, __)',
        },
        {
          description: "Use .includes() to test for a substring.",
          template: 'phrase := "quiet mind"\nassert.equal(phrase.includes(__), true)',
        },
      ],
    },
  ],
};
