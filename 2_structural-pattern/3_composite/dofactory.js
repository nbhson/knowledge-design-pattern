// ES5 Implementation - Composite Pattern
// Cây hệ thống tệp: Folder (Composite) chứa FileItem (Leaf),
// cả hai cùng dùng chung interface FileSystemComponent.

// Component - interface chung cho mọi node trong cây
function FileSystemComponent(name) {
  this.name = name;
}
FileSystemComponent.prototype.display = function () {
  throw new Error("Phải cài đặt method display()");
};

// Leaf - node lá, không có con
function FileItem(name, size) {
  FileSystemComponent.call(this, name);
  this.size = size;
}
FileItem.prototype = Object.create(FileSystemComponent.prototype);
FileItem.prototype.display = function () {
  console.log("  - " + this.name + " (" + this.size + " KB)");
};

// Composite - node cha, chứa danh sách các node con
function Folder(name) {
  FileSystemComponent.call(this, name);
  this.children = [];
}
Folder.prototype = Object.create(FileSystemComponent.prototype);

// Composite quản lý node con
Folder.prototype.add = function (component) {
  this.children.push(component);
};
Folder.prototype.remove = function (component) {
  var index = this.children.indexOf(component);
  if (index !== -1) this.children.splice(index, 1);
};

// Thao tác đệ quy qua toàn bộ cây
Folder.prototype.display = function () {
  console.log("+ " + this.name + "/");
  this.children.forEach(function (child) {
    child.display(); // child có thể là Leaf hoặc Composite khác
  });
};

// --- Client Code ---

// Xây dựng cây thư mục
var root = new Folder("project");
var src = new Folder("src");
var assets = new Folder("assets");

src.add(new FileItem("index.js", 12));
src.add(new FileItem("utils.js", 5));
assets.add(new FileItem("logo.png", 240));
assets.add(new FileItem("banner.jpg", 480));
root.add(src);
root.add(assets);
root.add(new FileItem("README.md", 2));

// Client chỉ gọi display() trên node gốc, không cần biết cấu trúc bên trong
root.display();
