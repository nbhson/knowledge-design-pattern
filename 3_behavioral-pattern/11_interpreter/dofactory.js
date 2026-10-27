// Interpreter Pattern — ES5 + Object Literal Map
// DSL máy tính 4 phép tính: parse chuỗi → đánh giá bằng hàm đệ quy.
// Ưu điểm: ngắn gọn, idiomatic JS; phù hợp ngữ pháp đơn giản.

const operators = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => {
    if (b === 0) throw new Error("Chia cho 0!");
    return a / b;
  },
};

// Interpreter: duyệt token bằng đệ quy (precedence: + - thấp hơn * /)
function interpret(tokens) {
  let pos = 0;

  function parseExpression() {
    let left = parseTerm();
    while (pos < tokens.length && (tokens[pos] === "+" || tokens[pos] === "-")) {
      const op = tokens[pos++];
      const right = parseTerm();
      left = operators[op](left, right);
    }
    return left;
  }

  function parseTerm() {
    let left = parseNumber();
    while (pos < tokens.length && (tokens[pos] === "*" || tokens[pos] === "/")) {
      const op = tokens[pos++];
      const right = parseNumber();
      left = operators[op](left, right);
    }
    return left;
  }

  function parseNumber() {
    const value = Number(tokens[pos++]);
    if (Number.isNaN(value)) throw new Error("Token không hợp lệ: " + tokens[pos - 1]);
    return value;
  }

  return parseExpression();
}

// Tokenizer: tách chuỗi thành mảng token (số và toán tử)
function tokenize(input) {
  return input.match(/\d+\.?\d*|[+\-*/()]/g) || [];
}

console.log("--- ES5 Interpreter: Máy tính 4 phép tính ---");
const expressions = ["2 + 3 * 4", "10 - 6 / 2", "7 + 3 + 1"];
expressions.forEach((expr) => {
  const tokens = tokenize(expr);
  console.log(`${expr} = ${interpret(tokens)}`);
});
