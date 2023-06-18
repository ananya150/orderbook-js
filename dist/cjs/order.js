"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.TimeInForce = exports.OrderType = exports.Side = void 0;
var Side;
(function (Side) {
    Side["BUY"] = "buy";
    Side["SELL"] = "sell";
})(Side || (exports.Side = Side = {}));
var OrderType;
(function (OrderType) {
    OrderType["LIMIT"] = "limit";
    OrderType["MARKET"] = "market";
})(OrderType || (exports.OrderType = OrderType = {}));
var TimeInForce;
(function (TimeInForce) {
    TimeInForce["GTC"] = "GTC";
    TimeInForce["IOC"] = "IOC";
    TimeInForce["FOK"] = "FOK";
})(TimeInForce || (exports.TimeInForce = TimeInForce = {}));
var Order = /** @class */ (function () {
    function Order(orderId, side, size, price, time, isMaker) {
        var _this = this;
        // returns string representation of order
        this.toString = function () {
            return "".concat(_this._id, ":\n    side: ").concat(_this._side, "\n    size: ").concat(_this._side, "\n    price: ").concat(_this._price, "\n    time: ").concat(_this._time, "\n    isMaker: ").concat(_this.isMaker);
        };
        // returns json string of the order
        this.toJSON = function () {
            return JSON.stringify({
                id: _this._id,
                side: _this._side,
                size: _this._size,
                price: _this._price,
                time: _this._time,
                isMaker: _this.isMaker,
            });
        };
        // returns an object with each property name and value
        this.toObject = function () {
            return {
                id: _this._id,
                side: _this._side,
                size: _this._size,
                price: _this._price,
                time: _this._time,
                isMaker: _this.isMaker,
            };
        };
        this._id = orderId;
        this._side = side;
        this._size = size;
        this._price = price;
        this._time = time || Date.now();
        this._isMaker = isMaker || false;
    }
    Object.defineProperty(Order.prototype, "id", {
        // get id
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Order.prototype, "side", {
        // get side
        get: function () {
            return this._side;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Order.prototype, "price", {
        // get prixe
        get: function () {
            return this._price;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Order.prototype, "size", {
        // get size
        get: function () {
            return this._size;
        },
        // update size
        set: function (size) {
            this._size = size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Order.prototype, "time", {
        // get time
        get: function () {
            return this._time;
        },
        // update time
        set: function (time) {
            this._time = time;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Order.prototype, "isMaker", {
        // get type
        get: function () {
            return this._isMaker;
        },
        enumerable: false,
        configurable: true
    });
    return Order;
}());
exports.Order = Order;
