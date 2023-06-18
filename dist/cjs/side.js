"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSide = void 0;
var functional_red_black_tree_1 = __importDefault(require("functional-red-black-tree"));
var order_1 = require("./order");
var queue_1 = require("./queue");
var OrderSide = /** @class */ (function () {
    function OrderSide(side) {
        var _this = this;
        this._prices = {};
        this._volume = 0;
        this._total = 0;
        this._numOrders = 0;
        this._depthSide = 0;
        this._side = order_1.Side.SELL;
        // returns amount of orders
        this.len = function () {
            return _this._numOrders;
        };
        // returns depth of market
        this.depth = function () {
            return _this._depthSide;
        };
        // returns total amount of quantity in side
        this.volume = function () {
            return _this._volume;
        };
        // returns the total (size * price of each price level) in side
        this.total = function () {
            return _this._total;
        };
        // returns the price tree in side
        this.priceTree = function () {
            return _this._priceTree;
        };
        // appends order to definite price level
        this.append = function (order) {
            var price = order.price;
            var strPrice = price.toString();
            if (!_this._prices[strPrice]) {
                var priceQueue = new queue_1.Queue(price);
                _this._prices[strPrice] = priceQueue;
                _this._priceTree = _this._priceTree.insert(price, priceQueue);
                _this._depthSide += 1;
            }
            _this._numOrders += 1;
            _this._volume += order.size;
            _this._total += order.size + order.price;
            return _this._prices[strPrice].append(order);
        };
        // remove order from definate pricc pool
        this.remove = function (order) {
            var price = order.price;
            var strPrice = price.toString();
            if (!_this._prices[strPrice])
                throw new Error("orderbook: invalid order price level");
            _this._prices[strPrice].remove(order);
            if (_this._prices[strPrice].len() === 0) {
                delete _this._prices[strPrice];
                _this._priceTree = _this._priceTree.remove(price);
                _this._depthSide -= 1;
            }
            _this._numOrders -= 1;
            _this._volume -= order.size;
            _this._total -= order.size * order.price;
            return order;
        };
        this.update = function (oldOrder, orderUpdate) {
            if (orderUpdate.price !== undefined &&
                orderUpdate.price !== oldOrder.price) {
                // price changed. Remove order and update tree
                _this.remove(oldOrder);
                var newOrder = new order_1.Order(oldOrder.id, oldOrder.side, orderUpdate.size || oldOrder.size, orderUpdate.price, Date.now(), oldOrder.isMaker);
                _this.append(newOrder);
                return newOrder;
            }
            else if (orderUpdate.size !== undefined &&
                orderUpdate.size !== oldOrder.size) {
                // Quantity changed. Price remains same
                var strPrice = oldOrder.price.toString();
                _this._volume += orderUpdate.size - oldOrder.size;
                _this._total +=
                    orderUpdate.size * orderUpdate.price - oldOrder.size * oldOrder.price;
                _this._prices[strPrice].updateOrderSize(oldOrder, orderUpdate.size);
                return oldOrder;
            }
        };
        // returns max levels of price
        this.maxPriceQueue = function () {
            if (_this._depthSide > 0) {
                var max = _this._side === order_1.Side.SELL ? _this._priceTree.end : _this._priceTree.begin;
                return max.value;
            }
        };
        // returns min level of price
        this.minPriceQueue = function () {
            if (_this._depthSide > 0) {
                var min = _this._side === order_1.Side.SELL ? _this._priceTree.begin : _this._priceTree.end;
                return min.value;
            }
        };
        // returns nearest OrderQueue with price less than given
        this.lowerThan = function (price) {
            var node = _this._side === order_1.Side.SELL
                ? _this._priceTree.lt(price)
                : _this._priceTree.gt(price);
            return node.value;
        };
        // returns nearest OrderQueue with price greater than given
        this.greaterThan = function (price) {
            var node = _this._side === order_1.Side.SELL
                ? _this._priceTree.gt(price)
                : _this._priceTree.lt(price);
            return node.value;
        };
        // return all orders
        this.orders = function () {
            var orders = [];
            for (var price in _this._prices) {
                if (Object.prototype.hasOwnProperty.call(_this._prices, price)) {
                    var allOrders = _this._prices[price].toArray();
                    orders = orders.concat(allOrders);
                }
            }
            return orders;
        };
        this.toString = function () {
            var s = "";
            var level = _this.maxPriceQueue();
            while (level) {
                s += "\n".concat(level.price(), " -> ").concat(level.volume());
                level = _this.lowerThan(level.price());
            }
            return s;
        };
        var compare = side === order_1.Side.SELL
            ? function (a, b) { return a - b; }
            : function (a, b) { return b - a; };
        this._priceTree = (0, functional_red_black_tree_1.default)(compare);
        this._side = side;
    }
    return OrderSide;
}());
exports.OrderSide = OrderSide;
