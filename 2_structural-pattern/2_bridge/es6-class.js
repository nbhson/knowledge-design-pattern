// ES6 Class Implementation - Bridge Pattern
// Tách "vẽ hình gì" (Shape) khỏi "vẽ bằng cách nào" (Renderer).

// 1. Implementor - interface cho phần cài đặt cách render
class Renderer {
  renderCircle(radius) {
    throw new Error("Phải override renderCircle()");
  }
  renderSquare(side) {
    throw new Error("Phải override renderSquare()");
  }
}

// 2. Concrete Implementor - render dạng vector (SVG-like)
class VectorRenderer extends Renderer {
  renderCircle(radius) {
    return `Vẽ đường tròn vector với bán kính ${radius}px`;
  }
  renderSquare(side) {
    return `Vẽ hình vuông vector với cạnh ${side}px`;
  }
}

// 3. Concrete Implementor - render dạng raster (pixel-based)
class RasterRenderer extends Renderer {
  renderCircle(radius) {
    return `Rasterize đường tròn ${radius * 2}x${radius * 2} pixels`;
  }
  renderSquare(side) {
    return `Rasterize hình vuông ${side}x${side} pixels`;
  }
}

// 4. Abstraction - giữ tham chiếu "cây cầu" đến Renderer
class Shape {
  constructor(renderer) {
    this.renderer = renderer; // Bridge qua composition, không qua kế thừa
  }
}

// 5. Refined Abstraction - Circle
class Circle extends Shape {
  constructor(renderer, radius) {
    super(renderer);
    this.radius = radius;
  }
  draw() {
    // Ủy quyền phần cài đặt cho implementation bên kia cây cầu
    console.log(`Circle: ${this.renderer.renderCircle(this.radius)}`);
  }
}

// 6. Refined Abstraction - Square
class Square extends Shape {
  constructor(renderer, side) {
    super(renderer);
    this.side = side;
  }
  draw() {
    console.log(`Square: ${this.renderer.renderSquare(this.side)}`);
  }
}

// --- Client Code ---

// 2 Shape x 2 Renderer = 4 tổ hợp, chỉ cần 4 class thay vì 4 class con riêng biệt
const shapes = [
  new Circle(new VectorRenderer(), 5),
  new Circle(new RasterRenderer(), 5),
  new Square(new VectorRenderer(), 10),
  new Square(new RasterRenderer(), 10),
];

shapes.forEach((shape) => shape.draw());

// Đổi implementation lúc runtime mà không cần tạo lại Shape
const circle = new Circle(new VectorRenderer(), 7);
circle.draw();
circle.renderer = new RasterRenderer(); // hoán đổi "cây cầu"
circle.draw();
