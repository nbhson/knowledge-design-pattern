# JavaScript Bridge Pattern

> Bridge pattern tách **Abstraction** (phần trừu tượng) khỏi **Implementation** (phần cài đặt) thành hai hệ phân cấp class độc lập, để chúng có thể thay đổi **một cách độc lập** với nhau mà không ảnh hưởng lẫn nhau.

The **Bridge pattern** giống như **cây cầu nối hai bờ**: phía bên này là các "hình dạng" (Shape), phía bên kia là các "cách vẽ/màu sắc" (Renderer). Thay vì tạo class `RedCircle`, `BlueCircle`, `RedSquare`, `BlueSquare`... (kết hợp tổ hợp n×m class), ta tạo 2 nhánh riêng rồi **cầu nối** chúng qua composition: `new Circle(new RedRenderer())`.

## 1. Using Bridge (Khi nào dùng)

- Khi bạn có nhiều **chiều thay đổi độc lập**: ví dụ Shape (Circle, Square, Triangle) × Renderer (Vector, Raster). Cách thông thường sẽ sinh ra n×m class con, Bridge chỉ cần n+m class.
- Khi muốn **chạy trên nhiều nền tảng khác nhau**: ví dụ một App UI muốn render trên cả Web (DOM) và Canvas/SVG mà không nhân đôi code.
- Khi cần **đổi implementation lúc runtime**: ví dụ chuyển API lưu trữ từ LocalStorage sang REST API mà client gọi không cần biết.
- Khi bạn muốn **giữ abstraction ổn định** trong khi đội khác vẫn đang phát triển phần implementation (2 nhóm làm việc song song).

## 2. Implementation Ways

### Cách 1: ES5 (Sử dụng Function) - [dofactory.js](./dofactory.js)

Ví dụ kinh điển: các `Shape` (Abstraction) nhận một `ColorAPI` (Implementor) qua constructor. `Shape.prototype.draw` ủy quyền việc lấy màu/tô màu cho implementation bên kia, giúp `Circle + Red` và `Circle + Blue` hoạt động mà không cần class riêng.

### Cách 2: ES6 Class - [es6-class.js](./es6-class.js)

`Shape` là Abstraction giữ tham chiếu `renderer` (Bridge), còn `VectorRenderer` / `RasterRenderer` là 2 Implementor độc lập. `Circle` / `Square` chỉ cần biết cách vẽ hình, còn "vẽ bằng gì" do renderer quyết định.

```javascript
class Circle extends Shape {
  draw() {
    // Bridge: ủy quyền phần "vẽ" sang implementation
    return this.renderer.renderCircle(this.radius);
  }
}

const circle = new Circle(new VectorRenderer(), 5);
circle.draw(); // vẽ vector
```

## 3. Pros & Cons

### ✅ Advantages (Ưu điểm)
- **Open/Closed Principle (Nguyên lý Đóng/Mở):** Có thể thêm Shape mới hoặc Renderer mới mà không phải sửa (và không làm vỡ) phía còn lại.
- **Giảm số lượng class:** Tránh tổ hợp class bùng nổ (n×m → n+m) khi có nhiều chiều biến thiên.
- **Single Responsibility Principle (Nguyên lý Đơn trách nhiệm):** Logic cấp cao (abstraction) và chi tiết nền tảng (implementation) tách biệt rõ ràng, dễ test riêng từng phần.
- **Chuyển đổi runtime:** Có thể hoán đổi implementation khi chương trình đang chạy.

### ❌ Disadvantages (Nhược điểm)
- **Phức tạp hóa code nhỏ:** Với class ít biến thể, việc tách 2 hệ phân cấp lại khiến code rườm rà không cần thiết.
- **Cặp đôi ràng buộc:** Client phải hiểu mối quan hệ abstraction–implementation để lắp "cây cầu" đúng cách.

## 4. Diagram

```
        Abstraction                      Implementor
     ┌───────────────┐                 ┌──────────────────┐
     │    Shape      │──── bridge ────▶│   ColorAPI /     │
     │ - renderer    │   (composition) │   Renderer       │
     │ + draw()      │                 │ + renderCircle() │
     └──────┬────────┘                 └───────┬──────────┘
            │ extends                          │ implements
     ┌──────┴────────┐                 ┌───────┴──────────┐
     │ Circle        │                 │ VectorRenderer   │
     │ Square        │                 │ RasterRenderer   │
     └───────────────┘                 └──────────────────┘

Client: new Circle(new VectorRenderer(), 5)
→ N Shape × M Renderer chỉ cần N + M class
```

## 5. Participants

**Abstraction** (`Shape`)
- Định nghĩa interface cấp cao mà client sử dụng, giữ một tham chiếu đến Implementor (đây chính là "cây cầu").

**Refined Abstraction** (`Circle`, `Square`)
- Mở rộng Abstraction với hành vi/đặc thù riêng, nhưng vẫn ủy quyền phần cài đặt cho Implementor.

**Implementor** (`Renderer`, `ColorAPI`)
- Định nghĩa interface cho phần cài đặt chi tiết. Chỉ cần các method cơ bản, không cần khớp 1:1 với interface của Abstraction.

**Concrete Implementor** (`VectorRenderer`, `RasterRenderer`, `RedColor`, `GreenColor`)
- Cài đặt cụ thể của Implementor (vẽ vector, vẽ raster, màu đỏ, màu xanh...).

## 6. Trong thực tế 2026

Bridge vẫn âm thầm hiện diện khắp nơi trong codebase hiện đại: **Event handling** là Bridge kinh điển — DOM event abstraction của bạn (`onClick`, `onKeydown`) bridge sang nhiều implementation nền tảng khác nhau (DOM thật, React synthetic event, jsdom cho test). Trong hệ sinh thái JS, các thư viện như **Fabric.js / Konva.js** bridge giữa một abstraction hình học (Shape) và nhiều renderer (Canvas 2D, SVG, WebGL). Tương tự, các HTTP client (Axios, Fetch wrapper) và layer dữ liệu hiện nay thường bridge giữa một interface ứng dụng duy nhất và nhiều adapter backend (REST, GraphQL, IndexedDB) — cùng tư tưởng tách "what" khỏi "how" để hai chiều thay đổi độc lập.
