import Denque from "denque";
var Queue = /** @class */ (function () {
    function Queue(price) {
        var _this = this;
        this._ordersMap = {};
        // returns number of orders
        this.len = function () {
            return _this._orders.length;
        };
        // returns orders as an array
        this.toArray = function () {
            return _this._orders.toArray();
        };
        // returns price level of queue
        this.price = function () {
            return _this._price;
        };
        // returns total volume of orders in queue
        this.volume = function () {
            return _this._volume;
        };
        // return top order of queue
        this.head = function () {
            return _this._orders.peekFront();
        };
        // return bottom order of queue
        this.tail = function () {
            return _this._orders.peekBack();
        };
        // adds order to tail of the queue
        this.append = function (order) {
            _this._volume += order.size;
            _this._orders.push(order);
            _this._ordersMap[order.id] = _this._orders.length - 1;
            return order;
        };
        // sets up new order to list value
        this.update = function (oldOrder, newOrder) {
            _this._volume -= oldOrder.size;
            _this._volume += newOrder.size;
            // Remove old order from head
            _this._orders.shift();
            delete _this._ordersMap[oldOrder.id];
            // Add new order to head
            _this._orders.unshift(newOrder);
            _this._ordersMap[newOrder.id] = 0;
        };
        // remove order from queue
        this.remove = function (order) {
            _this._volume -= order.size;
            var deletedOrderIndex = _this._ordersMap[order.id];
            _this._orders.removeOne(deletedOrderIndex);
            delete _this._ordersMap[order.id];
            // Update all orders indexes where index is greater than the deleted one
            for (var orderId in _this._ordersMap) {
                if (Object.prototype.hasOwnProperty.call(_this._ordersMap, orderId)) {
                    if (_this._ordersMap[orderId] > deletedOrderIndex) {
                        _this._ordersMap[orderId] -= 1;
                    }
                }
            }
        };
        this.updateOrderSize = function (order, newSize) {
            _this._volume += newSize - order.size; // update volume
            order.size = newSize;
            order.time = Date.now();
        };
        this._price = price;
        this._volume = 0;
        this._orders = new Denque();
    }
    return Queue;
}());
export { Queue };
