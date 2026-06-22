import type { LanguagePath } from "./types.ts";

export const coffeescript: LanguagePath = {
  name: "CoffeeScript",
  theme: "coffee-theme",
  categories: [
    {
      name: "Syntactic Sweetness",
      quote: "Simplicity is the ultimate sophistication.",
      exercises: [
        {
          description: "CoffeeScript has variable declarations and implicit returns. Assign true.",
          template: "truth = __\nassert.equal(truth, true)",
        },
        {
          description: "In CoffeeScript, 'is' compiles to ===, and 'isnt' compiles to !==.",
          template: "isEqual = (5 is __)\nassert.equal(isEqual, true)",
        },
        {
          description: "If-statements can be written as single-line expressions.",
          template: 'x = 10\ny = if x > 5 then __ else 0\nassert.equal(y, "large")',
        },
      ],
    },
    {
      name: "Functions & Arrow Syntax",
      quote: "Elegant verbs make concise sentences.",
      exercises: [
        {
          description: "Functions are declared using arguments -> body. Return value is implicit.",
          template: "square = (x) -> x * x\nassert.equal(square(4), __)",
        },
        {
          description: "CoffeeScript supports default argument values.",
          template: 'greet = (name = "Guest") -> "Hi " + name\nassert.equal(greet(__), "Hi Zen")',
        },
        {
          description: "Double quotes support string interpolation using #{variable}.",
          template: 'level = 9\nmsg = "Level #{level + __}"\nassert.equal(msg, "Level 10")',
        },
      ],
    },
    {
      name: "Arrays & Ranges",
      quote: "From small numbers, great counts arise.",
      exercises: [
        {
          description: "Ranges create arrays from a start to an end value inclusive, like [1..5].",
          template: "numbers = [1..__]\nassert.deepEqual(numbers, [1, 2, 3, 4])",
        },
        {
          description:
            "List comprehensions provide an elegant syntax for loops. Complete the result.",
          template: "doubles = (n * 2 for n in [1, 2, 3])\nassert.deepEqual(doubles, [2, __, 6])",
        },
        {
          description: "Check if an element exists in an array using the 'in' operator.",
          template:
            "fruits = ['apple', 'banana', 'orange']\nhasBanana = 'banana' in __\nassert.equal(hasBanana, true)",
        },
      ],
    },
    {
      name: "Higher-Order Functions",
      quote: "Pass the verb, and the sentence writes itself.",
      exercises: [
        {
          description: "filter takes a function and keeps the matching elements.",
          template:
            "nums = [1, 2, 3, 4]\nevens = nums.filter (n) -> n % 2 is __\nassert.deepEqual(evens, [2, 4])",
        },
        {
          description: "reduce folds an array into one value.",
          template: "total = [1, 2, 3, 4].reduce ((a, b) -> a + b), 0\nassert.equal(total, __)",
        },
        {
          description: "Functions are values you can pass around.",
          template: "apply = (fn, x) -> fn(x)\nassert.equal(apply(((n) -> n * 3), __), 15)",
        },
      ],
    },
    {
      name: "Recursion",
      quote: "Down the spiral, each step calls the next.",
      exercises: [
        {
          description: "A function may call itself. Find the factorial of 4.",
          template:
            "factorial = (n) -> if n <= 1 then 1 else n * factorial(n - 1)\nassert.equal(factorial(4), __)",
        },
        {
          description: "The base case ends the recursion. What input sums to 15?",
          template:
            "sumTo = (n) -> if n is 0 then 0 else n + sumTo(n - 1)\nassert.equal(sumTo(__), 15)",
        },
      ],
    },
    {
      name: "Strings",
      quote: "Letters strung together carry the weight of meaning.",
      exercises: [
        {
          description: "Strings have a .length property. How long is this word?",
          template: 'word = "coffee"\nassert.equal(word.length, __)',
        },
        {
          description: "Interpolation injects values into double-quoted strings.",
          template: 'name = "Zen"\nmsg = "Hi #{name}"\nassert.equal(msg, __)',
        },
        {
          description: "Use .includes() to test for a substring.",
          template: 'phrase = "morning brew"\nassert.equal(phrase.includes(__), true)',
        },
      ],
    },
  ],
};
