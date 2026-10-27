# JavaScript Decorator Pattern

> Decorator pattern cho phép **gắn thêm hành vi mới vào đối tượng lúc runtime** bằng cách "bọc" (wrap) chúng vào trong một đối tượng bọc (decorator), mà **không cần sửa class gốc**.

The **Decorator pattern** giống như **thêm topping vào cà phê**: ly cà phê gốc vẫn thế, bạn lần lượt thêm sữa, thêm caramel — mỗi lần thêm là "bọc" một lớp mới quanh ly cà phê cũ, và giá tiền cộng dồn. Decorator triển khai cùng interface với đối tượng nó bọc, nên client không nhận ra sự khác biệt.

## 1. Using Decorator (Khi nào dùng)

- Khi bạn muốn **thêm tính năng/hành vi cho đối tượng lúc runtime** mà không kế thừa (kế thừa là tĩnh, cố định lúc compile-time).
- Khi **kế thừa bùng nổ class**: ví dụ `Coffee + Sữa + Đường + Kem` — nếu dùng kế thừa bạn cần class `CoffeeSuaDuong`, `CoffeeSua`, `CoffeeDuong`... Decorator chỉ cần 3 decorator nhỏ.
- Khi muốn **bật/tắt tính năng linh hoạt**: chỉ gắn decorator khi cần (logging, caching, retry), không thì dùng đối tượng gốc.
- Khi muốn **mở rộng class `final`/thư viện bên thứ 3** mà không thể (hoặc không nên) sửa code gốc.

## 2. Implementation Ways

### Cách 1: ES5 (Sử dụng Function) - [dofactory.js](./dofactory.js)

Ví dụ kinh điển: `Coffee` gốc có hàm `cost()`. Các decorator `MilkDecorator`, `SugarDecorator` nhận đối tượng coffee qua constructor, bọc nó lại và cộng thêm giá — chuỗi decorator có thể lồng không giới hạn.

### Cách 2: ES6 Class - [es6-class.js](./es6-class.js)

`CoffeeDecorator` kế thừa `Coffee` và giữ tham chiếu đến đối tượng được bọc, ủy quyền mọi method cho đối tượng gốc, còn subclass chỉ override phần cần "trang trí". Ví dụ `LoggedUserService` bọc thêm logging quanh service thật.

```javascript
class CachedUserService extends UserService {
  async getUser(id) {
    // Decorator: thêm caching mà không sửa UserService gốc
    if (this.cache.has(id)) return this.cache.get(id);
    const user = await super.getUser(id);
    this.cache.set(id, user);
    return user;
  }
}
```

## 3. Pros & Cons

### ✅ Advantages (Ưu điểm)
- **Mở rộng hành vi linh hoạt hơn kế thừa:** Thêm/xóa/gắn nhiều decorator lúc runtime, không cần tạo bùng nổ class con.
- **Single Responsibility Principle (Nguyên lý Đơn trách nhiệm):** Tách các tính năng phụ (logging, caching, validate) ra khỏi logic cốt lõi của class gốc — mỗi decorator chỉ làm đúng một việc.
- **Open/Closed Principle (Nguyên lý Đóng/Mở):** Class gốc "đóng" với việc sửa đổi nhưng "mở" để mở rộng bằng decorator mới.
- **Có thể kết hợp tự do:** Nhiều decorator lồng nhau theo thứ tự tùy ý, tạo ra hàng loạt biến thể từ ít class.

### ❌ Disadvantages (Nhược điểm)
- **Ngăn xếp decorator khó gỡ lỗi:** Nhiều lớp bọc lồng nhau khiến stack trace khó đọc, khó biết lỗi phát sinh từ lớp nào.
- **Thứ tự gắn decorator có thể ảnh hưởng kết quả:** Với decorator có phụ thuộc nhau (vd: log trước hay cache trước), thứ tự gắn sai cho ra hành vi khác mong đợi.
- **Code khởi tạo phức tạp:** Việc "bọc" nhiều lớp khiến đoạn code tạo đối tượng trở nên dài dòng.

## 4. Diagram

```
   Component (interface chung)
   + getCost() / doWork()
          ▲
   ┌──────┴───────┐
   │              │
 Concrete     Decorator (bọc một Component)
 (Coffee)     - wrappee: Component
   ▲          + getCost() => wrappee.getCost() + extra
   │                  ▲
   │           ┌──────┴────────┐
   │      MilkDecorator  SugarDecorator
   │
 Client: new Sugar(new Milk(new Coffee(20000)))
 = Coffee 20k → + Milk 5k → + Sugar 2k => 27k

Mỗi lớp Decorator vừa là Component, vừa giữ 1 Component bên trong
```

## 5. Participants

**Component** (`Coffee`, `UserService`)
- Định nghĩa interface chung mà cả đối tượng gốc lẫn decorator đều tuân theo, giúp chúng hoán đổi cho nhau.

**Concrete Component** (`Espresso`, `UserService`)
- Đối tượng gốc cần được "trang trí" — chứa logic cốt lõi mà ta không muốn sửa.

**Decorator** (`CoffeeDecorator`, `LoggedUserService`)
- Kế thừa/implements Component, đồng thời **giữ một tham chiếu** đến một Component khác (đối tượng được bọc). Mọi lời gọi được ủy quyền cho đối tượng bên trong.

**Concrete Decorator** (`MilkDecorator`, `CachedUserService`, `LoggedUserService`)
- Thêm hành vi mới trước/sau khi ủy quyền cho đối tượng được bọc (cộng giá, ghi log, cache kết quả...).

**Client**
- Tạo đối tượng gốc rồi lần lượt bọc các decorator, sau đó dùng như một Component bình thường.

## 6. Trong thực tế 2026

Decorator đang bước vào một thời kỳ hoàng kim mới trong JavaScript hiện đại: **TC39 Decorators (stage 3)** đã được chuẩn hóa và hỗ trợ chính thức từ TypeScript 5.0 + Babel, cho phép viết `@log`, `@cache`, `@deprecated` ngay trên class/method thay vì bọc tay từng lớp. Trong các framework hiện đại, `@Injectable`, `@Component`, `@Controller` của NestJS/Angular đều là decorator; React Higher-Order Components (`withAuth(MyComponent)`) và các middleware chain của **Express/Redux** (`applyMiddleware(logger, thunk)`) là decorator ở dạng hàm. Ở hạ tầng backend, **caching/logging/rate-limit wrapper** bọc quanh service, hay InstrumentedHTTPClient bọc thêm tracing (OpenTelemetry) quanh fetch — tất cả đều thêm hành vi runtime mà không đụng vào code gốc.
