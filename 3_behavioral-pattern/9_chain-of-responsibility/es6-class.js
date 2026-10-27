// ES6: Class-based Chain of Responsibility (Gang of Four chuẩn)
// Ví dụ: Middleware pipeline xử lý HTTP request (giống Express)

// --- Base Handler: chứa sẵn logic nối chuỗi và chuyển tiếp ---
class Middleware {
    constructor(name) {
        this.name = name;
        this.next = null;
    }

    // Nối handler kế tiếp (trả về handler đó để nối chuỗi liên tục)
    setNext(middleware) {
        this.next = middleware;
        return middleware;
    }

    // Template: gọi doHandle() của class con;
    // nếu class con trả về true (cho phép đi tiếp) thì chuyền sang next
    handle(request) {
        const allowed = this.doHandle(request);
        if (allowed && this.next) {
            return this.next.handle(request);
        }
        return allowed;
    }

    // Class con bắt buộc override
    doHandle(request) {
        throw new Error("Phải implement doHandle() trong class con");
    }
}

// --- Concrete Handler 1: kiểm tra đăng nhập ---
class AuthMiddleware extends Middleware {
    constructor() {
        super("Auth");
    }

    doHandle(request) {
        if (!request.user) {
            console.log(`[${this.name}] ❌ Chưa đăng nhập — chặn request!`);
            return false; // dừng chuỗi, không đi tiếp
        }
        console.log(`[${this.name}] ✅ User "${request.user}" đã xác thực.`);
        return true; // cho đi tiếp
    }
}

// --- Concrete Handler 2: giới hạn tần suất gọi API ---
class RateLimitMiddleware extends Middleware {
    constructor(maxPerMinute = 3) {
        super("RateLimit");
        this.max = maxPerMinute;
        this.count = 0;
    }

    doHandle(request) {
        this.count += 1;
        if (this.count > this.max) {
            console.log(`[${this.name}] ⛔ Vượt giới hạn ${this.max} req/phút — trả về 429!`);
            return false;
        }
        console.log(`[${this.name}] ✅ Request thứ ${this.count}/${this.max} trong phút này.`);
        return true;
    }
}

// --- Concrete Handler 3: ghi log (không bao giờ chặn) ---
class LoggingMiddleware extends Middleware {
    constructor() {
        super("Logging");
    }

    doHandle(request) {
        console.log(`[${this.name}] 📝 ${new Date().toISOString()} — ${request.method} ${request.path} (user: ${request.user})`);
        return true;
    }
}

// --- Concrete Handler cuối: controller xử lý business ---
class OrderController extends Middleware {
    doHandle(request) {
        console.log(`[OrderController] 🛒 Xử lý ${request.method} ${request.path} → trả về danh sách đơn hàng.`);
        return true;
    }
}

// --- Client Code ---

console.log("=== ES6 Chain of Responsibility: Middleware Pipeline ===\n");

// Nối chuỗi: Auth → RateLimit → Logging → Controller
// (giống app.use(auth).use(rateLimit).use(logger).use(controller))
const chain = new AuthMiddleware();
chain
    .setNext(new RateLimitMiddleware(3))
    .setNext(new LoggingMiddleware())
    .setNext(new OrderController());

// Request hợp lệ → đi qua cả chuỗi tới controller
console.log("--- Request 1: user đã đăng nhập ---");
chain.handle({ user: "son", method: "GET", path: "/api/orders" });

// Request thiếu user → bị AuthMiddleware chặn ngay, không tới các middleware sau
console.log("\n--- Request 2: chưa đăng nhập ---");
chain.handle({ method: "GET", path: "/api/orders" });
