// ES5 Implementation - Decorator Pattern
// Thêm topping cho cà phê lúc runtime, không sửa class Coffee gốc.

// Component - interface chung
function Coffee() {
  this.getCost = function () {
    throw new Error("Phải cài đặt method getCost()");
  };
  this.getDescription = function () {
    throw new Error("Phải cài đặt method getDescription()");
  };
}

// Concrete Component - cà phê espresso gốc
function Espresso() {
  Coffee.call(this);
  this.getCost = function () {
    return 20000;
  };
  this.getDescription = function () {
    return "Espresso";
  };
}

// Decorator - giữ tham chiếu đến đối tượng được bọc
function CoffeeDecorator(coffee) {
  Coffee.call(this);
  this.coffee = coffee; // đối tượng bên trong lớp vỏ
}
CoffeeDecorator.prototype.getCost = function () {
  return this.coffee.getCost(); // ủy quyền mặc định
};
CoffeeDecorator.prototype.getDescription = function () {
  return this.coffee.getDescription();
};

// Concrete Decorator 1 - thêm sữa (+5000)
function MilkDecorator(coffee) {
  CoffeeDecorator.call(this, coffee);
  var parent = CoffeeDecorator.prototype; // giữ tham chiếu để tái sử dụng
  this.getCost = function () {
    return parent.getCost.call(this) + 5000;
  };
  this.getDescription = function () {
    return parent.getDescription.call(this) + " + Sữa";
  };
}
MilkDecorator.prototype = Object.create(CoffeeDecorator.prototype);

// Concrete Decorator 2 - thêm đường (+1000)
function SugarDecorator(coffee) {
  CoffeeDecorator.call(this, coffee);
  var parent = CoffeeDecorator.prototype;
  this.getCost = function () {
    return parent.getCost.call(this) + 1000;
  };
  this.getDescription = function () {
    return parent.getDescription.call(this) + " + Đường";
  };
}
SugarDecorator.prototype = Object.create(CoffeeDecorator.prototype);

// --- Client Code ---

// Cà phê gốc
var coffee = new Espresso();
console.log(coffee.getDescription() + ": " + coffee.getCost() + "đ");

// Bọc từng lớp decorator lúc runtime - không sửa class nào
var milkCoffee = new MilkDecorator(new Espresso());
console.log(milkCoffee.getDescription() + ": " + milkCoffee.getCost());

// Decorator lồng nhau, thứ tự tùy ý
var sweetMilkCoffee = new SugarDecorator(new MilkDecorator(new Espresso()));
console.log(sweetMilkCoffee.getDescription() + ": " + sweetMilkCoffee.getCost());
