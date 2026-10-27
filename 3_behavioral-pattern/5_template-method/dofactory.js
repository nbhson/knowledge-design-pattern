// ES5: Classic Template Method Pattern
// Ví dụ: Quy trình pha chế đồ uống - Beverages (Coffee, Tea)
// Class cha Beverage định nghĩa KHUNG quy trình prepareRecipe() cố định,
// subclass chỉ override các bước nhỏ bên trong.

// --- AbstractClass: định nghĩa khung thuật toán ---
function Beverage() {}

Beverage.prototype.prepareRecipe = function () {
    // Template Method: KHÔNG cho phép subclass override toàn bộ,
    // chỉ override các bước nhỏ bên dưới.
    this.boilWater();
    this.brew();
    this.pourInCup();
    this.addCondiments();
};

// Các bước chung (mọi đồ uống đều cần)
Beverage.prototype.boilWater = function () {
    console.log("1. Đun sôi nước");
};

Beverage.prototype.pourInCup = function () {
    console.log("3. Rót ra ly");
};

// Các bước "primitive" (mặc định trống) - subclass PHẢI override
Beverage.prototype.brew = function () {
    throw new Error("Subclass phải triển khai brew()");
};
Beverage.prototype.addCondiments = function () {
    throw new Error("Subclass phải triển khai addCondiments()");
};

// --- ConcreteClass A: Cà phê ---
function Coffee() {}

Coffee.prototype = Object.create(Beverage.prototype);
Coffee.prototype.constructor = Coffee;

Coffee.prototype.brew = function () {
    console.log("2a. Chiết xuất cà phê bằng nước sôi");
};

Coffee.prototype.addCondiments = function () {
    console.log("4a. Thêm đường và sữa");
};

// --- ConcreteClass B: Trà ---
function Tea() {}

Tea.prototype = Object.create(Beverage.prototype);
Tea.prototype.constructor = Tea;

Tea.prototype.brew = function () {
    console.log("2b. Ngâm lá trà trong nước sôi");
};

Tea.prototype.addCondiments = function () {
    console.log("4b. Thêm chanh");
};

// --- Client Code ---
console.log("--- ES5 Template Method: Pha đồ uống ---");

console.log("\n☕ Pha CÀ PHÊ:");
var coffee = new Coffee();
coffee.prepareRecipe(); // Chạy đúng 4 bước theo khung đã định

console.log("\n🍵 Pha TRÀ:");
var tea = new Tea();
tea.prepareRecipe(); // Cùng khung, chỉ khác bước 2 và 4

console.log("\n📌 Lưu ý: Thứ tự các bước (đun sôi -> pha -> rót -> gia vị)");
console.log("   được khóa cứng trong prepareRecipe() của class cha,");
console.log("   subclass không thể thay đổi được trình tự này.");
