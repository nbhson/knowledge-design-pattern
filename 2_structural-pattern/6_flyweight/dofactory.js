// ES5 Implementation - Flyweight Pattern
// Game open world: hàng nghìn cây chia sẻ TreeType (texture, màu) qua Factory.

// Flyweight - intrinsic state dùng chung (texture, màu)
function TreeType(name, color, textureData) {
  this.name = name;
  this.color = color;
  this.textureData = textureData; // giả lập texture (string thay vì buffer)
}

// Flyweight Factory - tạo và cache TreeType, đảm bảo mỗi loại chỉ có 1 bản
var TreeFactory = (function () {
  var treeTypes = {};

  return {
    getTreeType: function (name, color, textureData) {
      var key = name + "_" + color;
      if (!treeTypes[key]) {
        console.log("[Factory] Tạo TreeType mới: " + key);
        treeTypes[key] = new TreeType(name, color, textureData);
      }
      return treeTypes[key];
    },
    getTypeCount: function () {
      return Object.keys(treeTypes).length;
    },
  };
})();

// Client (Extrinsic state) - mỗi Tree chỉ lưu tọa độ riêng
function Tree(x, y, treeType) {
  this.x = x;
  this.y = y;
  this.treeType = treeType; // tham chiếu đến Flyweight dùng chung
}

Tree.prototype.render = function () {
  console.log(
    "  Render cây '" +
      this.treeType.name +
      "' màu " +
      this.treeType.color +
      " tại (" +
      this.x +
      ", " +
      this.y +
      ") texture: " +
      this.treeType.textureData
  );
};

// --- Client Code ---

console.log("=== Không dùng Flyweight ===");
console.log("Mỗi cây tự lưu đầy đủ thông tin → tốn bộ nhớ\n");

console.log("=== Dùng Flyweight ===");
var forest = [];

// Mỗi loại cây chỉ được tạo 1 bản trong Factory
var oakType = TreeFactory.getTreeType("Oak", "green", "texture_oak_heavy");
var pineType = TreeFactory.getTreeType("Pine", "darkgreen", "texture_pine_dense");
var birchType = TreeFactory.getTreeType("Birch", "white", "texture_birch_light");

// Hàng nghìn cây (extrinsic state chỉ là tọa độ)
// Mỗi cây chỉ tốn bộ nhớ cho x, y, và tham chiếu đến TreeType
forest.push(new Tree(10, 20, oakType));
forest.push(new Tree(15, 25, oakType)); // cùng loại Oak
forest.push(new Tree(50, 30, pineType));
forest.push(new Tree(100, 80, pineType)); // cùng loại Pine
forest.push(new Tree(200, 150, birchType));

// Render tất cả cây
forest.forEach(function (tree) {
  tree.render();
});

console.log(
  "\n[So sánh] Số Tree instances: " +
    forest.length +
    ", Số TreeType (Flyweight) thực sự tạo: " +
    TreeFactory.getTypeCount()
);
// → 5 Tree instances, chỉ 3 TreeType độc lập trong bộ nhớ
// Không dùng Flyweight: 5 Tree × (name + color + texture + x + y)
