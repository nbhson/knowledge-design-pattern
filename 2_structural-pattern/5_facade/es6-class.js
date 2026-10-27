// --- KỊCH BẢN: ĐĂNG KÝ VAY THẾ CHẤP (MORTGAGE) ---

// 1. Phân hệ con (Subsystem): Ngân hàng kiểm tra tài khoản
class Bank {
    verify(name, amount) {
        console.log(`Kiểm tra tài khoản ngân hàng của ${name}...`);
        // Logic phức tạp...
        return true; // Giả sử đủ điều kiện
    }
}

// 2. Phân hệ con (Subsystem): Đơn vị kiểm tra nợ xấu (Credit)
class Credit {
    get(name) {
        console.log(`Kiểm tra tín dụng/nợ xấu của ${name}...`);
        // Logic phức tạp...
        return true; // Điểm tín dụng tốt
    }
}

// 3. Phân hệ con (Subsystem): Cảnh sát/Hành pháp kiểm tra lý lịch
class Background {
    check(name) {
        console.log(`Kiểm tra tiền án tiền sự của ${name}...`);
        // Logic phức tạp...
        return true; // Hồ sơ trong sạch
    }
}

// --- LỚP FACADE (MẶT TIỀN) ---
// Thay vì để Client phải tự gọi 3 class trên, Facade gom chúng lại thành 1 hàm duy nhất.
class MortgageFacade {
    constructor(name) {
        this.name = name;
    }

    // Hàm "Mặt tiền" cung cấp cho Client
    applyFor(amount) {
        console.log(`\n=== Bắt đầu xử lý hồ sơ vay ${amount} cho ${this.name} ===`);

        // Gọi các Subsystem ẩn bên dưới
        const isBankOk = new Bank().verify(this.name, amount);
        const isCreditOk = new Credit().get(this.name);
        const isBackgroundOk = new Background().check(this.name);

        let result = "ĐƯỢC DUYỆT (Approved)";
        if (!isBankOk || !isCreditOk || !isBackgroundOk) {
            result = "BỊ TỪ CHỐI (Denied)";
        }

        return `=> Kết quả hồ sơ vay ${amount} của ${this.name}: ${result}\n`;
    }
}

// --- CLIENT DÙNG FACADE ---
// Client KHÔNG CẦN quan tâm đến Bank, Credit hay Background hoạt động thế nào.
const mortgage = new MortgageFacade("Joan Templeton");
const result = mortgage.applyFor("$100,000");

console.log(result);
