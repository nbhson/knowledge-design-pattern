// ES6: Template Method Pattern với ES6 Class
// Ví dụ: Data Processing Pipeline - CI/CD build tương tự như build tool
// Mỗi pipeline con (User, Product, Order) kế thừa khung chung:
// fetchData() → processData() [override được] → saveData()
// Thứ tự 3 bước cố định, chỉ bước giữa là khác nhau giữa các subclass.

// --- AbstractClass: DataPipeline (Class cha định nghĩa khung) ---
class DataPipeline {
    run(inputData) {
        // Template Method: điều phối đúng thứ tự, không cho phép thay đổi
        console.log(`[Pipeline] Bắt đầu pipeline: ${this.constructor.name}`);
        const fetched = this.fetchData(inputData);
        const processed = this.processData(fetched);
        const saved = this.saveData(processed);
        console.log(`[Pipeline] Xong: ${saved} records saved\n`);
        return saved;
    }

    // Các bước chung
    fetchData(inputData) {
        console.log(`  [${this.constructor.name}] Fetch: Lấy dữ liệu từ source...`);
        return inputData; // giả lập
    }

    saveData(result) {
        console.log(`  [${this.constructor.name}] Save: Lưu ${result} records vào DB`);
        return result;
    }

    // Bước trừu tượng - subclass BẮT BUỘC override
    processData(data) {
        throw new Error("Subclass phải triển khai processData()");
    }
}

// --- ConcreteClass: UserExportPipeline ---
class UserExportPipeline extends DataPipeline {
    processData(data) {
        console.log(`  [UserExport] Transform: mapping fields, uppercase name`);
        const mapped = data.map(u => ({ id: u.id, name: u.name.toUpperCase() }));
        console.log(`  [UserExport] Kết quả: ${JSON.stringify(mapped)}`);
        return data.length; // số records đã xử lý
    }
}

// --- ConcreteClass: ProductPipeline ---
class ProductInventoryPipeline extends DataPipeline {
    processData(data) {
        console.log(`  [ProductInventory] Transform: tính tổng tồn kho`);
        const totalStock = data.reduce((sum, p) => sum + p.stock, 0);
        console.log(`  [ProductInventory] Tổng tồn kho: ${totalStock}`);
        return data.length; // số records đã xử lý
    }
}

// --- ConcreteClass: OrderAggregationPipeline ---
class OrderAggregationPipeline extends DataPipeline {
    processData(data) {
        console.log(`  [OrderAggregation] Transform: gom nhóm theo user_id, tính tổng tiền`);
        const summary = {};
        data.forEach(order => {
            if (!summary[order.user_id]) summary[order.user_id] = 0;
            summary[order.user_id] += order.amount;
        });
        console.log(`  [OrderAggregation] Đơn theo user: ${JSON.stringify(summary)}`);
        return Object.keys(summary).length; // số user có đơn
    }
}

// --- Client Code ---
console.log("--- ES6 Template Method: Data Processing Pipeline ---");

const users = [
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Trần Thị B" },
];

const products = [
    { id: 1, name: "Laptop", stock: 10 },
    { id: 2, name: "Mouse", stock: 50 },
    { id: 3, name: "Keyboard", stock: 25 },
];

const orders = [
    { user_id: 1, amount: 100 },
    { user_id: 1, amount: 50 },
    { user_id: 2, amount: 75 },
];

new UserExportPipeline().run(users);
new ProductInventoryPipeline().run(products);
new OrderAggregationPipeline().run(orders);

console.log("📌 Lưu ý: Dù là pipeline nào, thứ tự ba bước");
console.log("   fetchData() → processData() → saveData()");
console.log("   LUÔN được đảm bảo đúng trật tự.");
