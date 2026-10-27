// ES6: State Pattern với ES6 Class
// Ví dụ: Vòng đời đơn hàng thương mại điện tử (giống XState viết tay)
// PendingState -> ShippedState -> DeliveredState
// (có thể hủy khi đang Pending, KHÔNG thể hủy khi đã Delivered)

// --- Base State: interface chung cho mọi trạng thái ---
class OrderState {
    constructor(order) {
        this.order = order;
    }
    ship() {
        console.log("✗ Không thể giao hàng ở trạng thái hiện tại");
    }
    deliver() {
        console.log("✗ Chưa thể xác nhận đã nhận hàng ở trạng thái hiện tại");
    }
    cancel() {
        console.log("✗ Không thể hủy đơn ở trạng thái hiện tại");
    }
    get label() {
        return this.constructor.name;
    }
}

// --- ConcreteState 1: Chờ xử lý ---
class PendingState extends OrderState {
    ship() {
        console.log("🚚 Đóng gói và bàn giao cho đơn vị vận chuyển...");
        this.order.setState(new ShippedState(this.order));
    }
    cancel() {
        console.log("🗑  Đơn đã được hủy, hoàn tiền cho khách.");
        this.order.setState(new CancelledState(this.order));
    }
}

// --- ConcreteState 2: Đang giao ---
class ShippedState extends OrderState {
    deliver() {
        console.log("📬 Khách xác nhận đã nhận hàng. Đơn hoàn tất!");
        this.order.setState(new DeliveredState(this.order));
    }
    cancel() {
        console.log("✗ Đang giao rồi, không hủy được (liên hệ CSKH).");
    }
}

// --- ConcreteState 3: Đã giao ---
class DeliveredState extends OrderState {
    // Không override gì -> kế thừa hành vi mặc định "báo lỗi" từ base
}

// --- ConcreteState 4: Đã hủy ---
class CancelledState extends OrderState {
    // Trạng thái kết thúc: mọi action đều bị từ chối
}

// --- Context: Đơn hàng ---
class Order {
    constructor(id) {
        this.id = id;
        this.state = new PendingState(this);
        console.log(`Đơn #${id} được tạo. -> Trạng thái: ${this.state.label}`);
    }
    setState(state) {
        this.state = state;
        console.log(`   -> Trạng thái: ${state.label}`);
    }
    ship() { this.state.ship(); }
    deliver() { this.state.deliver(); }
    cancel() { this.state.cancel(); }
}

// --- Client Code ---
console.log("--- ES6 State Pattern: Vòng đời đơn hàng ---");

const order = new Order("A101");

console.log("\n[Thử] Giao hàng ngay khi chưa ship:");
order.deliver(); // bị từ chối

console.log("\n[Khách đổi ý] Hủy đơn rồi ship lại:");
order.cancel();
order.ship(); // đơn đã hủy, không ship được

console.log("\n[Đơn mới] Quy trình chuẩn:");
const order2 = new Order("A102");
order2.ship();
order2.deliver();
order2.cancel(); // đã delivered -> không hủy được

console.log(`\nTrạng thái cuối của #A102: ${order2.state.label}`);
