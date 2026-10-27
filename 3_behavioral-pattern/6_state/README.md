# JavaScript State Pattern

> **State Pattern** cho phép một object thay đổi **hành vi của nó** khi **trạng thái nội tại (internal state)** thay đổi. Object sẽ tự động "trông như" đã đổi sang một class khác — mỗi trạng thái được đóng gói thành một class riêng triển khai chung một Interface.

Nói một cách đơn giản: Thay vì viết một hàm `if (state === 'pending') ... else if (state === 'shipped') ...` dài ngoằng khắp nơi, chúng ta **tách mỗi trạng thái thành một class riêng** với hành vi riêng của nó, và object chính (Context) chỉ việc **ủy quyền (delegate)** cho trạng thái hiện tại.

**Ví dụ đời thực**: **Máy bán nước tự động** — khi bạn bỏ tiền vào, hành vi của máy phụ thuộc vào trạng thái nó đang ở:
- Nếu **chưa có tiền** (`NoCoinState`): nhận tiền → chuyển sang "Đã có tiền", còn nút chọn nước thì báo "mời bỏ tiền trước".
- Nếu **đã có tiền** (`HasCoinState`): nhận thêm tiền → báo lỗi "đã có coin rồi", còn bấm chọn nước → xả nước, trả tiền thừa, về lại "Chưa có tiền".

Cùng một hành động "bấm nút chọn nước" nhưng hành vi hoàn toàn khác nhau tùy trạng thái. Tương tự: trạng thái **Đơn hàng** (`pending` → `shipped` → `delivered`) hay **trình phát nhạc** (`playing` → `paused` → `stopped`).

## 1. Using State (Khi nào dùng)
- **Thay thế mớ if-else/switch theo trạng thái**: Khi bạn thấy code có dấu hiệu `if (this.state === 'x') ... else if ...` lặp đi lặp lại ở nhiều method khác nhau → đó là lúc cần State pattern.
- **Hành vi phụ thuộc trạng thái phức tạp**: Ví dụ máy bán nước — mỗi nút bấm có hành vi khác nhau ở từng trạng thái (có coin/chưa coin, còn hàng/hết hàng).
- **State machine nghiệp vụ**: Trạng thái đơn hàng, vòng đời bài viết (draft → review → published), trạng thái kết nối (connecting → open → closing → closed), workflow phê duyệt.
- **Cần đảm bảo chuyển trạng thái hợp lệ**: Không cho phép chuyển từ `delivered` về `pending` một cách tùy tiện — các class State kiểm soát việc "ai được chuyển sang đâu".

## 2. Implementation Ways

### Cách 1: ES5 Prototype (kinh điển GoF) - [dofactory.js](./dofactory.js)
Ví dụ kinh điển **máy bán nước**. ES5 dùng function constructor + prototype, mỗi State là một hàm constructor chứa tham chiếu ngược về Context (máy bán nước). Context giữ `this.state` và gọi `this.state.insertCoin()` / `this.state.dispense()` — hành vi tự động thay đổi theo trạng thái hiện tại.

```js
var NoCoinState = function (machine) {
    this.machine = machine;
};
NoCoinState.prototype.insertCoin = function () {
    console.log("Đã nhận xu. Chọn nước đi!");
    this.machine.setState(this.machine.hasCoinState);
};
```

### Cách 2: ES6 Class - [es6-class.js](./es6-class.js)
Cách chuẩn OOP hiện đại với ES6 Class + kế thừa từ base class `OrderState`. Ví dụ minh hoạ **vòng đời đơn hàng thương mại điện tử**: `PendingState → ShippedState → DeliveredState`, mỗi state tự định nghĩa được action nào hợp lệ (ship, deliver, cancel...) — giống tư tưởng của XState nhưng viết tay bằng JS thuần.

```js
class Order {
    constructor() {
        this.state = new PendingState(this);
    }
    setState(state) {
        this.state = state;
        console.log(`-> Trạng thái: ${state.label}`);
    }
    ship() { this.state.ship(); }
}
```

