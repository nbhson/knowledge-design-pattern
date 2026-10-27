# JavaScript Memento Pattern

> **Memento Pattern** (Mẫu lưu trạng thái) chụp lại (snapshot) toàn bộ trạng thái nội tại của một object tại một thời điểm, lưu ra bên ngoài mà **không phá vỡ tính đóng gói (Encapsulation)**. Về sau bạn có thể dùng snapshot đó để **khôi phục (rollback)** object về đúng trạng thái cũ — chính là cơ chế của Undo/Redo.

Nói một cách đời thường: **Ctrl + Z trong Word/Photoshop**. Mỗi lần bạn gõ chữ, ứng dụng lặng lẽ chụp lại "ảnh chụp trạng thái" (snapshot). Bạn bấm Ctrl+Z là quay về ảnh chụp trước đó. Ứng dụng không cần "biết" bên trong document có gì — nó chỉ cầm và giữ những cái ảnh, không quan sát, không sửa.

Hoặc **Game checkpoint**: trước khi vào boss fight, game lưu lại snapshot trạng thái nhân vật (HP, vị trí, items). Chết → load lại checkpoint, chơi lại từ đầu màn chứ không phải chơi lại từ đầu game.

Ba vai trò cốt lõi:
- **Originator**: object "chủ nhân" của trạng thái (vd: TextEditor). Chỉ nó hiểu cấu trúc bên trong của state.
- **Memento**: "viên kẹo" bất biến chứa snapshot trạng thái. Chỉ Originator mới được đọc/ghi toàn bộ nội dung bên trong nó; ngoài ra chỉ xem như một hộp đen (opaque).
- **Caretaker** (`History` / `UndoManager`): giữ danh sách memento, nhưng **không được phép** nhìn vào nội dung bên trong — nó chỉ cất và trả lại.

## 1. Using Memento (Khi nào dùng)
- **Tính năng Undo / Redo**: Editor văn bản, design tool (Figma), bảng tính, IDE — cần quay về trạng thái trước đó bất kỳ lúc nào.
- **Game checkpoint / save game**: Lưu trạng thái nhân vật trước màn boss để có thể "load game".
- **Form draft / autosave**: Người dùng đang điền form dài (đơn xin việc, viết bài), hệ thống tự lưu snapshot mỗi 30s để khôi phục khi trình duyệt crash hoặc bấm nhầm nút Reset.
- **Transaction / rollback trong State Management**: Redux DevTools "Time-travel debugging" — nhảy qua lại giữa các state trước sau — bản chất là một Memento với chuỗi snapshot.
- **Không muốn lộ chi tiết nội tại**: State của Originator chứa nhiều trường private phức tạp; bạn muốn bên ngoài chỉ cầm "hộp đen" chứ không phụ thuộc vào cấu trúc bên trong (nếu không, sau này thêm/sửa field là phải sửa cả code lưu state).

## 2. Implementation Ways

### Cách 1: ES5 Prototype - [dofactory.js](./dofactory.js)
Ví dụ kinh điển: TextEditor với tính năng Undo. Dùng function constructor tạo `TextMemento` (snapshot chứa `content` + `cursorPos`), `TextEditor` (Originator — tự tạo và tự restore từ memento), và `History` (Caretaker — ngăn xếp các memento). Mỗi lần gõ chữ, caretaker push một snapshot; bấm `undo()` thì pop snapshot gần nhất và khôi phục.

### Cách 2: ES6 Class - [es6-class.js](./es6-class.js)
Chuẩn OOP Gang of Four với ví dụ **game checkpoint**: Nhân vật `GameCharacter` (Originator) có HP, vị trí, danh sách item. `SavePoint` (Memento) là class bất biến đóng gói snapshot. `SaveManager` (Caretaker) lưu nhiều checkpoint, cho phép `save()` / `load(index)`. Trận đánh với boss thua → load checkpoint, máu và item trở về như lúc trước khi vào trận.

```js
const hero = new GameCharacter("Kiếm Sĩ", 100, 0, 1);
const save = new SaveManager();

hero.levelUp();          // HP 120, Level 2
save.save(hero);         // Tạo checkpoint

hero.enterBossFight();   // Đánh boss... thua, HP còn 5
hero.restore(save.load(0)); // Quay về checkpoint: HP 120, Level 2
```

## 3. Pros & Cons

