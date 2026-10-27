// ES6: Class-based Visitor Pattern (Gang of Four chuẩn)
// Ví dụ: Giỏ hàng với 3 loại sản phẩm + 2 visitor (tính tiền, xuất JSON)
// Thêm operation mới = viết class Visitor mới, KHÔNG sửa class sản phẩm

// --- Elements (CartItem) ---
class CartItem {
    accept(visitor) {
        throw new Error("Phải override accept() trong class con");
    }
}

class Book extends CartItem {
    constructor(name, price, author) {
        super();
        this.name = name;
        this.price = price;
        this.author = author;
    }

    accept(visitor) {
        visitor.visitBook(this);
    }
}

class Electronics extends CartItem {
    constructor(name, price, warrantyMonths) {
        super();
        this.name = name;
        this.price = price;
        this.warrantyMonths = warrantyMonths;
    }

    accept(visitor) {
        visitor.visitElectronics(this);
    }
}

class Fruit extends CartItem {
    constructor(name, price, kg) {
        super();
        this.name = name;
        this.price = price;
        this.kg = kg;
    }

    accept(visitor) {
        visitor.visitFruit(this);
    }
}

// --- Visitor Interface (thuần JS: class định nghĩa các method visitXxx) ---
// Mỗi Visitor mới = một class con implement đủ visitXxx

class PriceCalculatorVisitor {
    constructor() {
        this.total = 0;
        this.taxRate = 0.08; // thuế VAT 8%
    }

    visitBook(item) {
        const amount = item.price;
        console.log(`[PriceCalc] 📚 "${item.name}" — ${amount}K`);
        this.total += amount;
    }

    visitElectronics(item) {
        const amount = item.price * 1.1; // điện tử + 10% phí bảo hành
        console.log(`[PriceCalc] 🔌 "${item.name}" — ${amount.toFixed(1)}K (gồm phí BH)`);
        this.total += amount;
    }

    visitFruit(item) {
        const amount = item.price * item.kg;
        console.log(`[PriceCalc] 🍎 "${item.name}" — ${amount}K (${item.price}K x ${item.kg}kg)`);
        this.total += amount;
    }

    getTotal() {
        const tax = this.total * this.taxRate;
        console.log(`\n→ Tổng phụ: ${this.total.toFixed(1)}K | Thuế VAT 8%: ${tax.toFixed(1)}K | TỔNG CỘNG: ${(this.total + tax).toFixed(1)}K`);
    }
}

class JsonExportVisitor {
    constructor() {
        this.items = [];
    }

    visitBook(item) {
        this.items.push({ type: "book", name: item.name, price: item.price, author: item.author });
    }

    visitElectronics(item) {
        this.items.push({ type: "electronics", name: item.name, price: item.price, warrantyMonths: item.warrantyMonths });
    }

    visitFruit(item) {
        this.items.push({ type: "fruit", name: item.name, pricePerKg: item.price, kg: item.kg, total: item.price * item.kg });
    }

    getJson() {
        return JSON.stringify({ cart: this.items }, null, 2);
    }
}

// --- Client Code ---

console.log("=== ES6 Visitor Pattern: Giỏ hàng xuất báo cáo ===\n");

// ObjectStructure: mảng các CartItem (cấu trúc ổn định, KHÔNG thay đổi khi thêm visitor)
const cart = [
    new Book("Clean Code", 400, "Robert C. Martin"),
    new Electronics("Tai nghe Sony WH-1000XM5", 1200, 24),
    new Fruit("Táo Mỹ", 45, 2.5),
    new Book("The Pragmatic Programmer", 520, "David Thomas"),
];

// Operation 1: tính tổng tiền + thuế VAT
const calculator = new PriceCalculatorVisitor();
cart.forEach((item) => item.accept(calculator));
calculator.getTotal();

// Operation 2: xuất JSON — thêm operation mới mà KHÔNG sửa Book/Electronics/Fruit
console.log("\n--- Xuất JSON ---");
const exporter = new JsonExportVisitor();
cart.forEach((item) => item.accept(exporter));
console.log(exporter.getJson());