## 3. Pros & Cons

### ✅ Advantages (Ưu điểm)
- **Single Responsibility Principle**: Mỗi trạng thái là một class độc lập, chứa logic riêng → dễ đọc, dễ test từng state một cách riêng biệt.
- **Open/Closed Principle**: Thêm trạng thái mới (VD: `CancelledState`, `RefundedState`) chỉ cần tạo class mới và nối chuyển trạng thái, không cần sửa code các trạng thái cũ.
- **Loại bỏ điều kiện khổng lồ**: Không còn `switch(state)` trong 10 method khác nhau — mỗi state tự lo hành vi của mình.
- **Chuyển trạng thái rõ ràng (Explicit)**: Đọc code là biết ngay trạng thái nào cho phép action nào, rất khó tạo ra trạng thái "ma" (state không tồn tại trong sơ đồ).

### ❌ Disadvantages (Nhược điểm)
- **Tăng số class**: Mỗi trạng thái cần một class riêng → code phình to nếu state machine đơn giản (chỉ 2-3 trạng thái thì if-else gọn hơn).
- **Context bùng nổ method**: Context phải expose đủ action (ship, deliver, cancel...) mà mọi trạng thái đều phải implement, kể cả khi hành động đó không hợp lệ (chỉ log cảnh báo).
- **Cần hiểu rõ sơ đồ chuyển trạng thái**: Dev mới vào dễ bỏ sót việc cài đặt một hành vi cho một state nào đó.

## 4. Diagram

```text
                 +---------------------------+
                 |         Context           |
                 |        (VendingMachine)   |
                 +---------------------------+
                 | - state: State            |
                 | + setState(state)         |
                 | + insertCoin()  ----> delegate ---> state.insertCoin()
                 | + dispense()    ----> delegate ---> state.dispense()
                 +---------------------------+
                              |
                              | giữ tham chiếu đến state hiện tại
                              v
                 +---------------------------+
                 |        <<interface>>      |
                 |           State           |
                 +---------------------------+
                 | + insertCoin()            |
                 | + dispense()              |
                 +---------------------------+
                    ^                   ^
                    |                   |
        +-----------+------+  +---------+-----------+
        |  NoCoinState      |  |   HasCoinState      |
        | insertCoin() ->   |  | insertCoin() ->      |
        |  chuyển HasCoin   |  |  báo "đã có xu"      |
        | dispense() ->     |  | dispense() -> xả nước|
        |  "mời bỏ tiền"    |  |  về NoCoinState      |
        +-------------------+  +----------------------+
```

## 5. Participants
- **Context** (`VendingMachine`, `Order`): Lưu một tham chiếu đến thể hiện của một lớp trạng thái cụ thể, và **ủy quyền (delegate)** mọi hành vi trạng thái-phụ thuộc cho nó. Cung cấp `setState()` để thay đổi trạng thái runtime.
- **State** (`State` base class / interface): Khai báo interface chung cho tất cả các hành vi cụ thể gắn với một trạng thái.
- **ConcreteState** (`NoCoinState`, `HasCoinState`, `SoldOutState`, `PendingState`, `ShippedState`...): Tự triển khai hành vi riêng cho từng trạng thái, và có thể quyết định **khi nào chuyển sang trạng thái khác** (State pattern đôi khi có các state biết về nhau để tự chuyển).

## 6. Trong thực tế 2026
State Pattern là trái tim của các **state machine library** như **XState** (rất hot trong frontend 2024-2026) — nơi bạn định nghĩa machine với các `states`, `events`, `transitions` và XState đảm bảo không bao giờ rơi vào trạng thái không hợp lệ. Trong **backend**, vòng đời **đơn hàng** (`pending → paid → shipped → delivered → refunded`) của Stripe/PayPal Order API, hay **status của job trong queue** (BullMQ: `waiting → active → completed/failed`) đều là state machine rõ ràng. Trong **game dev**, character state (idle/run/jump/attack) và **music player** (playing/paused/stopped) là ví dụ kinh điển để dạy pattern này.
