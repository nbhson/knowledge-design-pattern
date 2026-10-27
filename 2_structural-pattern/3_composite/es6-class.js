// ES6 Class Implementation - Composite Pattern
// Đơn hàng: OrderBox (Composite) chứa Product (Leaf) và cả OrderBox con (combo).

// 1. Component - interface chung cho mọi node trong cây
class OrderComponent {
  add(component) {
    throw new Error("Leaf không hỗ trợ add()");
  }
  getTotal() {
    throw new Error("Phải cài đặt method getTotal()");
  }
}

// 2. Leaf - node lá: sản phẩm đơn lẻ
class Product extends OrderComponent {
  constructor(name, price) {
    super();
    this.name = name;
    this.price = price;
  }
  getTotal() {
    return this.price;
  }
}

// 3. Composite - node cha: chứa các node con (Product hoặc OrderBox khác)
class OrderBox extends OrderComponent {
  constructor(name) {
    super();
    this.name = name;
    this.children = [];
  }

  // Composite quản lý node con
  add(component) {
    this.children.push(component);
    return this; // hỗ trợ method chaining
  }

  remove(component) {
    const index = this.children.indexOf(component);
    if (index !== -1) this.children.splice(index, 1);
  }

  // Đệ quy: cộng dồn tổng qua toàn bộ cây con
  getTotal() {
    return this.children.reduce((sum, child) => sum + child.getTotal(), 0);
  }
}

// --- Client Code ---

// Đơn hàng gốc
const order = new OrderBox("Đơn hàng #1001");
order.add(new Product("Bàn phím", 1500000));
order.add(new Product("Chuột", 450000));

// Combo con - bản thân nó cũng là một node trong cây
const combo = new OrderBox("Combo quà tặng");
combo.add(new Product("Balo", 300000));
combo.add(new Product("Bàn di chuột", 80000));
order.add(combo);

// Client chỉ cần gọi getTotal() trên node gốc,
// không cần biết bên trong có bao nhiêu cấp lồng nhau
console.log(`Tổng đơn hàng: ${order.getTotal().toLocaleString("vi-VN")}đ`); // 2330000đ
console.log(`Tổng combo: ${combo.getTotal().toLocaleString("vi-VN")}đ`); // 380000đ
console.log(`Số sản phẩm đơn lẻ: ${combo.children.length}`); // 2
