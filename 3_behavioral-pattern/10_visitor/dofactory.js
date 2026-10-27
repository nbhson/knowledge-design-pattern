// ES5: Classic Visitor Pattern — Cây Shape với nhiều operation (tính diện tích, xuất CSV)
// Kỹ thuật cốt lõi: DOUBLE DISPATCH
//   1st dispatch: shape.accept(visitor)
//   2nd dispatch: visitor.visitCircle(this) / visitor.visitRectangle(this)
//   → Visitor biết CHÍNH XÁC loại shape đang gặp, không cần instanceof

// --- Elements (cấu trúc đối tượng — không bao giờ phải sửa khi thêm operation mới) ---
function Circle(radius) {
    this.radius = radius;
}
Circle.prototype.accept = function (visitor) {
    visitor.visitCircle(this); // dispatch thứ 2: báo visitor "tôi là Circle"
};

function Rectangle(width, height) {
    this.width = width;
    this.height = height;
}
Rectangle.prototype.accept = function (visitor) {
    visitor.visitRectangle(this); // dispatch thứ 2: báo visitor "tôi là Rectangle"
};

// --- Visitor 1: tính diện tích (có tích lũy trạng thái qua lần duyệt) ---
function AreaVisitor() {
    this.totalArea = 0;
}
AreaVisitor.prototype = {
    visitCircle: function (circle) {
        var area = Math.PI * circle.radius * circle.radius;
        console.log(`[AreaVisitor] Circle r=${circle.radius} → diện tích = ${area.toFixed(2)}`);
        this.totalArea += area;
    },
    visitRectangle: function (rect) {
        var area = rect.width * rect.height;
        console.log(`[AreaVisitor] Rectangle ${rect.width}x${rect.height} → diện tích = ${area.toFixed(2)}`);
        this.totalArea += area;
    },
};

// --- Visitor 2: xuất báo cáo CSV ---
function CsvExportVisitor() {
    this.lines = ["shape,value"]; // header CSV
}
CsvExportVisitor.prototype = {
    visitCircle: function (circle) {
        this.lines.push(`circle,r=${circle.radius}`);
    },
    visitRectangle: function (rect) {
        this.lines.push(`rectangle,${rect.width}x${rect.height}`);
    },
    getCsv: function () {
        return this.lines.join("\n");
    },
};

// --- Client Code ---

console.log("=== ES5 Visitor Pattern: Cây Shape ===\n");

// Cấu trúc đối tượng (ObjectStructure): danh sách shape
var shapes = [new Circle(5), new Rectangle(4, 6), new Circle(2)];

// Operation 1: tính tổng diện tích
var areaVisitor = new AreaVisitor();
shapes.forEach(function (shape) {
    shape.accept(areaVisitor); // mỗi element "đón" visitor
});
console.log(`→ TỔNG DIỆN TÍCH: ${areaVisitor.totalArea.toFixed(2)}\n`);

// Operation 2: xuất CSV — thêm operation mới mà KHÔNG sửa bất kỳ class Shape nào
var csvVisitor = new CsvExportVisitor();
shapes.forEach(function (shape) {
    shape.accept(csvVisitor);
});
console.log("--- Xuất CSV ---");
console.log(csvVisitor.getCsv());
