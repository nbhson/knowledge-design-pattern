# JavaScript Chain of Responsibility Pattern

> **Chain of Responsibility Pattern** (Mẫu chuỗi trách nhiệm) cho phép bạn xây dựng một **chuỗi các handler** (bộ xử lý). Một request được đưa vào đầu chuỗi, mỗi handler lần lượt nhận request, quyết định **tự xử lý** hoặc **chuyển tiếp cho handler kế tiếp** trong chuỗi. Người gửi request không cần biết (và không cần quan tâm) cuối cùng handler nào sẽ xử lý nó.

Ví dụ đời thực: **đường dây nóng hỗ trợ khách hàng (support hotline)**. Bạn gọi vào tổng đài, máy trả lời tự động (Tier 0) → nhân viên cấp 1 (Tier 1) tiếp nhận vấn đề cơ bản → nếu quá khó, chuyển lên cấp 2 → cấp 3 là kỹ sư cao nhất. Khách hàng chỉ cần cúp máy 1 lần — họ KHÔNG cần biết ai sẽ xử lý, cứ để hệ thống tự "chuyển máy".

Hoặc quen thuộc hơn với dev: **middleware trong Express**. Request đi qua chuỗi middleware (auth → logging → body-parser → controller). Middleware nào `next()` là chuyển tiếp, middleware nào không gọi `next()` là chặn lại (chẳng hạn trả về 401).

## 1. Using Chain of Responsibility (Khi nào dùng)
- **Nhiều object đều có thể xử lý một request**, nhưng handler cụ thể chỉ được xác định lúc runtime (không biết trước): ví dụ một log message có thể do Logger Debug, Logger File, hoặc Logger Error xử lý tùy theo mức độ nghiêm trọng.
- **Muốn tách từng bước xử lý thành các khối độc lập, có thể tái sử dụng và tái thứ tự**: Kiến trúc middleware (auth → rate-limit → logging → business) cho phép bạn thêm/bớt/xáo trộn các bước mà không sửa code của nhau.
- **Thay thế chuỗi if-else / switch-case dài** theo kiểu "kiểm tra điều kiện A, nếu không khớp thì kiểm tra B, rồi C...". Mỗi nhánh if được bóc thành một handler riêng.
- **Các handler có thứ tự ưu tiên rõ ràng** và chỉ một (hoặc một số) handler cuối cùng xử lý xong request.

## 2. Implementation Ways

### Cách 1: ES5 Prototype - [dofactory.js](./dofactory.js)
Ví dụ kinh điển: Hệ thống support 3 cấp (Tier 1 → Tier 2 → Tier 3). Mỗi `SupportHandler` giữ tham chiếu `nextHandler`. Method `handleRequest(ticket)` kiểm tra xem mức độ của ticket có thuộc "trách nhiệm" của mình không: đúng thì xử lý, sai thì gọi `this.nextHandler.handleRequest(ticket)` — chuyền tiếp xuống cấp dưới. Client chỉ việc gọi handler đầu tiên trong chuỗi.

### Cách 2: ES6 Class - [es6-class.js](./es6-class.js)
Chuẩn OOP Gang of Four với ví dụ **middleware request handling**: abstract class `Middleware` cung cấp method `setNext()` (nối chuỗi) và `handle()` có sẵn logic chuyển tiếp. Các class con (`AuthMiddleware`, `RateLimitMiddleware`, `LoggingMiddleware`) chỉ cần override `doHandle()` — logic "nối tiếp hay dừng" nằm gọn ở base class. Chain hoạt động y hệt Express middleware.

```js
const chain = new AuthMiddleware();
chain.setNext(new RateLimitMiddleware()).setNext(new LoggingMiddleware());

// Request đi qua: Auth → RateLimit → Logging
const result = chain.handle({ user: "son", path: "/api/orders" });
```

## 3. Pros & Cons

### ✅ Advantages (Ưu điểm)
- **Single Responsibility**: Mỗi handler chỉ lo một việc (auth lo auth, logging lo logging) — tách nhỏ logic ra thành các class gọn gàng, dễ test riêng lẻ.
- **Open/Closed Principle**: Thêm một handler mới vào chuỗi (vd: thêm rate-limit vào trước auth) mà **không cần sửa** code của các handler hiện có hay của client.
- **Giảm coupling giữa sender và receiver**: Client chỉ cần bắn request vào đầu chuỗi, không cần biết cuối cùng ai xử lý. Thứ tự handler cũng có thể thay đổi lúc runtime.
- **Tái sử dụng**: Cùng một handler có thể xuất hiện ở nhiều chuỗi khác nhau (Logging dùng cho cả request API lẫn job background).

