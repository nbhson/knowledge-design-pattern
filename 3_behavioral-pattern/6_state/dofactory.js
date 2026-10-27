// ES5: Classic State Pattern (Gang of Four chuẩn)
// Ví dụ: Máy bán nước tự động - hành vi thay đổi theo trạng thái nội tại

// --- Context: máy bán nước ---
function VendingMachine() {
    this.noCoinState = new NoCoinState(this);
    this.hasCoinState = new HasCoinState(this);
    this.soldOutState = new SoldOutState(this);

    this.count = 2;              // số chai nước còn lại
    this.state = this.noCoinState; // bắt đầu: chưa có xu
}

// Context ủy quyền mọi hành vi cho state hiện tại
VendingMachine.prototype.insertCoin = function () {
    this.state.insertCoin();
};
VendingMachine.prototype.ejectCoin = function () {
    this.state.ejectCoin();
};
VendingMachine.prototype.pressButton = function () {
    this.state.dispense();
};
VendingMachine.prototype.setState = function (state) {
    this.state = state;
};

// --- State 1: Chưa có xu ---
function NoCoinState(machine) {
    this.machine = machine;
}
NoCoinState.prototype.insertCoin = function () {
    console.log(">> Nhận xu. Mời bấm chọn nước!");
    this.machine.setState(this.machine.hasCoinState);
};
NoCoinState.prototype.ejectCoin = function () {
    console.log(">> Chưa có xu thì không có gì để trả.");
};
NoCoinState.prototype.dispense = function () {
    console.log(">> Mời bỏ xu vào trước!");
};

// --- State 2: Đã có xu ---
function HasCoinState(machine) {
    this.machine = machine;
}
HasCoinState.prototype.insertCoin = function () {
    console.log(">> Đã có xu rồi, hãy bấm chọn nước!");
};
HasCoinState.prototype.ejectCoin = function () {
    console.log(">> Trả lại xu cho bạn.");
    this.machine.setState(this.machine.noCoinState);
};
HasCoinState.prototype.dispense = function () {
    console.log(">> Đang xả nước...");
    this.machine.count--;
    if (this.machine.count > 0) {
        console.log(">> Nước ra rồi. Mời lấy!");
        this.machine.setState(this.machine.noCoinState);
    } else {
        console.log(">> HẾT HÀNG! Đây là chai cuối cùng.");
        this.machine.setState(this.machine.soldOutState);
    }
};

// --- State 3: Hết hàng ---
function SoldOutState(machine) {
    this.machine = machine;
}
SoldOutState.prototype.insertCoin = function () {
    console.log(">> Hết nước. Tiền trả lại cho bạn.");
};
SoldOutState.prototype.ejectCoin = function () {
    console.log(">> Bạn chưa bỏ xu, không có gì để trả.");
};
SoldOutState.prototype.dispense = function () {
    console.log(">> Hết hàng! Không xả được.");
};

// --- Client Code ---
console.log("--- ES5 State Pattern: Máy bán nước ---");
console.log("Máy bắt đầu với", 2, "chai nước.\n");

var machine = new VendingMachine();

console.log("=== Khách 1: Bấm nút chưa bỏ xu ===");
machine.pressButton();

console.log("\n=== Khách 2: Bỏ xu rồi bấm nút ===");
machine.insertCoin(); // chuyển sang HasCoinState
machine.pressButton(); // xả nước, về NoCoinState
console.log("Còn", machine.count, "chai");

console.log("\n=== Khách 3: Bỏ xu rồi đổi ý, lấy lại xu ===");
machine.insertCoin(); // vào HasCoinState
machine.ejectCoin();  // trả xu, về NoCoinState

console.log("\n=== Khách 4: Mua chai cuối cùng ===");
machine.insertCoin();
machine.pressButton(); // hết hàng -> SoldOutState
console.log("Còn", machine.count, "chai");

console.log("\n=== Khách 5: Máy hết hàng, cố bỏ xu ===");
machine.insertCoin(); // bị từ chối
machine.pressButton(); // không xả được
