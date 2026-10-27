# JavaScript Command Pattern

> **Command Pattern** (Mẫu lệnh) đóng gói một yêu cầu (request/hành động) thành một đối tượng độc lập, chứa đầy đủ thông tin cần thiết để thực thi hành động đó. Nhờ vậy bạn có thể **truyền lệnh như tham số**, **xếp hàng đợi (queue)**, **ghi log**, và quan trọng nhất là **hoàn tác (undo)** hành động đã làm.

Nói một cách đơn giản: Thay vì gọi trực tiếp `light.on()` khắp nơi trong code, chúng ta gói hành động "BẬT ĐÈN" vào một object lệnh. Ai giữ lệnh đó (remote, hàng đợi, lịch sử) có thể chạy nó, lưu nó, hoặc đảo ngược nó mà không cần biết bên trong làm gì.

**Ví dụ đời thực**: Cái remote điều khiển đa năng trong nhà — mỗi nút bấm là một "lệnh" được gắn sẵn (nút 1: bật đèn, nút 2: bật quạt). Bạn cũng có thể hình dung bộ **Undo/Redo (Ctrl+Z / Ctrl+Y)** trong trình soạn thảo văn bản: mỗi lần gõ/định dạng là một lệnh được đẩy vào stack lịch sử, nhấn Ctrl+Z thì lấy lệnh cuối ra và chạy ngược lại.

## 1. Using Command (Khi nào dùng)
- **Cần Undo/Redo**: Mọi hành động quan trọng (xoá file, chỉnh sửa tài liệu, giao dịch chuyển tiền) nên được đóng gói thành Command kèm hàm `execute()` / `undo()`. Lịch sử thao tác chỉ là một mảng các Command.
- **Hàng đợi & lên lịch (Queue/Scheduler)**: Khi muốn gom các request rồi xử lý sau (job queue, gửi email hàng loạt, sync dữ liệu khi có mạng lại) — command object có thể xếp hàng, lưu vào DB, gửi qua network.
- **Tách rời "người ra lệnh" khỏi "người thực thi"**: Remote (Invoker) không cần biết đèn hoạt động thế nào, nó chỉ gọi `command.execute()`. Thêm thiết bị mới không phải sửa remote.
- **Macro / ghi lại chuỗi thao tác**: Một Command tổng hợp có thể chạy nhiều Command con tuần tự (như macro trong Excel, batch script).

## 2. Implementation Ways

### Cách 1: ES5 Prototype (kinh điển GoF) - [dofactory.js](./dofactory.js)
Ví dụ kinh điển: Remote điều khiển (Invoker) gắn các Command vào nút bấm. Command là object có method `execute()`/`undo()`, bên trong giữ tham chiếu đến Receiver (Light, Fan). ES5 dùng function constructor + prototype để định nghĩa `LightOnCommand`, `LightOffCommand`...

```js
var LightOnCommand = function (light) {
    this.light = light;
};
LightOnCommand.prototype.execute = function () {
    this.light.on();
};
LightOnCommand.prototype.undo = function () {
    this.light.off();
};
```

### Cách 2: ES6 Class - [es6-class.js](./es6-class.js)
Cách code chuẩn OOP hiện đại với ES6 Class + kế thừa từ class cha `Command`. Ví dụ minh hoạ **Undo/Redo trong trình soạn thảo văn bản**: mỗi thao tác gõ chữ là một `TypeCommand` được đẩy vào history; Ctrl+Z lấy command cuối cùng gọi `undo()`, Ctrl+Y gọi lại `redo()`.

```js
class Editor {
    execute(command) {
        command.execute();
        this.history.push(command); // lưu vào lịch sử để undo
    }
    undo() {
        const command = this.history.pop();
        if (command) command.undo();
    }
}
```

## 3. Pros & Cons

### ✅ Advantages (Ưu điểm)
- **Single Responsibility Principle**: Tách riêng lớp gọi lệnh (Invoker) khỏi lớp thực thi (Receiver). Remote không cần biết đèn làm gì.
- **Open/Closed Principle**: Thêm thiết bị/lệnh mới (TV, máy lạnh) chỉ cần tạo Command mới, không sửa code remote hiện có.
- **Undo/Redo & Log miễn phí**: Vì mỗi thao tác là object, bạn dễ dàng lưu stack lịch sử, ghi log, hoặc chạy lại (replay).
- **Hàng đợi & truyền qua mạng**: Command có thể serialize, xếp hàng đợi, gửi sang server khác xử lý.

### ❌ Disadvantages (Nhược điểm)
- **Tăng số lượng class**: Mỗi hành động cần một class riêng → code phình to nếu lệnh quá đơn giản (một hàm nhỏ cũng thành một class).
- **Gián tiếp (Indirection)**: Client phải hiểu luồng Invoker → Command → Receiver; với hệ thống nhỏ, việc này là cồng kềnh không cần thiết.

## 4. Diagram

```text
+-----------+   execute()   +---------------+   execute()   +-----------+
|  Invoker  | ------------> |    Command    | ------------> | Receiver  |
|  (Remote) |               | (LightOnCmd)  |               |  (Light)  |
+-----------+               +---------------+               +-----------+
                                  |
                                  | giữ tham chiếu & thao tác trên Receiver
                                  v
                        +-------------------+
                        |  Command History  |
                        | [cmd3, cmd2, cmd1]| --> undo() / redo() / log
                        +-------------------+

Client tạo Command và gắn vào Invoker:
  new Remote(new LightOnCommand(new Light()))
```

## 5. Participants
- **Command** (`Command`): Interface chung khai báo `execute()` (và thường kèm `undo()`).
- **ConcreteCommand** (`LightOnCommand`, `TypeCommand`): Đóng gói một hành động cụ thể, giữ tham chiếu đến Receiver và định nghĩa binding giữa action và receiver.
- **Receiver** (`Light`, `Editor`): Đối tượng "biết cách làm việc thật" — chứa business logic thực sự.
- **Invoker** (`Remote`, `ToolbarButton`): Người ra lệnh/kích hoạt — giữ một Command và gọi `execute()` khi có yêu cầu, không biết gì về Receiver.
- **Client** (`main` code): Tạo ConcreteCommand và gán nó vào Invoker.

## 6. Trong thực tế 2026
Command là xương sống của các hệ thống hiện đại: **Redux/Zustand** coi mọi thay đổi state là một "action object" gửi vào dispatcher — chính là Command thuần; **job queue** như BullMQ, Sidekiq xếp các "task/job" (command serialized) vào Redis để worker xử lý sau, có retry và dead-letter; mọi **editor** (VS Code, Figma, Google Docs) đều dùng command history cho undo/redo; còn **CQRS** trong kiến trúc backend tách hẳn Write-side thành các Command riêng biệt (`CreateOrder`, `CancelOrder`) đi qua command bus trước khi đến handler.
