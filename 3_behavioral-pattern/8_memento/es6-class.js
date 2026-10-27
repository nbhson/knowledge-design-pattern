// ES6: Class-based Memento Pattern (Gang of Four chuẩn)
// Ví dụ: Game checkpoint — lưu trạng thái nhân vật trước khi đánh boss

// --- Memento: snapshot bất biến của trạng thái nhân vật ---
// Dùng #privateField (ES2022) để nhấn mạnh: ngoài Originator, không ai được đụng vào
class SavePoint {
    constructor(hp, x, y, level, items) {
        this.#snapshot = { hp, x, y, level, items: [...items] }; // copy mảng để chống sửa ngoài
    }
    #snapshot; // private field

    // Chỉ Originator gọi được — lấy dữ liệu thô để khôi phục
    _getSnapshot() {
        return { ...this.#snapshot, items: [...this.#snapshot.items] };
    }
}

// --- Originator: nhân vật trong game ---
class GameCharacter {
    constructor(name, hp, x, y, level, items = []) {
        this.name = name;
        this.hp = hp;
        this.x = x;
        this.y = y;
        this.level = level;
        this.items = items;
    }

    levelUp() {
        this.level += 1;
        this.hp += 20;
        console.log(`[${this.name}] Lên cấp ${this.level}! (HP: ${this.hp})`);
    }

    addItem(item) {
        this.items.push(item);
        console.log(`[${this.name}] Nhặt được item: ${item}`);
    }

    // Hít tó khi đánh boss
    takeDamage(amount) {
        this.hp -= amount;
        console.log(`[${this.name}] Trúng đòn -${amount} HP! (HP còn: ${this.hp})`);
    }

    // Xuất snapshot của chính mình (Originator tự tạo memento)
    save() {
        return new SavePoint(this.hp, this.x, this.y, this.level, this.items);
    }

    // Khôi phục từ snapshot (Originator tự đọc memento)
    restore(savePoint) {
        const s = savePoint._getSnapshot();
        this.hp = s.hp;
        this.x = s.x;
        this.y = s.y;
        this.level = s.level;
        this.items = s.items;
        console.log(`[${this.name}] ↩ Load checkpoint → HP: ${this.hp}, Level: ${this.level}, Items: [${this.items.join(", ")}]`);
    }

    toString() {
        return `${this.name} | HP: ${this.hp} | Level: ${this.level} | Vị trí: (${this.x}, ${this.y}) | Items: [${this.items.join(", ")}]`;
    }
}

// --- Caretaker: quản lý danh sách checkpoint, KHÔNG biết nội dung bên trong ---
class SaveManager {
    constructor() {
        this.checkpoints = [];
    }

    // Lưu trạng thái hiện tại thành checkpoint mới
    save(character) {
        this.checkpoints.push(character.save());
        console.log(`[SaveManager] 💾 Đã lưu checkpoint #${this.checkpoints.length - 1}.`);
    }

    // Load checkpoint theo index
    load(index) {
        if (index < 0 || index >= this.checkpoints.length) {
            throw new Error(`Không tồn tại checkpoint #${index}`);
        }
        console.log(`[SaveManager] 📂 Load checkpoint #${index}.`);
        return this.checkpoints[index];
    }
}

// --- Client Code ---

console.log("=== ES6 Memento Pattern: Game Checkpoint ===\n");

const saveManager = new SaveManager();
const hero = new GameCharacter("Kiếm Sĩ", 100, 0, 0, 1);

// Chơi game: lên cấp, nhặt đồ
hero.addItem("Bình máu");
hero.levelUp();
hero.addItem("Kiếm Bạc");

// Trước khi vào boss fight → tạo checkpoint
console.log("\n--- Lưu checkpoint trước khi vào boss fight ---");
saveManager.save(hero);
console.log(`  ${hero.toString()}`);

// Vào trận đánh boss... và thua thảm hại
console.log("\n--- ⚔ Đánh Boss... thua! ---");
hero.takeDamage(70);
hero.takeDamage(45);
hero.items.splice(hero.items.indexOf("Kiếm Bạc"), 1); // Kiếm Bạc bị boss làm rơi

console.log(`  ${hero.toString()}`);

// Quá tệ → load lại checkpoint
console.log("\n--- Load lại checkpoint ---");
hero.restore(saveManager.load(0));
console.log(`  ${hero.toString()}`);
