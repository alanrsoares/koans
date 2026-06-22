export interface Exercise {
  description: string;
  template: string;
}

export interface Category {
  name: string;
  quote: string;
  exercises: Exercise[];
}

export interface LanguagePath {
  name: string;
  theme: string;
  categories: Category[];
}

export type KoanData = Record<string, LanguagePath>;

export const KOANS: KoanData = {
  javascript: {
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
            description:
              "Loose equality (==) coerces types, which can lead to surprising behavior.",
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
    ],
  },
  typescript: {
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
    ],
  },
  clojurescript: {
    name: "ClojureScript",
    theme: "cljs-theme",
    categories: [
      {
        name: "Introduction to Lisp",
        quote: "Lisp is not a language, it's a building material.",
        exercises: [
          {
            description:
              "In ClojureScript, equality is checked using (= ...). Fill in the blank to make this true.",
            template: "(= __ true)",
          },
          {
            description:
              "Evaluate basic arithmetic. Parentheses represent function calls: (operator arg1 arg2).",
            template: "(= __ (+ 10 5))",
          },
          {
            description:
              "Inequality is represented by (not= ...). Ensure these values are unequal.",
            template: "(not= __ 9)",
          },
          {
            description:
              "The Lisp syntax uses prefix notation. Try combining subtraction and addition.",
            template: "(= (- 10 3) (+ 4 __))",
          },
        ],
      },
      {
        name: "Vectors & Lists",
        quote: "Order and sequence hold the world in balance.",
        exercises: [
          {
            description:
              "Vectors are indexable collections written with square brackets. Access the first item.",
            template: "(= __ (first [10 20 30]))",
          },
          {
            description:
              "Access an item by index using (nth vector index). What is index 1 of this vector?",
            template: "(= __ (nth [5 15 25] 1))",
          },
          {
            description: "The count function returns the number of elements in a collection.",
            template: '(= __ (count ["a" "b" "c" "d"]))',
          },
          {
            description:
              "(conj vector value) appends a value to a vector. Complete the target vector.",
            template: "(= [1 2 3] (conj [1 2] __))",
          },
        ],
      },
      {
        name: "Functions",
        quote: "To do is to be, to be is to do.",
        exercises: [
          {
            description: "Create anonymous functions using (fn [args] body). What input yields 10?",
            template: "(= 10 ((fn [x] (* x 2)) __))",
          },
          {
            description:
              "ClojureScript has a shorthand for anonymous functions: #(body). Here, % represents the argument.",
            template: "(= 9 (#(* % %) __))",
          },
          {
            description:
              "Define named functions using (defn name [args] body). What is (double 8)?",
            template: "(defn double [n] (* n 2))\n(= __ (double 8))",
          },
        ],
      },
      {
        name: "Maps",
        quote: "Mappings connect expectations with reality.",
        exercises: [
          {
            description:
              "Maps store key-value pairs with curly braces. Look up :name from the map.",
            template: '(= __ (:name {:name "ClojureScript" :syntax "Lisp"}))',
          },
          {
            description: "You can also use (get map key) to extract values.",
            template: "(= __ (get {:a 100 :b 200} :b))",
          },
          {
            description:
              "assoc returns a new map with a key-value added or updated. Update :score.",
            template: '(= {:player "Zen" :score 100} (assoc {:player "Zen"} :score __))',
          },
          {
            description: "dissoc removes keys from a map. Remove the :b key.",
            template: "(= {:a 1} (dissoc {:a 1 :b 2} __))",
          },
        ],
      },
    ],
  },
  coffeescript: {
    name: "CoffeeScript",
    theme: "coffee-theme",
    categories: [
      {
        name: "Syntactic Sweetness",
        quote: "Simplicity is the ultimate sophistication.",
        exercises: [
          {
            description:
              "CoffeeScript has variable declarations and implicit returns. Assign true.",
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
            description:
              "Functions are declared using arguments -> body. Return value is implicit.",
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
            description:
              "Ranges create arrays from a start to an end value inclusive, like [1..5].",
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
    ],
  },
  gleam: {
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
            description:
              "Custom types can hold data payload. Extract the value from the container.",
            template:
              "pub type Container {\n  Hold(Int)\n}\npub fn exercise() {\n  let box = Hold(42)\n  let Hold(value) = box\n  value == __\n}",
          },
        ],
      },
    ],
  },
  civet: {
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
    ],
  },
};
