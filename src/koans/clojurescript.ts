import type { LanguagePath } from "./types.ts";

export const clojurescript: LanguagePath = {
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
          description: "Inequality is represented by (not= ...). Ensure these values are unequal.",
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
          description: "Define named functions using (defn name [args] body). What is (double 8)?",
          template: "(defn double [n] (* n 2))\n(= __ (double 8))",
        },
      ],
    },
    {
      name: "Maps",
      quote: "Mappings connect expectations with reality.",
      exercises: [
        {
          description: "Maps store key-value pairs with curly braces. Look up :name from the map.",
          template: '(= __ (:name {:name "ClojureScript" :syntax "Lisp"}))',
        },
        {
          description: "You can also use (get map key) to extract values.",
          template: "(= __ (get {:a 100 :b 200} :b))",
        },
        {
          description: "assoc returns a new map with a key-value added or updated. Update :score.",
          template: '(= {:player "Zen" :score 100} (assoc {:player "Zen"} :score __))',
        },
        {
          description: "dissoc removes keys from a map. Remove the :b key.",
          template: "(= {:a 1} (dissoc {:a 1 :b 2} __))",
        },
      ],
    },
    {
      name: "Higher-Order Functions",
      quote: "Functions passed to functions weave the fabric of logic.",
      exercises: [
        {
          description: "map applies a function to every element of a collection.",
          template: "(= [2 4 6] (vec (map #(* % 2) [1 2 __])))",
        },
        {
          description: "filter keeps only elements for which the predicate is true.",
          template: "(= [2 4] (vec (filter even? [1 2 3 __])))",
        },
        {
          description: "reduce folds a collection into a single value.",
          template: "(= __ (reduce + [1 2 3 4]))",
        },
        {
          description: "apply spreads a sequence as the arguments to a function.",
          template: "(= 10 (apply + [1 2 3 __]))",
        },
      ],
    },
    {
      name: "Recursion",
      quote: "The function calls itself, and so the journey deepens.",
      exercises: [
        {
          description: "A recursive defn computes factorial. What is (fact 4)?",
          template: "(defn fact [n]\n  (if (<= n 1) 1 (* n (fact (dec n)))))\n(= __ (fact 4))",
        },
        {
          description: "The base case stops the recursion. What input sums to 15?",
          template:
            "(defn sum-to [n]\n  (if (= n 0) 0 (+ n (sum-to (dec n)))))\n(= 15 (sum-to __))",
        },
        {
          description: "Recursion can build a sequence. Complete the countdown.",
          template:
            "(defn countdown [n]\n  (if (= n 0) [] (cons n (countdown (dec n)))))\n(= [3 2 1] (vec (countdown __)))",
        },
      ],
    },
    {
      name: "Strings",
      quote: "Speech is the bridge; characters are its planks.",
      exercises: [
        {
          description: "str concatenates values into a single string.",
          template: '(= "ClojureScript" (str "Clojure" __))',
        },
        {
          description: "count returns the number of characters in a string.",
          template: '(= __ (count "zen"))',
        },
        {
          description: "JavaScript methods are reachable via interop. Shout the string.",
          template: '(= "ZEN" (.toUpperCase __))',
        },
        {
          description: "Use interop .includes to test for a substring.",
          template: '(= true (.includes "namaste" __))',
        },
      ],
    },
  ],
};
