// ES6 Class Implementation - Decorator Pattern
// Bọc UserService với logging + caching mà không sửa class gốc.

// 1. Component - interface chung
class UserService {
  async getUser(id) {
    throw new Error("Phải cài đặt method getUser()");
  }
}

// 2. Concrete Component - service gốc, giả lập gọi API tốn kém
class ApiUserService extends UserService {
  async getUser(id) {
    console.log(`  [API] Gọi API lấy user #${id}... (chậm & tốn kém)`);
    return { id, name: `User_${id}` };
  }
}

// 3. Decorator - kế thừa Component, giữ tham chiếu đến đối tượng được bọc
class UserServiceDecorator extends UserService {
  constructor(wrappee) {
    super();
    this.wrappee = wrappee; // đối tượng bên trong lớp vỏ
  }
  async getUser(id) {
    return this.wrappee.getUser(id); // ủy quyền mặc định
  }
}

// 4. Concrete Decorator 1 - thêm logging quanh lời gọi
class LoggedUserService extends UserServiceDecorator {
  async getUser(id) {
    console.log(`[LOG] getUser(${id}) bắt đầu...`);
    const result = await super.getUser(id); // ủy quyền cho lớp bên trong
    console.log(`[LOG] getUser(${id}) hoàn tất.`);
    return result;
  }
}

// 5. Concrete Decorator 2 - thêm caching (memoize)
class CachedUserService extends UserServiceDecorator {
  constructor(wrappee) {
    super(wrappee);
    this.cache = new Map(); // cache riêng của decorator
  }
  async getUser(id) {
    if (this.cache.has(id)) {
      console.log(`[CACHE] Trả user #${id} từ cache (không gọi API)`);
      return this.cache.get(id);
    }
    const user = await super.getUser(id);
    this.cache.set(id, user);
    return user;
  }
}

// --- Client Code ---

(async () => {
  // Class gốc chưa bọc gì
  const rawService = new ApiUserService();

  // Bọc decorator theo thứ tự: Api → Cache → Log
  const service = new LoggedUserService(new CachedUserService(new ApiUserService()));

  console.log("--- Lần gọi đầu (cache miss, vào API) ---");
  await service.getUser(1);

  console.log("--- Lần gọi thứ hai (trả từ cache) ---");
  await service.getUser(1);

  console.log("--- Thêm logging vào class gốc lúc runtime ---");
  const loggedOnly = new LoggedUserService(rawService);
  await loggedOnly.getUser(2);

  // Class ApiUserService gốc hoàn toàn không bị sửa đổi
})();
