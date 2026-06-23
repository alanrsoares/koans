export interface Token {
  type: string;
  value: string;
}

interface TokenRule {
  type: string;
  regex: RegExp;
}

export function tokenize(code: string, lang: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  const isLisp = lang === "clojurescript";
  const isGleam = lang === "gleam";
  const rules: TokenRule[] = [];

  if (isLisp) {
    rules.push(
      { type: "comment", regex: /^;;.*/ },
      { type: "string", regex: /^"[^"\\]*(\\.[^"\\]*)*"/ },
      { type: "blank", regex: /^__/ },
      { type: "keyword", regex: /^(defn|fn|def|let|ns|if|when|cond|case|nil|true|false)\b/ },
      {
        type: "builtin",
        regex: /^(assert|conj|first|last|nth|rest|empty\?|count|get|assoc|dissoc|keys|vals)\b/,
      },
      { type: "number", regex: /^-?\d+(\.\d+)?/ },
      { type: "symbol", regex: /^:[a-zA-Z0-9_\-/?!*]+/ }, // Keyword symbols like :a
      { type: "text", regex: /^[a-zA-Z0-9_\-/?!*]+/ },
      { type: "punctuation", regex: /^[()[\]{}\s+,]/ }
    );
  } else if (isGleam) {
    rules.push(
      { type: "comment", regex: /^\/\/.*/ },
      { type: "string", regex: /^"[^"\\]*(\\.[^"\\]*)*"/ },
      { type: "blank", regex: /^__/ },
      {
        type: "keyword",
        regex:
          /^(pub|fn|let|use|import|type|case|try|panic|todo|const|opaque|assert|as|True|False|Nil)\b/,
      },
      { type: "number", regex: /^\b\d+(\.\d+)?\b/ },
      { type: "text", regex: /^[a-z_][a-zA-Z0-9_]*|^[A-Z][a-zA-Z0-9_]*/ },
      { type: "punctuation", regex: /^[()[\]{}\s+,.;:*=\-/%&|!?<>@\n]/ }
    );
  } else {
    // JS / TS / CoffeeScript
    rules.push(
      { type: "comment", regex: lang === "coffeescript" ? /^#.*/ : /^\/\/.*|^\/\*[\s\S]*?\*\// },
      { type: "string", regex: /^"[^"\\]*(\\.[^"\\]*)*"|^'[^'\\]*(\\.[^'\\]*)*'|^`[\s\S]*?`/ },
      { type: "blank", regex: /^__/ },
      {
        type: "keyword",
        regex:
          /^(const|let|var|function|return|class|extends|new|if|else|for|while|do|switch|case|break|continue|import|export|from|as|default|true|false|null|undefined|async|await|type|interface|any|number|string|boolean|void|enum)\b/,
      },
      { type: "builtin", regex: /^assert\b/ },
      { type: "number", regex: /^\b\d+(\.\d+)?\b/ },
      { type: "text", regex: /^[a-zA-Z_$][a-zA-Z0-9_$]*/ },
      { type: "punctuation", regex: /^[()[\]{}\s+,.;:*=\-/%&|!?<>@\n]/ }
    );
  }

  while (index < code.length) {
    const remaining = code.slice(index);
    let matched = false;

    for (const rule of rules) {
      const match = remaining.match(rule.regex);
      if (match && match.index === 0) {
        const value = match[0];
        tokens.push({ type: rule.type, value });
        index += value.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push({ type: "other", value: code[index] ?? "" });
      index++;
    }
  }

  return tokens;
}
