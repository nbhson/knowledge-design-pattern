# JavaScript Visitor Pattern

> **Visitor Pattern** (Mẫu khách viếng thăm) cho phép bạn **thêm một operation (thao tác) mới** vào một cấu trúc đối tượng (cây đối tượng phức tạp) mà **không phải sửa code của các class trong cấu trúc đó**. Cách làm: tách thuật toán ra khỏi object, đóng gói thuật toán vào một class riêng gọi là "Visitor", và để từng phần tử trong cấu trúc "đón" visitor vào (`accept(visitor)`).

Hãy hình dung một **kế toán đến "viếng thăm" công ty**: Công ty có nhiều loại nhân sự (Dev, Tester, Sales). Kế toán đi từng người và làm một việc: tính lương. Một ngày khác **bảo hiểm đến viếng thăm**: đi từng người, làm việc khác: tính phí bảo hiểm. Nhân viên không cần biết trước sẽ có bao nhiêu "khách" ghé — họ chỉ cần một cổng chung `accept(visitor)`, và mỗi visitor tự biết phải làm gì với từng loại nhân sự.

Ví dụ kỹ thuật điển hình: **xuất báo cáo từ cây Shape**. Bạn có danh sách Shape (Circle, Rectangle, Triangle). Hôm nay cần tính diện tích, mai cần xuất JSON, mốt cần xuất CSV, ngày kia cần vẽ ra SVG. Thay vì nhét đủ 4 method vào mỗi class Shape (làm phình class), bạn tạo 4 Visitor: `AreaVisitor`, `JsonExportVisitor`, `CsvExportVisitor`, `SvgExportVisitor`. Cây Shape giữ nguyên — chỉ "chấp nhận" visitor đi qua.

## 1. Using Visitor (Khi nào dùng)
- **Cấu trúc đối tượng ổn định, nhưng thao tác thì thay đổi liên tục**: Cây các class ít khi thêm loại phần tử mới (Shape vẫn chỉ có Circle/Rectangle/Triangle suốt nhiều năm), nhưng operation mới thì xuất hiện liên tục (tính diện tích, export JSON, vẽ SVG, đếm...). Đây là điều kiện lý tưởng để dùng Visitor.
- **Xử lý cây / cấu trúc phân cấp phức tạp**: AST (cây cú pháp) của compiler, cây DOM, cây tổ chức công ty, giỏ hàng nhiều loại sản phẩm — cần "đi qua" mọi node và làm gì đó với từng loại node khác nhau.
- **Tách logic "nên thuộc domain khác" ra khỏi domain object**: Class `Circle` không nên biết cách serialize ra CSV hay format ra báo cáo thuế — đó là việc của Visitor.
- **Muốn gom một operation rải rác nhiều nơi về một class duy nhất**: Thay vì method `exportJson()` nằm ở Circle, method đó nằm ở `JsonExportVisitor` — dễ đọc, dễ sửa, dễ test.

## 2. Implementation Ways

### Cách 1: ES5 Prototype - [dofactory.js](./dofactory.js)
Ví dụ kinh điển: cây **Shape** (Circle, Rectangle) với hai visitor: `AreaVisitor` (tính tổng diện tích) và `CsvExportVisitor` (xuất báo cáo CSV). Dùng kỹ thuật "double dispatch" nhẹ nhàng: mỗi shape có `accept(visitor)`, bên trong gọi ngược `visitor.visitCircle(this)` / `visitor.visitRectangle(this)` — nhờ đó Visitor biết chính xác mình đang gặp loại shape nào mà không cần `instanceof`.

### Cách 2: ES6 Class - [es6-class.js](./es6-class.js)
Chuẩn OOP Gang of Four với ví dụ **giỏ hàng xuất báo cáo**: cấu trúc gồm các loại sản phẩm (`Book`, `Electronics`, `Fruit`) và nhiều visitor: `PriceCalculatorVisitor` (tính tổng tiền + thuế từng loại), `JsonExportVisitor` (xuất giỏ hàng ra JSON). Thêm operation mới chỉ cần viết thêm 1 class Visitor — các class sản phẩm không hề bị sửa.

```js
const cart = [new Book("Clean Code", 400), new Electronics("Tai nghe", 1200)];

// Cùng một cây đối tượng, nhiều operation khác nhau
const total = new PriceCalculatorVisitor();
cart.forEach((item) => item.accept(total));
console.log(total.total); // tổng tiền có thuế

const exporter = new JsonExportVisitor();
cart.forEach((item) => item.accept(exporter));
console.log(exporter.getJson());
```

## 3. Pros & Cons

