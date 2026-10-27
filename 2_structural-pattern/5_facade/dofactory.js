// ES5 Implementation
class Discount {
  calc(value) {
    return value * 0.9;
  }
}

class Shipping {
  calc(price) {
    return price + 5;
  }
}

class Fees {
  calc(value) {
    return value * 1.05;
  }
}

/**
 *  bên trong class pattern sẽ tích hợp nhiều class phức tạp,
 * biến nó thành một class đơn giản
 */
class ShopPattern {
  constructor() {
    this.discount = new Discount();
    this.shipping = new Shipping();
    this.fees = new Fees();
  }

  calc(price) {
    price = this.discount.calc(price);
    price = this.fees.calc(price);
    price = this.shipping.calc(price);

    return price;
  }
}

function buy(price) {
  const shop = new ShopPattern();
  console.log(`Price: ${shop.calc(price)}`);
}

buy(100000);