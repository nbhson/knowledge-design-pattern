// ES6: Class-based Mediator Pattern (Gang of Four chuẩn)
// Ví dụ: Tháp điều không (Air Traffic Control) làm trung gian điều phối máy bay

// --- Mediator ---
class AirTrafficControlTower {
    constructor() {
        this.registeredPlanes = []; // danh sách máy bay đang liên lạc
        this.runwayBusy = false;    // trạng thái đường băng
    }

    // Colleague đăng ký vào tháp điều
    registerPlane(plane) {
        this.registeredPlanes.push(plane);
        console.log(`[Tower] ${plane.callsign} đã vào vùng kiểm soát.`);
    }

    // Máy bay xin hạ cánh — tháp điều phê duyệt hoặc yêu cầu chờ
    requestLanding(plane) {
        if (this.runwayBusy) {
            console.log(`[Tower] ✋ ${plane.callsign}, đường băng đang bận. Vui lòng chờ (hold).`);
            return;
        }

        this.runwayBusy = true;
        console.log(`[Tower] ✅ ${plane.callsign} được phép hạ cánh.`);
        this.notifyOthers(plane, `${plane.callsign} đang hạ cánh, mọi máy bay giữ khoảng cách!`);
    }

    // Máy bay báo đã hoàn tất — giải phóng đường băng
    notifyLanded(plane) {
        this.runwayBusy = false;
        console.log(`[Tower] ${plane.callsign} đã hạ cánh xong. Đường băng trống.`);
        this.notifyOthers(plane, `${plane.callsign} đã rời đường băng.`);
    }

    // Mediator chủ động bắn thông báo tới tất cả máy bay KHÁC
    notifyOthers(sender, message) {
        this.registeredPlanes
            .filter((p) => p !== sender)
            .forEach((p) => p.receiveNotification(message));
    }
}

// --- Colleague (Airplane) ---
// Máy bay KHÔNG biết sự tồn tại của máy bay khác, chỉ biết tháp điều
class Airplane {
    constructor(callsign, tower) {
        this.callsign = callsign;
        this.tower = tower;
    }

    requestLanding() {
        console.log(`\n[${this.callsign}] → Tower: Xin phép hạ cánh.`);
        this.tower.requestLanding(this);
    }

    notifyLanded() {
        console.log(`\n[${this.callsign}] → Tower: Đã hạ cánh an toàn.`);
        this.tower.notifyLanded(this);
    }

    receiveNotification(message) {
        console.log(`  ← [${this.callsign}] nhận thông báo: "${message}"`);
    }
}

// --- Client Code ---

console.log("=== ES6 Mediator Pattern: Air Traffic Control ===\n");

const tower = new AirTrafficControlTower();

const vn150 = new Airplane("VietnamAirlines-150", tower);
const jets902 = new Airplane("Jetstar-902", tower);

tower.registerPlane(vn150);
tower.registerPlane(jets902);

// VN150 xin hạ cánh → được duyệt, Jetstar nhận cảnh báo giữ khoảng cách
vn150.requestLanding();

// Jetstar cũng xin hạ cánh → bị từ chối vì đường băng đang bận
jets902.requestLanding();

// VN150 hoàn tất → đường băng trống, Jetstar nhận thông báo
vn150.notifyLanded();