### ❌ Disadvantages (Nhược điểm)
- **Request có thể "rơi tự do"**: Nếu không có handler nào trong chuỗi xử lý, request bị bỏ qua lặng lẽ — cần đảm bảo có handler "bắt buộc xử lý" ở cuối chuỗi (fallback / default handler).
- **Khó debug khi chuỗi dài**: Một request đi qua 10 handler, muốn biết nó "chết" ở đâu cần trace từng mắt xích. Đệ quy sâu cũng có thể gây stack overflow nếu chuỗi quá dài.
- **Thứ tự quan trọng nhưng dễ bị bỏ qua**: Xếp logging sau auth hay trước auth cho kết quả rất khác nhau; developer mới dễ mắc lỗi thứ tự mà không có compile-time check nào cảnh báo.

> 💡 Liên quan SOLID: **Single Responsibility Principle** (mỗi handler một trách nhiệm) và **Open/Closed Principle** (thêm handler không sửa code cũ). Đây là hai nguyên lý mà Chain of Responsibility thể hiện rõ nhất.

## 4. Diagram

```
   Client ──request──► ┌──────────────┐ can't ──► ┌──────────────┐ can't ──► ┌──────────────┐
                       │   Handler A  │─────────► │   Handler B  │─────────► │   Handler C  │
                       │  (Tier 1)    │           │  (Tier 2)    │           │  (Tier 3)    │
                       └──────┬───────┘           └──────┬───────┘           └──────┬───────┘
                              │ can                      │ can                      │ can
                              ▼ handle                   ▼ handle                   ▼ handle
                          [ xử lý xong,              [ xử lý xong,              [ xử lý xong,
                            KHÔNG gọi next() ]         KHÔNG gọi next() ]         kết thúc chuỗi ]

   Mỗi handler: { handle(request) { if (đúng trách nhiệm mình) xử lý; else next.handle(request); } }
```

## 5. Participants
- **Handler** (`SupportHandler`, `Middleware`): Định nghĩa interface chung cho các bước xử lý, thường chứa method `setNext()` để nối chuỗi và `handle()`/`handleRequest()` để nhận request. Có thể cung cấp sẵn logic chuyển tiếp mặc định ở class cha.
- **ConcreteHandler** (`Tier1Support`, `Tier2Support`, `AuthMiddleware`, `RateLimitMiddleware`): Cài đặt logic xử lý cụ thể. Quyết định: tự xử lý request, hoặc chuyền tiếp `next.handle(request)`, hoặc bỏ qua (khi không có next).
- **Client**: Tạo các handler, nối chúng thành chuỗi, và gửi request vào handler đầu tiên. Không cần biết handler nào sẽ xử lý cuối cùng.

## 6. Trong thực tế 2026
Chain of Responsibility là pattern **phổ biến nhất trong daily work của một JS dev** — dù bạn có nhận ra hay không. **Express/Koa middleware stack** chính là chuỗi trách nhiệm thuần khiết: `app.use(cors()).use(helmet()).use(authMiddleware).use(routes)`; Koa thậm chí hiện đại hơn với `async/await` + `next()` cho phép xử lý cả "sau khi" handler con chạy xong (kiểu onion model). Tương tự ở tầng khác: **Redux middleware** (`thunk`, `saga`, `logger`) tạo chuỗi xử lý giữa `dispatch` và `reducer`. **Trình duyệt Event Propagation** (bubbling: button → div → document) cũng là một chuỗi handler lần lượt đón event. Với backend, các pipeline xử lý như **logging levels** (debug → info → warn → error, message chỉ được handler tương ứng "nuốt"), **rate limiting & auth chain** trong Fastify/NestJS guards, hay hệ thống **support ticketing** (Zendesk, Intercom) với escalation tier 1→2→3 đều là CoR. Trong codebase lớn, các **validation pipeline** (Zod, Joi compose nhiều rule) cũng chạy theo tinh thần chuỗi: rule nào fail thì dừng, không fail thì chuyền tiếp.
