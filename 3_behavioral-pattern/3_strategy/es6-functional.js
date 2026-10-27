// ES6: Functional Strategy Pattern (Javascript-idiomatic)
// Bằng cách map các Function vào một Object Literal, thay vì dùng switch-case hoặc if-else.
function preOrderPrice(originalPrice) {
    return originalPrice * 0.2;
}
function promotionPrice(originalPrice) {
    return originalPrice <= 200 ? originalPrice * 0.1 : originalPrice - 30;
}
function blackFridayPrice(originalPrice) {
    return originalPrice <= 200 ? originalPrice * 0.2 : originalPrice - 50;
}
function defaultPrice(originalPrice) {
    return originalPrice;
}

// Và chúng ta sẽ sửa đổi lại như sau:
// function getPrice(originalPrice, typePromotion) {
//     if (typePromotion === "preOrder") {
//         return preOrderPrice(originalPrice);
//     }
//     if (typePromotion === "promotion") {
//         return promotionPrice(originalPrice);
//     }
//     if (typePromotion === "blackFriday") {
//         return blackFridayPrice(originalPrice);
//     }
//     if (typePromotion === "default") {
//         return defaultPrice(originalPrice);
//     }
// }

// Nhưng nếu như ở video trước học về IF ELSE thì chúng ta không nên làm như vậy, thay vò sử dung if thì chúng ta nên sử dụng strategy parrtenr ở đây?
const getPriceStrategies = Object.freeze({
    preOrder: preOrderPrice,
    promotion: promotionPrice,
    blackFriday: blackFridayPrice,
    standard: defaultPrice,
    default: defaultPrice,
})

// Kết hợp trạng thái với chiến lược chiết khấu, hàm giá có thể được tối ưu hóa như sau:
function getPrice(originalPrice, typePromotion) {
    const promotionStrategy =
        getPriceStrategies[typePromotion] ||
        getPriceStrategies.default ||
        getPriceStrategies.standard;
    return promotionStrategy(originalPrice);
}

console.log('-->>>', getPrice(200, 'blackFriday'))