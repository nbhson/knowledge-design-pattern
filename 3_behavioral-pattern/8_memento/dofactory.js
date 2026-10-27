// ES5: Classic Memento Pattern — TextEditor với tính năng Undo

// --- Memento: hộp đen chứa snapshot trạng thái ---
function TextMemento(content, cursorPos) {
    // Người ngoài vẫn có thể chạm vào (JS ES5 không có private thật),
    // nhưng theo quy ước: CHỈ TextEditor (Originator) được đọc 2 field này
    this._content = content;
    this._cursorPos = cursorPos;
}

// --- Originator: object sở hữu trạng thái ---
function TextEditor() {
    this.content = "";
    this.cursorPos = 0;
}

TextEditor.prototype = {
    type: function (text) {
        this.content += text;
        this.cursorPos = this.content.length;
        console.log(`[Editor] Gõ: "${text}" → nội dung: "${this.content}"`);
    },

    // Originator TỰ tạo snapshot của chính nó
    save: function () {
        return new TextMemento(this.content, this.cursorPos);
    },

    // Originator TỰ khôi phục từ snapshot
    restore: function (memento) {
        this.content = memento._content;
        this.cursorPos = memento._cursorPos;
        console.log(`[Editor] ↩ Khôi phục: "${this.content}" (cursor tại ${this.cursorPos})`);
    },
};

// --- Caretaker: chỉ CẤT và TRẢ snapshot, không nhìn vào nội dung ---
function History() {
    this.mementos = []; // ngăn xếp (stack) các snapshot
}

History.prototype = {
    push: function (memento) {
        this.mementos.push(memento);
        console.log(`[History] Lưu snapshot #${this.mementos.length - 1}.`);
    },

    // pop: lấy snapshot gần nhất ra khỏi ngăn xếp (Undo)
    pop: function () {
        var memento = this.mementos.pop();
        console.log(`[History] Lấy lại snapshot vừa lưu (Undo).`);
        return memento;
    },
};

// --- Client Code ---

console.log("=== ES5 Memento Pattern: Undo Editor ===\n");

var editor = new TextEditor();
var history = new History();

// Gõ chữ — mỗi lần thao tác quan trọng thì lưu snapshot
editor.type("Xin chào, ");
history.push(editor.save());

editor.type("thế giới!");
history.push(editor.save());

editor.type(" (nội dung sai cần xoá)");

// Oops — gõ nhầm, bấm Ctrl+Z
console.log("\n--- Bấm Ctrl + Z (Undo) ---");
editor.restore(history.pop());

// Bấm tiếp Ctrl + Z
console.log("\n--- Bấm Ctrl + Z lần nữa ---");
editor.restore(history.pop());
