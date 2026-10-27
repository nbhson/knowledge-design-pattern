// Interpreter Pattern — chuẩn GoF với ES6 Class
// Mỗi quy tắc ngữ pháp = 1 class; biểu thức = cây; interpret() duyệt cây.

// ===== Abstract Expression =====
class Expression {
  interpret(_context) {
    throw new Error("Phải implement interpret()");
  }
}

// ===== Terminal Expressions =====
class NumberExpression extends Expression {
  constructor(value) {
    super();
    this.value = value;
  }
  interpret() {
    return this.value;
  }
}

class VariableExpression extends Expression {
  constructor(name) {
    super();
    this.name = name;
  }
  interpret(context) {
    if (!(this.name in context)) {
      throw new Error(`Biến '${this.name}' chưa được định nghĩa trong context`);
    }
    return context[this.name];
  }
}

// ===== Nonterminal Expressions =====
class AddExpression extends Expression {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }
  interpret(context) {
    return this.left.interpret(context) + this.right.interpret(context);
  }
}

class SubtractExpression extends Expression {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }
  interpret(context) {
    return this.left.interpret(context) - this.right.interpret(context);
  }
}

class MultiplyExpression extends Expression {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }
  interpret(context) {
    return this.left.interpret(context) * this.right.interpret(context);
  }
}

// ===== Client: dựng cây cú pháp rồi đánh giá =====
console.log("--- ES6 Interpreter: Cây expression cho công thức tính tiền ---");

// Công thức: (lươngCơBản + thưỏng) * hệSố — diễn đạt như một ngôn ngữ nhỏ
const context = { luongCoBan: 20_000_000, thuong: 5_000_000, heSo: 1.2 };

const salary = new MultiplyExpression(
  new AddExpression(
    new VariableExpression("luongCoBan"),
    new VariableExpression("thuong"),
  ),
  new VariableExpression("heSo"),
);

console.log(`Thực nhận = (20.000.000 + 5.000.000) * 1.2 = ${salary.interpret(context).toLocaleString("vi-VN")}đ`);

// Thêm quy tắc mới = thêm class mới, không sửa class cũ (Open/Closed)
class BonusThresholdExpression extends Expression {
  constructor(inner, threshold) {
    super();
    this.inner = inner;
    this.threshold = threshold;
  }
  interpret(context) {
    const value = this.inner.interpret(context);
    return value > this.threshold ? value + 1_000_000 : value;
  }
}

const withBonus = new BonusThresholdExpression(salary, 25_000_000);
console.log(`Có thưởng vượt ngưỡng (>30.000.000): ${withBonus.interpret(context).toLocaleString("vi-VN")}đ`);
console.log("→ Cùng một cây, đánh giá lại không cần parse lại input.");
