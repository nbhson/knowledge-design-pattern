// ES6 Class Implementation - Flyweight Pattern
// Text Renderer: hàng nghìn ký tự chia sẻ Glyph (font, size, style)
// qua Flyweight Factory.

// 1. Flyweight - intrinsic state dùng chung (font, kích thước, style)
class Glyph {
  constructor(character, font, size, style) {
    this.character = character;
    this.font = font; // ví dụ: "Arial"
    this.size = size; // ví dụ: 14
    this.style = style; // ví dụ: "bold"
  }

  describe() {
    return `"${this.character}" font=${this.font} size=${this.size} style=${this.style}`;
  }
}

// 2. Flyweight Factory - cache và tái sử dụng Glyph
class GlyphFactory {
  constructor() {
    this.glyphs = new Map(); // key: "char_font_size_style"
  }

  // Tra cứu cache → trả bản dùng chung, hoặc tạo mới rồi cache
  getGlyph(character, font, size, style) {
    const key = `${character}_${font}_${size}_${style}`;
    if (!this.glyphs.has(key)) {
      console.log(`[Factory] Tạo Glyph mới: ${key}`);
      this.glyphs.set(key, new Glyph(character, font, size, style));
    }
    return this.glyphs.get(key);
  }

  getGlyphCount() {
    return this.glyphs.size;
  }
}

// 3. Client (Extrinsic state) - mỗi vị trí ký tự chỉ lưu tọa độ riêng
class TextPosition {
  constructor(char, font, size, style, x, y, factory) {
    // Lấy Flyweight từ Factory (không tự tạo Glyph riêng)
    this.glyph = factory.getGlyph(char, font, size, style);
    this.x = x;
    this.y = y;
  }

  render() {
    console.log(
      `  Ký tự "${this.glyph.character}" tại (${this.x},${this.y}) → ${this.glyph.describe()}`
    );
  }
}

// --- Client Code ---

const factory = new GlyphFactory();

// Giả lập render văn bản: cùng ký tự 'l' xuất hiện 3 lần
// nhưng chỉ dùng đúng 1 Glyph "l_Arial_14_normal" duy nhất
const text = "Hello Flyweight";
const positions = [];

let x = 0;
for (const char of text) {
  positions.push(new TextPosition(char, "Arial", 14, "normal", x, 100, factory));
  x += 10;
}

console.log("\n--- Render văn bản ---");
positions.slice(0, 5).forEach((pos) => pos.render());
console.log(`  ... và ${positions.length - 5} ký tự nữa`);

console.log(
  `\n[So sánh] Số TextPosition: ${positions.length}, Số Glyph (Flyweight) duy nhất: ${factory.getGlyphCount()}`
);
// → 15 TextPosition (chỉ tọa độ), chỉ vài Glyph độc lập trong bộ nhớ
// Chữ 'l' xuất hiện 3 lần nhưng chỉ cần 1 Glyph "l"
