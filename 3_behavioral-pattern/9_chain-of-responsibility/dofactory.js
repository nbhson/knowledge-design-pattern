// ES5: Classic Chain of Responsibility — Hệ thống support 3 cấp (Tier 1 → 2 → 3)

// --- Handler cơ bản: giữ tham chiếu tới handler kế tiếp ---
function SupportHandler(name, level) {
    this.name = name;
    this.level = level;   // cấp trách nhiệm: 1, 2, 3
    this.nextHandler = null;
}

SupportHandler.prototype = {
    // Nối handler này với handler kế tiếp trong chuỗi
    setNext: function (nextHandler) {
        this.nextHandler = nextHandler;
        return nextHandler; // cho phép nối chuỗi: a.setNext(b).setNext(c)
    },

    // Nhận request: đúng cấp thì xử lý, sai thì chuyền tiếp
    handleRequest: function (ticket) {
        if (ticket.level === this.level) {
            console.log(`[${this.name}] ✅ Đã xử lý ticket #${ticket.id} ("${ticket.description}")`);
            return true;
        }

        // Không phải trách nhiệm của mình → chuyền tiếp xuống handler sau
        if (this.nextHandler) {
            console.log(`[Tier ${this.level}] Chuyển ticket #${ticket.id} lên cấp ${ticket.level}...`);
            return this.nextHandler.handleRequest(ticket);
        }

        // Hết chuỗi mà không ai xử lý — cảnh báo "rơi tự do"
        console.log(`⚠️ Ticket #${ticket.id} không có handler nào xử lý!`);
        return false;
    },
};

// --- Client Code ---

console.log("=== ES5 Chain of Responsibility: Support Tiers ===\n");

// Tạo chuỗi: Tier 1 → Tier 2 → Tier 3
var tier1 = new SupportHandler("Tier 1 - Nhân viên CSKH", 1);
var tier2 = new SupportHandler("Tier 2 - Kỹ thuật viên", 2);
var tier3 = new SupportHandler("Tier 3 - Kỹ sư cao cấp", 3);

tier1.setNext(tier2);
tier2.setNext(tier3);

// Ticket đơn giản → Tier 1 tự xử lý
var ticketA = { id: 101, level: 1, description: "Quên mật khẩu" };
tier1.handleRequest(ticketA);

// Ticket vừa → Tier 1 chuyền, Tier 2 xử lý
var ticketB = { id: 102, level: 2, description: "Lỗi sync dữ liệu giữa 2 máy" };
tier1.handleRequest(ticketB);

// Ticket khó → đi qua cả Tier 1 và Tier 2, Tier 3 mới xử lý được
var ticketC = { id: 103, level: 3, description: "Bug race-condition trong message queue" };
tier1.handleRequest(ticketC);

// Ticket ngoài tầm → không ai xử lý
var ticketD = { id: 104, level: 4, description: "Đòi gặp CEO" };
tier1.handleRequest(ticketD);
