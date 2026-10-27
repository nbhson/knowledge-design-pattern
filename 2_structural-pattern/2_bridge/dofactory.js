// ES5 Implementation - Bridge Pattern
// Abstraction cấp cao (Shape) tách khỏi Implementation (ColorAPI) qua composition.

// Implementor - interface cho phần cài đặt màu sắc
function ColorAPI() {}
ColorAPI.prototype.pick = function (name) {
  throw new Error("Phải cài đặt method pick()");
};

// Concrete Implementor 1 - màu đỏ
function RedColor() {}
RedColor.prototype = Object.create(ColorAPI.prototype);
RedColor.prototype.pick = function () {
  return "red";
};

// Concrete Implementor 2 - màu xanh lá
function GreenColor() {}
GreenColor.prototype = Object.create(ColorAPI.prototype);
GreenColor.prototype.pick = function () {
  return "green";
};

// Abstraction - giữ "cây cầu" trỏ sang Implementation
function Shape() {
  this.colorAPI = null; // sẽ được gán từ bên ngoài (bridge)
}
Shape.prototype.draw = function () {
  throw new Error("Phải cài đặt method draw()");
};

// Refined Abstraction 1 - hình tròn
function Circle(radius, colorAPI) {
  Shape.call(this);
  this.colorAPI = colorAPI; // bridge sang implementation
  this.radius = radius;
}
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.draw = function () {
  console.log("Drawing circle of color: " + this.colorAPI.pick());
};

// Refined Abstraction 2 - hình vuông
function Square(width, colorAPI) {
  Shape.call(this);
  this.colorAPI = colorAPI;
  this.width = width;
}
Square.prototype = Object.create(Shape.prototype);
Square.prototype.draw = function () {
  console.log("Drawing square of color: " + this.colorAPI.pick());
};

// --- Client Code ---

// Kết hợp tự do: 2 Shape x 2 Color mà không cần class riêng cho từng cặp
var redCircle = new Circle(5, new RedColor());
redCircle.draw(); // Drawing circle of color: red

var greenCircle = new Circle(10, new GreenColor());
greenCircle.draw(); // Drawing circle of color: green

var redSquare = new Square(4, new RedColor());
redSquare.draw(); // Drawing square of color: red

var greenSquare = new Square(8, new GreenColor());
greenSquare.draw(); // Drawing square of color: green
