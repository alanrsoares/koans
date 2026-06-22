// Reference answers for every koan, used only by the test harness (not shipped
// in the app UI). Shape mirrors KOANS: solutions[langKey][categoryName] is an
// array of answer-arrays, one per exercise in declaration order. Each inner
// array holds one string per `__` blank, in order.
//
// Keep in lockstep with ./index.ts — the harness asserts every koan has a
// matching solution, so a new koan without an entry here fails the suite.
export type Solutions = Record<string, Record<string, string[][]>>;

export const SOLUTIONS: Solutions = {
  javascript: {
    "Equality & Truth": [["true"], ["2"], ["42"], ["42"], ["false"]],
    Arrays: [["3"], ["1"], ["3"], ["30"], ["2"]],
    "Functions & Scope": [["8"], ["2"], ['"Guest"'], ["4"]],
    "Objects & Destructuring": [["name"], ["y"], ["50"], ['"a"']],
    "Higher-Order Functions": [["2"], ["10"], ["10"], ["5"]],
    Recursion: [["24"], ["5"], ["0"], ["13"]],
    Strings: [["13"], ['"ZEN"'], ['","'], ['"cup"']],
  },
  typescript: {
    "Type Annotations": [["42"], ['"TypeScript"'], ["true"]],
    "Interfaces & Objects": [["10"], ["undefined"], ['"safe-key"']],
    "Unions & Intersection": [['"zen"'], ['"up"'], ["42"]],
    Generics: [['"enlightened"'], ["90"]],
    "Higher-Order Functions": [["2"], ["1"], ["0"]],
    Recursion: [["120"], ["10"]],
    Strings: [['"TypeScript"'], ["10"], ["2"]],
  },
  clojurescript: {
    "Introduction to Lisp": [["true"], ["15"], ["8"], ["3"]],
    "Vectors & Lists": [["10"], ["15"], ["4"], ["3"]],
    Functions: [["5"], ["3"], ["16"]],
    Maps: [['"ClojureScript"'], ["200"], ["100"], [":b"]],
    "Higher-Order Functions": [["3"], ["4"], ["10"], ["4"]],
    Recursion: [["24"], ["5"], ["3"]],
    Strings: [['"Script"'], ["3"], ['"zen"'], ['"nama"']],
  },
  coffeescript: {
    "Syntactic Sweetness": [["true"], ["5"], ['"large"']],
    "Functions & Arrow Syntax": [["16"], ['"Zen"'], ["1"]],
    "Arrays & Ranges": [["4"], ["4"], ["fruits"]],
    "Higher-Order Functions": [["0"], ["10"], ["5"]],
    Recursion: [["24"], ["5"]],
    Strings: [["6"], ['"Hi Zen"'], ['"brew"']],
  },
  gleam: {
    "Equality & Truth": [["True"], ["2"], ["0"]],
    "Functions & Pipelines": [["5"], ["2"], ["add_one"]],
    "Custom Types": [["Yes"], ["42"]],
    "Higher-Order Functions": [["5"], ["7"], ["1"]],
    Recursion: [["24"], ["5"]],
    Strings: [['"Script"'], ['"Hello Master"'], ['"quiet"']],
  },
  civet: {
    "Less Typing": [["true"], ["2"], ["5"]],
    "Arrows & Implicit Return": [["16"], ['"Zen"'], ["10"]],
    "Pipelines & Data": [["12"], ["2"], ["4"]],
    "Higher-Order Functions": [["0"], ["10"], ["5"]],
    Recursion: [["24"], ["5"]],
    Strings: [["5"], ['"Hi Zen"'], ['"mind"']],
  },
};
