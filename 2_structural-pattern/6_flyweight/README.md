# JavaScript Flyweight Pattern

> Flyweight pattern chia đối tượng thành **state nội tại (intrinsic)** — dùng chung — và **state ngoại tại (extrinsic)** — truyền vào lúc gọi — nhằm **tiết kiệm bộ nhớ khi cần tạo số lượng lớn đối tượng cùng loại**.

The **Flyweight pattern** giống như **in 10.000 tờ giấy trong một văn phòng**: thay vì mỗi tờ giấy tự mang theo máy in của mình, tất cả 10.000 tờ chia sẻ chung một máy in (Flyweight Factory), mỗi tờ chỉ cần biết "tôi cần in ở tọa độ nào". Máy in là state nội tại (dùng chung), tọa độ là state ngoại tại (mỗi tờ khác nhau).

## 1. Using Flyweight (Khi nào dùng)

- Khi ứng dụng cần tạo **hàng nghìn, thậm chí hàng triệu đối tượng** có cùng bản chất: particle trong game, cây cối trong open world, tile trên bản đồ, ký tự trên trang văn bản.
- Khi **bộ nhớ là vấn đề**: mỗi đối tượng chiếm vài KB, nhưng nhân với hàng triệu cá thể thì trở thành vấn đề nghiêm trọng.
- Khi phần lớn trạng thái đối tượng có thể **tách thành phần dùng chung** (màu sắc, texture, font, mesh) và **phần riêng biệt** (tọa độ, góc xoay, trạng thái animation).
- Khi cần **tái sử dụng đối tượng** thay vì tạo mới liên tục (object pooling cũng dựa trên Flyweight).

## 2. Implementation Ways

### Cách 1: ES5 (Sử dụng Function) - [dofactory.js](./dofactory.js)

Ví dụ: Forest trong game mã nguồn mở của tác giả Game Programming Patterns — hàng nghìn Tree (cây) chia sẻ chung `TreeType` (texture, màu lá, kiểu thân) qua Flyweight Factory, mỗi Tree chỉ lưu tọa độ x/y/height riêng. So sánh số lượng đối tượng tạo ra khi dùng và không dùng Flyweight.

### Cách 2: ES6 Class - [es6-class.js](./es6-class.js)

Hệ thống render văn bản: `Character` (Flyweight, chia sẻ font glyph) và `TextRenderer` (Extrinsic, nhận font/style từ bên ngoài). Hoặc ví dụ game: `ParticleFactory` (Flyweight Factory) tạo particle từ hàng nghìn viên đạn/súng nổ trong game bắn súng.

```javascript
class TreeFactory {
  static getTreeType(name, color, texture) {
    // Nếu đã có TreeType này → trả về bản dùng chung (không tạo mới)
    // Nếu chưa → tạo và lưu vào cache
  }
}

class Tree {
  constructor(x, y, treeType) {
    this.x = x; this.y = y; // extrinsic - mỗi cây khác nhau
    this.treeType = treeType; // intrinsic - dùng chung
  }
}
```

## 3. Pros & Cons

### ✅ Advantages (Ưu điểm)
- **Tiết kiệm bộ nhớ lớn:** Chỉ lưu intrinsic state một lần trong Flyweight Factory, extrinsic state tách riêng. Khi có 1 triệu cây, thay vì lưu 1 triệu lần texture, chỉ cần lưu vài loại texture trong Factory.
- **Tăng hiệu năng:** Đối tượng nhẹ hơn → GC ít áp lực hơn → frame rate ổn định hơn (quan trọng với game, canvas rendering).
- **Caching thông minh:** Flyweight Factory hoạt động như cache, tránh tạo đối tượng trùng lặp.

### ❌ Disadvantages (Nhược điểm)
- **Phức tạp hóa thiết kế:** Phải phân tách rõ ràng intrinsic/extrinsic state, nếu không sẽ triển khai sai hoặc không hiệu quả.
- **Đánh đổi CPU lấy bộ nhớ:** Factory phải tra cứu cache trước khi tạo/sử dụng đối tượng, tăng chi phí tính toán nhỏ để đổi lấy ít bộ nhớ.
- **Khó debug hơn:** Extrinsic state thay đổi ở nhiều nơi ngoài chính đối tượng Flyweight — trace lỗi phức tạp hơn.

## 4. Diagram

```
  Flyweight Factory (Cache)
  ┌─────────────────────────────────┐
  │  treeTypes: Map                 │
  │  "Oak": TreeType { leaf, bark }  │  ← chỉ có 3-4 loại cây
  │  "Pine": TreeType { ... }       │
  │  "Birch": TreeType { ... }      │
  │  getTreeType(name, color, ...)  │  ← tra cứu / tạo + cache
  └─────────────────────────────────┘

  Tree instances (1 triệu cá thể)
  ├── Tree { x:100, y:200, type:TreeType("Oak") }  ← extrinsic
  ├── Tree { x:103, y:201, type:TreeType("Oak") }  ← extrinsic
  ├── Tree { x:250, y:300, type:TreeType("Pine") }  ← extrinsic
  └── ...

  → 1 triệu Tree (chỉ tọa độ) + vài TreeType (dùng chung)
     = Thay vì 1 triệu đối tượng đầy đủ
```

## 5. Participants

**Flyweight** (`TreeType`, `Character`)
- Đối tượng dùng chung, chứa **intrinsic state** (không thay đổi giữa các cá thể, ví dụ texture, font, màu cây). Có thể được dùng đồng thời bởi nhiều Flyweight instances.

**Flyweight Factory** (`TreeFactory`, `ParticleFactory`)
- Tạo và quản lý các Flyweight. Khi được yêu cầu một Flyweight, nó kiểm tra cache trước; nếu đã có → trả bản dùng chung, chưa có → tạo mới và lưu cache. Đảm bảo mỗi intrinsic state chỉ tồn tại một bản duy nhất.

**Client** (`Forest`, `Document`, `GameScene`)
- Tạo các đối tượng extrinsic (tọa độ, vị trí, kích thước riêng) và truyền extrinsic state vào Flyweight khi cần. Client có thể lưu trữ và quản lý extrinsic state tùy ý (trong mảng, object...).

## 6. Trong thực tế 2026

Flyweight là nền tảng kỹ thuật cho hầu hết mọi ứng dụng đồ họa hiện đại: **Canvas 2D / WebGL rendering** trong game và visualization dùng Flyweight triển khai "texture atlas" — thay vì mỗi sprite giữ bitmap riêng, hàng nghìn sprite chia sẻ một texture atlas (intrinsic), mỗi sprite chỉ lưu frame index + position (extrinsic). **React/Virtual DOM reconciliation** cũng tối ưu bằng Flyweight: khi render danh sách 10.000 item, thay vì mỗi item giữ nguyên element reference, Virtual DOM giữ intrinsic `type` và so sánh extrinsic `props` để quyết định re-render. **Object pooling** trong game engine (Phaser, PixiJS) — khi bắn 500 viên đạn, engine tái sử dụng `Bullet` instances từ pool thay vì `new Bullet()` mỗi frame — chính là Flyweight + Object Pool. Các thư viện như **Three.js** (WebGL) dùng Flyweight cho geometry/material sharing, **PixiJS** dùng cho sprite pooling, và **Matter.js** (vật lý) dùng cho body template.
