// ES6: Command Pattern với ES6 Class
// Ví dụ: Undo/Redo trong trình soạn thảo văn bản (Ctrl+Z / Ctrl+Y)
// Mỗi thao tác gõ chữ/xoá chữ là một Command được đẩy vào lịch sử.

// --- Command base class (interface chung) ---
class Command {
    execute() {
        throw new Error("Phải triển khai execute()");
    }
    undo() {
        throw new Error("Phải triển khai undo()");
    }
}

// --- Receiver: trình soạn thảo chứa business logic thật ---
class Editor {
    constructor() {
        this.text = "";
    }
    type(text) {
        this.text += text;
        console.log(`Gõ: "${text}" -> nội dung: "${this.text}"`);
    }
    delete(n) {
        const removed = this.text.slice(-n);
        this.text = this.text.slice(0, -n);
        console.log(`Xoá: "${removed}" -> nội dung: "${this.text}"`);
        return removed;
    }
}

// --- ConcreteCommand 1: gõ thêm chữ ---
class TypeCommand extends Command {
    constructor(editor, text) {
        super();
        this.editor = editor;
        this.text = text;
    }
    execute() {
        this.editor.type(this.text);
    }
    undo() {
        // Hoàn tác việc gõ = xoá đi đúng số ký tự vừa thêm
        this.editor.delete(this.text.length);
    }
}

// --- ConcreteCommand 2: xoá n ký tự cuối (lưu lại chữ đã xoá để redo) ---
class DeleteCommand extends Command {
    constructor(editor, n) {
        super();
        this.editor = editor;
        this.n = n;
        this.removedText = "";
    }
    execute() {
        this.removedText = this.editor.delete(this.n);
    }
    undo() {
        // Hoàn tác việc xoá = gõ lại đúng đoạn đã bị xoá
        this.editor.type(this.removedText);
    }
}

// --- Invoker: quản lý history, điều phối undo/redo ---
class CommandManager {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }
    execute(command) {
        command.execute();
        this.undoStack.push(command);
        this.redoStack = []; // thao tác mới xoá sạch nhánh redo (như mọi editor)
    }
    undo() {
        const command = this.undoStack.pop();
        if (!command) {
            console.log("Không có gì để undo");
            return;
        }
        command.undo();
        this.redoStack.push(command);
    }
    redo() {
        const command = this.redoStack.pop();
        if (!command) {
            console.log("Không có gì để redo");
            return;
        }
        command.execute();
        this.undoStack.push(command);
    }
}

// --- Client Code ---
const editor = new Editor();
const manager = new CommandManager();

console.log("--- ES6 Command Pattern: Editor Undo/Redo ---");

manager.execute(new TypeCommand(editor, "Xin chào "));
manager.execute(new TypeCommand(editor, "JavaScript!"));
manager.execute(new DeleteCommand(editor, 11)); // xoá "JavaScript!"

console.log("\n--> Ctrl+Z (undo):");
manager.undo(); // gõ lại "JavaScript!"
manager.undo(); // xoá "JavaScript!"

console.log("\n--> Ctrl+Y (redo):");
manager.redo(); // xoá lại "JavaScript!"

console.log(`\nKết quả cuối: "${editor.text}"`);
