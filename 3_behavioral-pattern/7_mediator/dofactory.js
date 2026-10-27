// ES5: Classic Mediator Pattern — Chatroom làm trung gian
// Nhiều User giao tiếp với nhau, KHÔNG biết về nhau, chỉ biết Chatroom

// --- Mediator ---
function ChatRoom() {
    this.userLog = []; // danh sách tất cả user đã đăng ký
}

ChatRoom.prototype = {
    // Colleague đăng ký vào hệ thống
    register: function (user) {
        this.userLog.push(user);
        console.log(`[ChatRoom] ${user.name} đã tham gia phòng chat.`);
    },

    // Gửi tin nhắn: Mediator nhận tin rồi chuyển tiếp đến TẤT CẢ colleague TRỪ người gửi
    sendMessage: function (message, fromUser) {
        var self = this;
        console.log(`\n[ChatRoom] Tin nhắn từ "${fromUser.name}": "${message}"`);
        console.log("[ChatRoom] Chuyển tiếp tới:");

        this.userLog.forEach(function (user) {
            // Bỏ qua người gửi
            if (user !== fromUser) {
                user.receive(message, fromUser.name);
            }
        });
    },
};

// --- Colleague (User) ---
// Mỗi User KHÔNG giữ reference tới bất kỳ user nào khác
// Chỉ giữ reference tới Mediator
function User(name, chatroom) {
    this.name = name;
    this.chatroom = chatroom;
}

User.prototype = {
    // Gửi tin: ủy quyền cho mediator
    send: function (message) {
        console.log(`[${this.name}] Gửi: "${message}"`);
        this.chatroom.sendMessage(message, this);
    },

    // Nhận tin do mediator bắn tới
    receive: function (message, fromName) {
        console.log(`  → [${this.name}] nhận được từ ${fromName}: "${message}"`);
    },
};

// --- Client Code ---

console.log("=== ES5 Mediator Pattern: Chatroom ===\n");

var chatroom = new ChatRoom();

var alice = new User("Alice", chatroom);
var bob = new User("Bob", chatroom);
var charlie = new User("Charlie", chatroom);

// Đăng ký tất cả user vào Chatroom (mediator)
chatroom.register(alice);
chatroom.register(bob);
chatroom.register(charlie);

// Alice gửi tin — Bob và Charlie nhận được, Alice KHÔNG nhận lại
alice.send("Chào mọi người! Mình là Alice.");