### ✅ Advantages (Ưu điểm)
- **Bảo toàn Encapsulation**: Snapshot được Originator tự tạo và tự đọc. Caretaker chỉ giữ hộp đen, không biết (và không cần biết) bên trong có gì → thay đổi cấu trúc state không làm vỡ code của Caretaker.
- **Đơn giản hóa Originator**: Thay vì Originator phải tự quản lý cả lịch sử phiên bản (dẫn tới class phình to), trách nhiệm lưu trữ được giao cho Caretaker — đúng **Single Responsibility Principle**.
- **Snapshot bất biến, an toàn**: Memento nên được thiết kế read-only, không ai sửa được trạng thái quá khứ → tránh side-effect khó debug.

### ❌ Disadvantages (Nhược điểm)
- **Tốn bộ nhớ (RAM)**: Snapshot mỗi lần thao tác một object to (document 50MB, map game khổng lồ) sẽ ngốn memory nhanh chóng. Thực tế phải kết hợp kỹ thuật: giới hạn số snapshot, chụp thưa (throttle), hoặc lưu delta (chỉ phần thay đổi) thay vì full state.
- **Tốn hiệu năng khi tạo snapshot thường xuyên**: Deep-copy trạng thái lớn mỗi keystroke là điều không tưởng.
- **Vi phạm tinh thần "bất biến" dễ dàng trong JS**: JavaScript không có true private field ở cú pháp cũ — bên ngoài vẫn có thể "ngoáy" vào memento nếu cố tình. (ES2022 `#privateField` giúp khắc phục phần nào.)

> 💡 Liên quan SOLID: **Single Responsibility Principle** — lịch sử (Caretaker) tách khỏi trạng thái nghiệp vụ (Originator). Cũng thường đi kèm **Command Pattern**: mỗi Command lưu lại memento trước khi thực thi để hỗ trợ undo.

## 4. Diagram

```
┌─────────────┐    createMemento()     ┌──────────────┐
│  Originator │ ─────────────────────► │   Memento    │
│ (TextEditor)│ ◄───────────────────── │  (Snapshot)  │
│             │    restore(memento)    │  - state     │
│  - state    │                        │  (bất biến)  │
└─────────────┘                        └──────┬───────┘
       ▲                                     │ cất / lấy
       │                                     ▼
       │                              ┌─────────────┐
       └────── thao tác ──────────────│  Caretaker  │
                                      │  (History)  │
                                      │ [m1, m2, m3]│
                                      └─────────────┘
   Caretaker KHÔNG biết nội dung bên trong Memento (hộp đen)
```

## 5. Participants
- **Originator** (`TextEditor`, `GameCharacter`): Object sở hữu trạng thái. Có method `save()`/`createMemento()` để xuất snapshot và `restore()`/`undo()` để khôi phục từ snapshot. Là nơi DUY NHẤT được phép chạm vào nội dung bên trong memento.
- **Memento** (`TextMemento`, `SavePoint`): Hộp chứa bất biến của snapshot trạng thái. Thường không để lộ setter — chỉ Originator mới hiểu cấu trúc của nó.
- **Caretaker** (`History`, `SaveManager`, `UndoManager`): Quản lý danh sách/ngăn xếp các memento (push, pop, load theo index). Hoàn toàn không đọc/ghi nội dung bên trong.

## 6. Trong thực tế 2026
Memento là xương sống của mọi tính năng "quay lui" mà bạn dùng hằng ngày. **Redux DevTools Time-travel**: mỗi action dispatch tạo ra một state object mới (immutable) — chuỗi các state đó chính là chuỗi memento, cho phép bạn tua ngược giao diện về bất kỳ thời điểm nào. **Figma / Google Docs / Notion** dùng version history + autosave snapshot theo chu kỳ để khôi phục document sau sự cố hoặc cho phép "Version History" xem lại bản cũ. Trong game engine (Unity, Godot, Phaser), **checkpoint & save-state** là memento kinh điển — nhiều game roguelike còn lưu cả chuỗi input (replay) làm "memento siêu gọn". Với form lớn trên web, thư viện **autosave draft** (localStorage + JSON snapshot mỗi N giây, khôi phục khi reopen tab) là memento ở tầng ứng dụng. Cuối cùng, trong transactional data layer (vd: các thư viện CRDT như Yjs powering collaborative editing), snapshot + delta log chính là memento mở rộng cho nhiều người dùng cùng chỉnh sửa một lúc.
