# JavaScript Mediator Pattern

> **Mediator Pattern** (Mẫu trung gian) định nghĩa một object trung tâm đảm nhiệm việc điều phối giao tiếp giữa một nhóm các object, thay vì để chúng nói chuyện trực tiếp với nhau. Nhờ vậy các object không cần giữ tham chiếu tới từng đồng nghiệp (colleague) — chúng chỉ biết duy nhất Mediator — giúp **giảm mạnh sự phụ thuộc lẫn nhau (loose coupling)**.

Hãy tưởng tượng **tháp điều không (Air Traffic Control)**: các máy bay không bao giờ liên lạc trực tiếp với nhau để hỏi "chuyện gì đang xảy ra, ai đang cất cánh?". Tất cả đều chỉ nói chuyện với tháp điều không, và tháp điều phối toàn bộ. Nếu không có tháp, 100 máy bay phải biết về 99 máy bay còn lại — cơn ác mộng về coupling.

Tương tự trong một **chatroom**: người dùng A không cần biết B, C là ai hay giữ reference tới họ. A chỉ `send()` qua chatroom, và chatroom chịu trách nhiệm bắn tin đến đúng những người còn lại.

## 1. Using Mediator (Khi nào dùng)
- **N+1 object phải "nói chuyện" với nhau liên tục**: Khi mỗi component bắt đầu giữ tham chiếu tới các component khác (Form ↔ Input ↔ Button ↔ Dialog...), mạng lưới tham chiếu chữ nhật trở nên impossible bảo trì. Đưa Mediator vào, mỗi component chỉ biết 1 mediators duy nhất.
- **Một thay đổi ở object A phải kéo theo phản ứng ở nhiều object khác**, nhưng bạn không muốn A phải biết đích danh những object đó là ai (khác với Observer — ở đó các observer tự đăng ký, còn ở đây mediator chủ động điều phối luồng business).
- **Logic giao tiếp cần tập trung về một chỗ**: Ví dụ validate toàn bộ form (nếu ô Email trống thì disable nút Submit và hiện lỗi) — nên đặt ở Form/ mediator thay vì mỗi input tự quản lý.
- **Giảm rủi ro "đá nhau" khi nhiều component cùng sửa một trạng thái chung**: Mediator đóng vai trò trọng tài (air traffic control), quyết định thứ tự và luồng xử lý.

## 2. Implementation Ways

### Cách 1: ES5 Prototype - [dofactory.js](./dofactory.js)
Ví dụ kinh điển: Chatroom làm Mediator. Mỗi `User` (colleague) khi muốn nhắn tin chỉ gọi `chatroom.send(message, from)`. Chatroom duyệt danh sách user và bắn tin đến tất cả mọi người **trừ người gửi**. Các User hoàn toàn không biết về nhau — mọi đường dây liên lạc đi qua trung tâm.

### Cách 2: ES6 Class - [es6-class.js](./es6-class.js)
Chuẩn OOP Gang of Four với ví dụ **tháp điều không**: `AirTrafficControlTower` là Mediator, `Airplane` là Colleague. Máy bay gọi `requestLanding()` và `notifyOthers()`, tháp điều kiểm tra danh sách máy bay đang cất/hạ cánh để phê duyệt hoặc yêu cầu chờ — máy bay không hề biết sự tồn tại của các máy bay khác.

```js
const tower = new AirTrafficControlTower();

const vn150 = new Airplane("VietnamAirlines-150", tower);
const jets = new Airplane("Jetstar-902", tower);

tower.registerPlane(vn150);
tower.registerPlane(jets);

// Không ai nói chuyện trực tiếp với nhau, mọi thứ đi qua tháp
vn150.requestLanding(); // tower duyệt → thông báo tới Jetstar-902 " VN150 đang hạ cánh"
```

## 3. Pros & Cons

### ✅ Advantages (Ưu điểm)
- **Loose Coupling**: Các Colleague không cần giữ tham chiếu tới từng object khác; chỉ biết duy nhất Mediator. Thêm/bớt một User trong chatroom không cần sửa code của các User còn lại.
- **Single Responsibility**: Toàn bộ logic "ai nói với ai, khi nào" tập trung tại một class duy nhất, dễ đọc, dễ debug, dễ test — thay vì rải rác ở 10 file.
- **Dễ mở rộng luồng giao tiếp**: Muốn thêm rule mới (vd: lọc tin nhắn spam trong chatroom), chỉ sửa Mediator.

### ❌ Disadvantages (Nhược điểm)
- **God Object**: Nếu lạm dụng, Mediator sẽ phình to thành một class khổng lồ biết và làm mọi thứ — chính là "anti-pattern God Object". Cần giữ cho nó chỉ điều phối, không chứa business logic lác đác.
- **Điểm lỗi duy nhất (Single Point of Failure)**: Mọi thứ đi qua mediator, mediator chết thì toàn hệ thống ngừng "giao tiếp".
- **Hiệu năng**: Với số lượng colleague lớn và tin nhắn dồn dập, mediator trở thành nút thắt cổ chai.

> 💡 Liên quan SOLID: Mediator là hiện thân của **Dependency Inversion Principle** — các colleague phụ thuộc vào abstraction (mediator interface) thay vì phụ thuộc lẫn nhau. Cũng hỗ trợ **Open/Closed Principle**: thêm colleague mới không phải sửa các colleague cũ.

## 4. Diagram

```
        KHÔNG CÓ MEDIATOR (mạng lưới phụ thuộc chồng chéo)
   A ─────── B            Mỗi object phải biết
   │ ╲     ╱ │            về tất cả object còn lại
   │   ╲ ╱   │
   │   ╱ ╲   │
   │ ╱     ╲ │
   C ─────── D

        CÓ MEDIATOR (sao - star topology)
              A
              │
   D ───── Mediator ───── B     Mỗi object chỉ biết
              │                 duy nhất Mediator
              C
```

## 5. Participants
- **Mediator** (`AirTrafficControlTower`, `ChatRoom`): Object trung tâm, định nghĩa interface điều phối giao tiếp, giữ danh sách các colleague và logic chuyển tiếp thông điệp.
- **Colleague** (`User`, `Airplane`): Các object giao tiếp qua mediator. Mỗi colleague giữ reference tới mediator (thay vì tới các colleague khác) và gọi method của mediator khi cần "nói chuyện".
- **Client**: Tạo mediator, đăng ký các colleague, và kích hoạt luồng giao tiếp.

## 6. Trong thực tế 2026
Mediator hiện diện ở khắp mọi nơi trong hệ sinh thái JS hiện đại. **Event Bus / Pub-Sub trung tâm** ( Mitt, Nano Events, hoặc `window.eventBus` trong micro-frontend) chính là một Mediator thu nhỏ: các module publish/subscribe qua bus mà không import code của nhau. Trong backend, **message broker** (Redis Pub/Sub, Kafka, RabbitMQ) là mediator ở mức hệ thống: các service không gọi API trực tiếp của nhau mà giao tiếp qua broker. Trong frontend phức tạp, khi nhiều widget trên dashboard phải phản ứng cùng một trạng thái (bản đồ + sidebar + thông báo), việc đưa một mediator/controller điều phối giúp tránh tình trạng các widget "nắm tay nhau" vào chỗ khác. Kiến trúc **MediatR-style (CQRS pipeline)** từ thế giới .NET cũng được port sang Node.js (thư viện như `mediatr-ts`) để tách request handler khỏi controller — cùng một tư duy: ai cần gì, hỏi trung tâm.
