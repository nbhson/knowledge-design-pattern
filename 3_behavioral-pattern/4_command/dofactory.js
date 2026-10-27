// ES5: Classic Command Pattern (Gang of Four chuẩn)
// Ví dụ: Remote điều khiển đa năng - mỗi nút gắn một "lệnh" (Command)
// Remote (Invoker) không biết đèn/quạt hoạt động thế nào, nó chỉ gọi execute()

// --- Receiver: đối tượng biết cách làm việc thật ---
function Light(name) {
    this.name = name;
}

Light.prototype.on = function () {
    console.log(this.name + ": ĐÈN BẬT 💡");
};

Light.prototype.off = function () {
    console.log(this.name + ": đèn tắt");
};

function Fan(name) {
    this.name = name;
}

Fan.prototype.start = function () {
    console.log(this.name + ": QUẠT CHẠY 🌀");
};

Fan.prototype.stop = function () {
    console.log(this.name + ": quạt dừng");
};

// --- Command: interface chung là execute() / undo() ---
// Lệnh BẬT đèn. Khi undo thì... tắt đèn.
function LightOnCommand(light) {
    this.light = light;
}
LightOnCommand.prototype.execute = function () {
    this.light.on();
};
LightOnCommand.prototype.undo = function () {
    this.light.off();
};

// Lệnh TẮT đèn. Khi undo thì bật lại.
function LightOffCommand(light) {
    this.light = light;
}
LightOffCommand.prototype.execute = function () {
    this.light.off();
};
LightOffCommand.prototype.undo = function () {
    this.light.on();
};

// Lệnh khởi động quạt
function FanStartCommand(fan) {
    this.fan = fan;
}
FanStartCommand.prototype.execute = function () {
    this.fan.start();
};
FanStartCommand.prototype.undo = function () {
    this.fan.stop();
};

// --- Invoker: người ra lệnh, chỉ cầm Command và gọi execute() ---
function Remote() {
    this.commands = {};   // các slot nút bấm
    this.history = [];    // lịch sử để undo
}

Remote.prototype.setCommand = function (slot, command) {
    this.commands[slot] = command;
};

Remote.prototype.press = function (slot) {
    var command = this.commands[slot];
    if (!command) {
        console.log("Chưa gắn lệnh cho nút " + slot);
        return;
    }
    command.execute();
    this.history.push(command); // lưu lại để hoàn tác
};

Remote.prototype.undo = function () {
    var command = this.history.pop();
    if (command) {
        console.log("(undo lệnh gần nhất)");
        command.undo();
    } else {
        console.log("Không còn lệnh nào để undo");
    }
};

// --- Client Code ---
console.log("--- ES5 Command Pattern: Remote điều khiển ---");

var livingRoomLight = new Light("Đèn phòng khách");
var ceilingFan = new Fan("Quạt trần");

var remote = new Remote();

// Gắn lệnh vào các nút remote
remote.setCommand(1, new LightOnCommand(livingRoomLight));
remote.setCommand(2, new LightOffCommand(livingRoomLight));
remote.setCommand(3, new FanStartCommand(ceilingFan));

// Bấm nút như người dùng thật
remote.press(1); // Đèn phòng khách: ĐÈN BẬT 💡
remote.press(3); // Quạt trần: QUẠT CHẠY 🌀
remote.press(2); // Đèn phòng khách: đèn tắt

// Hoàn tác lần lượt: undo lệnh tắt đèn -> bật lại đèn
remote.undo(); // (undo lệnh gần nhất) Đèn phòng khách: ĐÈN BẬT 💡
remote.undo(); // undo lệnh chạy quạt -> quạt dừng
remote.undo(); // undo lệnh bật đèn -> đèn tắt
remote.undo(); // Không còn lệnh nào để undo
