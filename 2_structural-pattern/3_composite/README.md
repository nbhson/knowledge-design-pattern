# JavaScript Composite Pattern

> Composite pattern cho phép **tập hợp các đối tượng** được xử lý **giống hệt như một đối tượng đơn lẻ** bằng cách sắp chúng thành cấu trúc cây (tree).

The **Composite pattern** xây dựng cấu trúc hình cây: một **node cha (Composite)** có thể chứa các node con (có thể là **Leaf** hoặc là Composite khác), và tất cả đều dùng chung một interface. Nó giống như **thư mục trên máy tính** — bạn có thể tính dung lượng của 1 file, hoặc của cả 1 thư mục chứa hàng nghìn file con, bằng cách gọi cùng một hành động "get size".

## 1. Using Composite (Khi nào dùng)

- Khi dữ liệu của bạn có **cấu trúc phân cấp (cây)**: menu với submenu, thư mục chứa file, đơn hàng chứa các mặt hàng, phòng ban chứa nhân viên và phòng con.
- Khi bạn muốn **client thao tác thống nhất** trên phần tử đơn lẻ và nhóm phần tử: không cần viết `if (item is folder) ... else ...` ở mọi nơi.
- Khi bạn cần thực hiện **một thao tác đệ quy qua toàn bộ cây**: tính tổng giá trị, render toàn bộ DOM, liệt kê toàn bộ cây menu.
- Khi muốn **thêm loại node mới** mà không ảnh hưởng đến code xử lý cây hiện có.

## 2. Implementation Ways

### Cách 1: ES5 (Sử dụng Function) - [dofactory.js](./dofactory.js)

Ví dụ kinh điển: `FileItem` (Leaf) và `Folder` (Composite) đều kế thừa `FileSystemComponent` và đều có hàm `display()`. Folder chứa một mảng con và khi gọi `display()` nó sẽ lặp qua và gọi `display()` của từng con — chính là hoạt động đệ quy của Composite.

### Cách 2: ES6 Class - [es6-class.js](./es6-class.js)

Ví dụ đơn hàng: `Product` (Leaf) có giá riêng, `OrderBox` (Composite) chứa nhiều sản phẩm/đơn hàng con và có thể tính tổng giá đệ quy. Client chỉ cần gọi `getTotal()` trên node gốc mà không quan tâm cấu trúc bên trong.

```javascript
class OrderBox extends OrderComponent {
  add(component) {
    this.children.push(component); // Composite chứa các node con
  }
  getTotal() {
    // Đệ quy: cộng dồn tổng của toàn bộ cây con
    return this.children.reduce((sum, child) => sum + child.getTotal(), 0);
  }
}
```

## 3. Pros & Cons

### ✅ Advantages (Ưu điểm)
- **Làm việc với cấu trúc cây dễ dàng:** Client thao tác trên cấu trúc phức tạp như thao tác trên một đối tượng đơn giản — không cần viết các câu lệnh `if/else` kiểm tra loại phần tử.
- **Open/Closed Principle (Nguyên lý Đóng/Mở):** Có thể thêm loại thành phần mới (Leaf hoặc Composite) vào ứng dụng mà không phải sửa code client hiện có.
- **Tái sử dụng cấu trúc:** Cùng một node có thể xuất hiện ở nhiều nhánh của cây, cấu trúc tự mô tả rất trực quan.

### ❌ Disadvantages (Nhược điểm)
- **Khó giới hạn loại thành phần:** Composite cho phép chứa bất kỳ node nào, nên đôi khi bạn muốn composite chỉ chứa một số loại Leaf nhất định — điều này khó đảm bảo bằng type system ở JavaScript.
- **Thiết kế quá tổng quát:** Khi toàn bộ thành phần phải dùng chung một interface, các Leaf có thể bị ép buộc phải khai báo những method không có ý nghĩa với chúng (ví dụ `add()` trên một file).

## 4. Diagram

```
                 Component (interface chung)
                + getTotal() / display()
                          ▲
            ┌─────────────┴─────────────┐
            │                           │
        Leaf (Product)            Composite (OrderBox)
        + getTotal()              - children: []
                                  + add() / remove()
                                  + getTotal()  ──▶ gọi đệ quy
                                     getTotal() của từng child

Cây đơn hàng:
OrderBox (gốc)
├── Product: Keyboard  ─ 50$
├── Product: Mouse     ─ 25$
└── OrderBox (combo)   ─ 30$
    ├── Product: Cable ─ 10$
    └── Product: Pad   ─ 20$
root.getTotal() => 105$
```

## 5. Participants

**Component** (`OrderComponent`, `FileSystemComponent`)
- Định nghĩa interface chung cho mọi node trong cây (kể cả leaf), khai báo các hành vi mặc định và (tùy chọn) interface để quản lý node con như `add`, `remove`, `getChild`.

**Leaf** (`Product`, `FileItem`)
- Đối tượng lá của cây — không có con. Thường là nơi chứa phần lớn công việc thực sự (ví dụ giá sản phẩm, dung lượng file).

**Composite** (`OrderBox`, `Folder`)
- Lưu danh sách các node con (Component), cài đặt các method quản lý con, và thường **ủy quyền/đệ quy** công việc qua các con.

**Client**
- Thao tác với các node trong cây thông qua interface Component — không phân biệt đây là Leaf hay Composite.

## 6. Trong thực tế 2026

Composite là pattern mà lập trình viên front-end dùng **mỗi ngày mà không nhận ra**: **React component tree** chính là một Composite khổng lồ — một component có thể render 1 phần tử hoặc cả một cây con, và React đệ quy qua toàn bộ cây đó để render DOM; việc khái niệm "1 phần tử cha = toàn bộ cây con của nó" chính là bản chất Composite. Tương tự, **DOM thật** của trình duyệt (`Node` → `Element`/`Text`) là ví dụ gốc trong sách giáo khoa, còn các thư viện virtual DOM (React, Vue) tái tạo cây này bằng JavaScript objects. Ở phía backend, cấu trúc **đơn hàng – combo – sản phẩm**, cây **thư mục/tệp trên cloud storage** (Google Drive, S3), hay cây **quyền hạn trong permission system** đều được mô hình hóa bằng Composite để tính tổng/tối ưu/kiểm tra duyệt theo kiểu đệ quy trên toàn cây.
