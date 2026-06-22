import type { LanguagePath } from "./types.ts";

export const javascript: LanguagePath = {
  name: "JavaScript",
  theme: "js-theme",
  categories: [
    {
      name: "Equality & Truth",
      quote: "The first step toward truth is to question everything you believe.",
      exercises: [
        {
          description: "Boolean values represent truth or falsehood. What is the value of true?",
          template: "const truth = __;\nassert.equal(truth, true);",
        },
        {
          description: "Equality can be checked using the strict equality operator (===).",
          template: "const result = (1 + 1 === __);\nassert.equal(result, true);",
        },
        {
          description: "Loose equality (==) coerces types, which can lead to surprising behavior.",
          template: "const result = (42 == __);\nassert.equal(result, true);",
        },
        {
          description: "Strict equality (===) does NOT coerce types.",
          template: 'const result = ("42" === __);\nassert.equal(result, false);',
        },
        {
          description:
            "The logical NOT (!) operator returns the opposite boolean value. What is the negation of a falsy value?",
          template: "const value = !__;\nassert.equal(value, true);",
        },
      ],
    },
    {
      name: "Arrays",
      quote: "A path is made by walking on it.",
      exercises: [
        {
          description: "Arrays are ordered lists of values. How do we get the size of an array?",
          template: "const arr = [10, 20, 30];\nassert.equal(arr.length, __);",
        },
        {
          description: "Array elements are zero-indexed. Access the second element.",
          template: "const arr = [10, 20, 30];\nassert.equal(arr[__], 20);",
        },
        {
          description: "You can append elements to the end of an array using .push().",
          template: "const arr = [1, 2];\narr.push(__);\nassert.deepEqual(arr, [1, 2, 3]);",
        },
        {
          description: "The .pop() method removes and returns the last element of an array.",
          template:
            "const arr = [10, 20, 30];\nconst popped = arr.pop();\nassert.equal(popped, __);",
        },
        {
          description: "Use .map() to transform each element in an array.",
          template:
            "const arr = [1, 2, 3];\nconst doubled = arr.map(x => x * __);\nassert.deepEqual(doubled, [2, 4, 6]);",
        },
      ],
    },
    {
      name: "Functions & Scope",
      quote: "Flow with whatever may happen, and let your mind be free.",
      exercises: [
        {
          description: "Functions return values. What does this arrow function return?",
          template: "const add = (a, b) => a + b;\nassert.equal(add(3, 5), __);",
        },
        {
          description:
            "A closure is a function that remembers its outer variables. What is the final count?",
          template:
            "const makeCounter = () => {\n  let count = 0;\n  return () => ++count;\n};\nconst counter = makeCounter();\ncounter();\nassert.equal(counter(), __);",
        },
        {
          description: "JavaScript supports default parameters if arguments are omitted.",
          template:
            'const greet = (name = __) => "Hello " + name;\nassert.equal(greet(), "Hello Guest");',
        },
        {
          description:
            "Rest parameters (...) allow a function to accept an indefinite number of arguments as an array.",
          template:
            "const sumAll = (...numbers) => numbers.reduce((sum, n) => sum + n, 0);\nassert.equal(sumAll(1, 2, 3, __), 10);",
        },
      ],
    },
    {
      name: "Objects & Destructuring",
      quote: "Form is emptiness, emptiness is form.",
      exercises: [
        {
          description: "Objects store key-value pairs. Access the 'name' property of the object.",
          template:
            'const coder = { name: "Zen Master", level: 99 };\nassert.equal(coder.__, "Zen Master");',
        },
        {
          description: "Destructuring extracts values from objects into variables easily.",
          template:
            "const coordinates = { x: 10, y: 20 };\nconst { x, __ } = coordinates;\nassert.equal(y, 20);",
        },
        {
          description: "Object properties can be mutated.",
          template:
            "const player = { score: 10 };\nplayer.score = __;\nassert.equal(player.score, 50);",
        },
        {
          description: "Object.keys() returns an array of an object's property names.",
          template:
            'const obj = { a: 1, b: 2, c: 3 };\nconst keys = Object.keys(obj);\nassert.deepEqual(keys, [__, "b", "c"]);',
        },
      ],
    },
    {
      name: "Higher-Order Functions",
      quote: "To master others is strength; to master functions is enlightenment.",
      exercises: [
        {
          description: "Use .filter() to keep only the elements that satisfy a predicate.",
          template:
            "const nums = [1, 2, 3, 4];\nconst evens = nums.filter(n => n % __ === 0);\nassert.deepEqual(evens, [2, 4]);",
        },
        {
          description: "Use .reduce() to fold an array into a single value.",
          template:
            "const nums = [1, 2, 3, 4];\nconst total = nums.reduce((sum, n) => sum + n, 0);\nassert.equal(total, __);",
        },
        {
          description: "Use .find() to return the first element matching a condition.",
          template:
            "const nums = [5, 12, 8, 130];\nconst found = nums.find(n => n > __);\nassert.equal(found, 12);",
        },
        {
          description: "Functions can be passed as arguments to other functions.",
          template:
            "const apply = (fn, x) => fn(x);\nconst result = apply(n => n * 3, __);\nassert.equal(result, 15);",
        },
      ],
    },
    {
      name: "Recursion",
      quote: "To understand recursion, one must first understand recursion.",
      exercises: [
        {
          description: "A recursive function calls itself. Find the factorial of 4.",
          template:
            "const factorial = n => (n <= 1 ? 1 : n * factorial(n - 1));\nassert.equal(factorial(4), __);",
        },
        {
          description: "Every recursion needs a base case. What input sums to 15?",
          template:
            "const sumTo = n => (n === 0 ? 0 : n + sumTo(n - 1));\nassert.equal(sumTo(__), 15);",
        },
        {
          description: "Recursion can build collections. Complete the countdown.",
          template:
            "const countdown = n => (n < 0 ? [] : [n, ...countdown(n - 1)]);\nassert.deepEqual(countdown(2), [2, 1, __]);",
        },
        {
          description: "The Fibonacci sequence is defined recursively. What is fib(7)?",
          template:
            "const fib = n => (n < 2 ? n : fib(n - 1) + fib(n - 2));\nassert.equal(fib(7), __);",
        },
      ],
    },
    {
      name: "Strings",
      quote: "Words are but vessels; meaning flows between them.",
      exercises: [
        {
          description: "Strings have a .length property. How long is this word?",
          template: 'const word = "enlightenment";\nassert.equal(word.length, __);',
        },
        {
          description: "Use .toUpperCase() to shout a string.",
          template: 'const shout = "zen".toUpperCase();\nassert.equal(shout, __);',
        },
        {
          description: "Use .split() to break a string into an array of parts.",
          template:
            'const csv = "a,b,c";\nconst parts = csv.split(__);\nassert.deepEqual(parts, ["a", "b", "c"]);',
        },
        {
          description: "Use .includes() to test whether a substring is present.",
          template: 'const phrase = "the empty cup";\nassert.equal(phrase.includes(__), true);',
        },
      ],
    },
  ],
};
