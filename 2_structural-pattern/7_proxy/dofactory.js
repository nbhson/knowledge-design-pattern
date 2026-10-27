// ES5: Classic Structural Proxy Pattern
// Ví dụ: Một GeoCoder service giả lập tốn thời gian. Ta dùng Proxy để cache kết quả.

function GeoCoder() {
    this.getLatLng = function (address) {
        if (address === "Amsterdam") {
            return "52.3700° N, 4.8900° E";
        } else if (address === "London") {
            return "51.5171° N, 0.1062° W";
        } else if (address === "Paris") {
            return "48.8742° N, 2.3470° E";
        } else if (address === "Berlin") {
            return "52.5233° N, 13.4127° E";
        } else {
            return "";
        }
    };
}

// Proxy để bọc GeoCoder
function GeoProxy() {
    var geocoder = new GeoCoder();
    var geocache = {};

    return {
        getLatLng: function (address) {
            if (!geocache[address]) {
                // Nêú chưa có trong cache thì gọi real subject
                geocache[address] = geocoder.getLatLng(address);
                console.log("-- Called Real GeoCoder for: " + address);
            } else {
                console.log("-- Used Cache for: " + address);
            }
            return geocache[address];
        }
    };
}

// --- Client Code ---
var geo = new GeoProxy();

geo.getLatLng("Paris");
geo.getLatLng("London");
geo.getLatLng("London"); // Call 2nd time -> should use cache
geo.getLatLng("Paris"); // Call 2nd time -> should use cache
geo.getLatLng("Amsterdam");
