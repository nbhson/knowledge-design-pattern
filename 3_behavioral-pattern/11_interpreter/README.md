# JavaScript Interpreter Pattern

> **Interpreter Pattern** (Mẫu thông dịch) định nghĩa một **ngôn ngữ nhỏ (mini-DSL)** cùng với **bộ thông dịch (interpreter)** cho ngôn ngữ đó: mỗi quy tắc ngữ pháp (grammar rule) của ngôn ngữ được biểu diễn bằng một class, và các câu lệnh (expression) của ngôn ngữ được hiểu/đánh giá bằng cách duyệt qua **cây cú pháp** (AST) tạo từ các class này.

Nói đơn giản: khi bài toán của bạn có thể diễn đạt như **một ngôn ngữ có ngữ pháp riêng** (VD: biểu thức số học, quy tắc lọc dữ liệu, chuỗi tìm kiếm), bạn tạo ra các class tương ứng với từng quy tắc, rồi "đọc" chuỗi đầu vào → dựng cây → đánh giá cây để ra kết quả.

## 1. Using Interpreter (Khi nào dùng)

- **Có một ngôn ngữ đơn giản cần thông dịch**: biểu thức số học (`2 + 3 * 4`), quy tắc lọc (`status = 'active' AND age > 18`), điều kiện tìm kiếm.
- **Ngữ pháp đơn giản và ổn định**: số quy tắc ít, ít khi thay đổi. Ngữ pháp phức tạp → mỗi quy tắc một class sẽ phình to khó kiểm soát (hãy cân nhắc parser generator).
- **Cần linh hoạt thay đổi/thêm quy tắc**: thêm 1 quy tắc = thêm 1 class, không sửa code cũ (Open/Closed).
- **Tái sử dụng cây expression**: cùng một cây có thể đánh giá nhiều lần, hoặc biến đổi (optimize, compile sang ngôn ngữ khác) như các công cụ AST hiện đại.

## 2. Implementation Ways

### Cách 1: ES5 Functional (Object Literal Map) - [dofactory.js](./dofactory.js)
Thay vì class cho từng quy tắc, dùng **hàm đệ quy + bảng quy tắc** (map từ operator → hàm xử lý). Ngắn gọn, idiomatic JS, phù hợp DSL đơn giản như máy tính 4 phép tính.

### Cách 2: ES6 Class (Chuẩn GoF) - [es6-class.js](./es6-class.js)
Mỗi quy tắc ngữ pháp là một class implements chung interface `interpret(context)`:
- **TerminalExpression**: biểu thức đầu cuối (số, biến).
- **NonterminalExpression**: biểu thức kết hợp (`Add`, `Multiply`...) chứa các sub-expression và gộp kết quả của chúng.

```javascript
class Multiply {
  constructor(left, right) { this.left = left; this.right = right; }
  interpret(context) {
    return this.left.interpret(context) * this.right.interpret(context);
  }
}
// Cây: (2 + 3) * 4 → Multiply(Add(2,3), 4) → 20
```

## 3. Pros & Cons

### ✅ Advantages (Ưu điểm)
- **Dễ mở rộng ngữ pháp**: thêm quy tắc = thêm class mới, không sửa code hiện tại (Open/Closed Principle).
- **Dễ triển khai**: mỗi quy tắc tự nằm gọn trong một class — Single Responsibility Principle.
- **Cây expression tái sử dụng**: đánh giá nhiều lần, serialize, biến đổi, hoặc tối ưu trước khi chạy.

### ❌ Disadvantages (Nhược điểm)
- **Phình to khi ngữ pháp phức tạp**: mỗi quy tắc một class → hàng chục class cho DSL vừa.
- **Hiệu năng**: đánh giá bằng duyệt cây đệ quy chậm hơn code biên dịch sẵn; DSL phức tạp nên dùng parser generator (ANTLR) hoặc compiler.
- **Khó debug ngữ pháp**: lỗi grammar nằm rải rác trong nhiều class thay vì tập trung một chỗ.

## 4. Diagram

```
        Expression (interface)
       /                \
TerminalExpression   NonterminalExpression
 (Số, Biến)            /      |       \
                   Add()  Multiply()  ...
                       \      |       /
                     các sub-Expression (đệ quy)

Input: "(2 + 3) * 4"
  → Parser dựng cây:  Multiply( Add(Terminal 2, Terminal 3), Terminal 4 )
  → Client gọi root.interpret() → duyệt đệ quy → 20
```

## 5. Participants

**Abstract Expression** (`Expression`)
- Interface chung khai báo `interpret(context)` cho mọi node trong cây cú pháp.

**Terminal Expression** (`NumberExpression`, `VariableExpression`)
- Biểu thức đầu cuối của ngữ pháp — không chứa sub-expression, trả giá trị trực tiếp.

**Nonterminal Expression** (`AddExpression`, `MultiplyExpression`, ...)
- Mỗi class tương ứng một quy tắc ngữ pháp; giữ tham chiếu đến các sub-expression và gộp kết quả `interpret()` của chúng.

**Context** (`context` — map biến → giá trị)
- Dữ liệu toàn cục mà interpreter đọc/sửa khi đánh giá (VD: giá trị của các biến).

**Client** (`Parser` + code gọi)
- Dựng **cây cú pháp** từ input (thường qua parser), sau đó gọi `interpret()` trên node gốc.

## 6. Trong thực tế 2026

- **AST tools của JavaScript**: Babel, ESLint, Prettier, TypeScript Compiler — đều là ứng dụng quy mô lớn của tư duy Interpreter: dựng AST rồi **traverse + evaluate/transform** bằng Visitor (hai pattern này thường đi cặp với nhau).
- **Query language trong production**: MongoDB filter (`{ age: { $gt: 18 } }`), Elasticsearch Query DSL, GraphQL — client gửi "expression", engine build cây và evaluate.
- **Rule engines / pricing engines**: chuỗi điều kiện mô tả bằng JSON/DSL rồi được interpreted lúc runtime — không phải deploy lại code khi đổi quy tắc.
- **Lưu ý**: interpreter tự viết chỉ nên dùng cho DSL nhỏ; ngữ pháp phức tạp hãy dùng thư viện parser (`nearley.js`, `chevrotain`, ANTLR) — nguyên lý vẫn giống hệt Interpreter Pattern.

Ref: https://refactoring.guru/design-patterns/interpreter
