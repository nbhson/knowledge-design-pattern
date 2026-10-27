# JavaScript Template Method Pattern

> **Template Method Pattern** định nghĩa **khung (skeleton)** của một thuật toán trong một phương thức (hàm) của class cha (superclass), và **bước cụ thể còn lại** được ủy quyền cho các class con (subclass) tự override mà không làm thay đổi cấu trúc tổng thể của thuật toán.

Nói một cách đơn giản: Bạn có một **công thức nấu ăn chuẩn** — "Đun sôi → Pha chế → Rót ra". Class con (Cà Phê, Trà, Nước Ép) chỉ việc override **từng bước nhỏ bên trong** mà không sửa lại toàn bộ công thức.

**Ví dụ đời thực**: Cùng một bộ khung quy trình đăng ký tài khoản cho nhiều loại user (Admin, Customer, Partner): **Bước 1** — Xác thực email (giống nhau), **Bước 2** — Tạo tài khoản (giống nhau), **Bước 3** — Gán quyền (khác nhau). Template Method giữ Bước 1, 2 cố định, chỉ cho phép override Bước 3.

## 1. Using Template Method (Khi nào dùng)
- **Khung thuật toán cố định, chi tiết thay đổi**: Khi có một quy trình (build pipeline, data export, payment flow) với **các bước giống nhau** và chỉ một vài bước nhỏ là khác biệt giữa các subclass.
- **Tránh trùng lặp code**: Nếu bạn copy-paste cùng một chuỗi `if / switch` vào hàng chục hàm gần giống nhau, đây là dấu hiệu cần dùng Template Method.
- **Đảm bảo thứ tự bước bắt buộc**: Quy trình như "mở file → parse → validate → transform → save" không được phép thay đổi thứ tự. Template Method khóa thứ tự đó vào framework, chỉ cho override từng bước.

## 2. Implementation Ways

### Cách 1: ES5 Prototype - [dofactory.js](./dofactory.js)
ES5 dùng function constructor + prototype. Class cha `Beverage` định nghĩa hàm `prepareRecipe()` chứa chuỗi gọi `boilWater() → brew() → pourInCup() → addCondiments()`. Subclass `Coffee`, `Tea` chỉ việc override `brew()` và `addCondiments()`. Đây là ví dụ kinh điển nhất của GoF.

```js
var Coffee = function () {};
Coffee.prototype = Object.create(Beverage.prototype);
Coffee.prototype.brew = function () { console.log("Chiết xuất cà phê..."); };
Coffee.prototype.addCondiments = function () { console.log("Thêm sữa"); };
```

### Cách 2: ES6 Class - [es6-class.js](./es6-class.js)
Dùng ES6 Class với `class` và `extends`. Đây là cách phổ biến nhất trong codebase 2020+. Ví dụ: **data processing pipeline** với 3 bước cố định `fetchData → processData → saveData`, subclass chỉ override `processData()` — phù hợp với CI/CD build pipeline, test framework hooks (`beforeEach`/`afterEach`).

```js
class DataPipeline {
    run() {
        this.fetchData();
        const result = this.processData();
        this.saveData(result);
    }
}
class UserExportPipeline extends DataPipeline {
    processData() { /* transform users */ }
}
```

## 3. Pros & Cons

### ✅ Advantages (Ưu điểm)
- **Loose Coupling**: Code xử lý tổng thể nằm ở class cha, subclass chỉ quan tâm phần riêng của mình → thay đổi phần cụ thể không ảnh hưởng phần chung.
- **Tái sử dụng code tối đa**: Mọi logic chung (Bước 1, 2) chỉ viết một lần trong class cha.
- **Đảm bảo ràng buộc thứ tự**: Không ai có thể vô tình đổi thứ tự các bước — cả build pipeline hay CI stage đều phải đúng trình tự.

### ❌ Disadvantages (Nhược điểm)
- **Class cha cứng nhắc (Rigid)**: Nếu thêm một bước mới (Bước 4) vào quy trình, phải sửa cả class cha và tất cả subclass.
- **Liskov Substitution có thể bị vi phạm**: Nếu subclass không hỗ trợ một bước nhất định (ví dụ không có `addCondiments()` — phương pháp làm đồ uống không pha cần gia vị), phải override rỗng (`addCondiments() {}`) — dấu hiệu thiết kế chưa tốt.
- **Chain inheritance dài**: Nếu dùng nhiều cấp kế thừa, debug flow rất khó theo dõi.

## 4. Diagram

```text
+------------------------------------------+
|           AbstractClass                   |
|            (Beverage)                     |
+------------------------------------------+
| + prepareRecipe() {                      |
|     this.boilWater();                     |
|     this.brew();         <-- abstract    |
|     this.pourInCup();                     |
|     this.addCondiments() <-- hook(có thể override) |
|   }                                       |
+------------------------------------------+
          ^                    ^
          | extends            | extends
+------------------+  +-------------------+
|  ConcreteClass A  |  |  ConcreteClass B  |
|   (Coffee)        |  |    (Tea)          |
+------------------+  +-------------------+
| brew(): pha cà phê | brew(): ngâm trà    |
| addCondiments()... | addCondiments()...  |
+------------------+  +-------------------+
```

## 5. Participants
- **AbstractClass** (`Beverage`, `DataPipeline`): Định nghĩa **Template Method** (khung thuật toán) và các **Primitive Operations** (bước con). Template Method gọi các bước theo thứ tự cố định.
- **ConcreteClass** (`Coffee`, `Tea`, `UserExportPipeline`): Cung cấp implementation cụ thể cho các bước (primitive operations) trong framework của class cha.

## 6. Trong thực tế 2026
Template Method ẩn mình trong hầu hết framework hiện đại: **React lifecycle** (`componentDidMount`/`componentDidUpdate`/`render` — framework gọi theo thứ tự cố định, bạn chỉ override từng hook), **Express middleware pipeline** (`app.use(handler)` — mỗi handler nhận `next()` và request tiến qua từng bước), **Jest/Mocha test hooks** (`beforeEach` → test body → `afterEach` — framework điều phối thứ tự, bạn viết logic từng bước), và **CI/CD pipeline** (lint → test → build → deploy) trong GitHub Actions, nơi mỗi job/step là một concrete class và workflow YAML là template method điều phối chúng.