### ✅ Advantages (Ưu điểm)
- **Open/Closed Principle (đúng theo đúng nghĩa)**: Thêm operation mới = thêm class Visitor mới, không phải sửa bất kỳ class nào trong cấu trúc đối tượng.
- **Single Responsibility**: Mỗi operation sống trong một Visitor riêng — logic tính thuế không nằm vứt vọc trong class Product.
- **Gom thông tin khi duyệt cây**: Visitor có thể tích lũy trạng thái qua toàn bộ lần duyệt (tổng tiền, count, buffer JSON...) — điều khó làm nếu mỗi node tự xử lý độc lập.
- **Tách data và algorithm**: Cấu trúc dữ liệu (Shape, Cart item) thuần túy; thuật toán nằm bên ngoài. Rất hợp với phong cách functional.

### ❌ Disadvantages (Nhược điểm)
- **Khó thêm phần tử MỚI vào cấu trúc**: Đây là mặt trái của Open/Closed — thêm loại Shape mới (vd: `Triangle`) là phải sửa **tất cả** Visitor hiện có (thêm method `visitTriangle`). Visitor chỉ "mở" theo chiều operation, không "mở" theo chiều element.
- **Vi phạm Encapsulation nhẹ**: Visitor thường cần truy cập dữ liệu nội tại của element (đọc `price`, `radius`...) để làm việc, buộc các element phải lộ getter/public field nhiều hơn ý muốn.
- **Xương và dài dòng trong JS thuần**: Với cấu trúc nhỏ, một `switch` hay object-map đơn giản có khi ngắn gọn hơn cả bộ Visitor. Pattern này phát huy giá trị ở cấu trúc lớn, ổn định.

> 💡 Liên quan SOLID: **Open/Closed Principle** là linh hồn của Visitor (thêm operation không sửa code cũ) cùng **Single Responsibility Principle** (mỗi thuật toán một class). Cần hiểu rõ trade-off: pattern "mở" theo chiều thêm operation, nhưng "đóng" theo chiều thêm element type.

## 4. Diagram

```
                ┌──────────────────┐        ┌──────────────────────┐
                │     Element      │ accept │       Visitor        │
                │  + accept(v)     │───────►│  + visitCircle(c)    │
                └────────┬─────────┘        │  + visitRectangle(r) │
                         │ extends          └──────────┬───────────┘
              ┌──────────┼──────────┐                  │ implements
              ▼          ▼          ▼                  ▼
        ┌────────┐ ┌───────────┐ ┌────────┐   ┌──────────────┐ ┌────────────────────┐
        │ Circle │ │ Rectangle │ │ Triangle│  │ AreaVisitor  │ │ CsvExportVisitor   │
        └────────┘ └───────────┘ └────────┘   └──────────────┘ └────────────────────┘

   Luồng "double dispatch":
   shape.accept(visitor)  ──►  visitor.visitCircle(shape)  ──►  Visitor làm việc với shape
   (Element dispatch 1)         (Visitor dispatch 2 — biết chính xác loại element)
```

## 5. Participants
- **Visitor** (`ShapeVisitor`, `CartVisitor`): Interface khai báo tập method `visitXxx()` — một method cho mỗi loại element trong cấu trúc.
- **ConcreteVisitor** (`AreaVisitor`, `PriceCalculatorVisitor`, `JsonExportVisitor`): Cài đặt từng operation cụ thể. Đây là nơi toàn bộ thuật toán nằm, có thể giữ trạng thái tích lũy qua lần duyệt.
- **Element** (`Shape`, `CartItem`): Định nghĩa method `accept(visitor)`.
- **ConcreteElement** (`Circle`, `Book`, `Electronics`): Cài đặt `accept()` — bên trong gọi ngược đúng method `visitXxx(this)` của visitor (double dispatch).
- **ObjectStructure** (`shapes[]`, `cart`): Danh sách / cây chứa các element, cung cấp cách để duyệt qua tất cả và cho visitor "ghé thăm" từng node.

## 6. Trong thực tế 2026
Visitor là pattern nền tảng của toàn bộ **công cụ xử lý code trong hệ sinh thái JS**. **Babel** (và ESLint) xây dựng trên `@babel/traverse`: bạn viết visitor với method `Identifier()`, `CallExpression()`, `FunctionDeclaration()`... và Babel sẽ đi qua từng node của AST, gọi đúng method tương ứng — chính là Visitor Pattern với double dispatch. Các tool như **Prettier, TypeScript compiler (ts-morph), ESLint rules, jscodeshift (codemod)** đều làm việc theo mô hình này. Trong ứng dụng web thông thường, Visitor xuất hiện khi cần **xuất/nhân bản một cấu trúc dữ liệu phức tạp ra nhiều định dạng**: giỏ hàng → báo cáo JSON/CSV/PDF, cây tài liệu → HTML/Markdown/Word, kiến trúc VDOM diff (React) về bản chất cũng duyệt cây element với logic xử lý khác nhau cho từng loại node. Khi làm việc với **AST-based tooling** (viết ESLint custom rule, Babel plugin, codemod để nâng cấp codebase), bạn đang viết Visitor Pattern mỗi ngày mà có thể không gọi tên nó.
