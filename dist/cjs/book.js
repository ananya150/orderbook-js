"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBook = void 0;
var order_1 = require("./order");
var side_1 = require("./side");
var validTimeInForce = Object.values(order_1.TimeInForce);
var OrderBook = /** @class */ (function () {
    function OrderBook() {
        var _this = this;
        this.orders = {};
        /**
         *  Create a trade order
         *  @see {@link IProcessOrder} for the returned data structure
         *
         *  @param type - `limit` or `market`
         *  @param side - `sell` or `buy`
         *  @param size - How much of currency you want to trade in units of base currency
         *  @param price - The price at which the order is to be fullfilled, in units of the quote currency. Param only for limit order
         *  @param orderID - Unique order ID. Param only for limit order
         *  @param timeInForce - Time-in-force supported are: `GTC` (default), `FOK`, `IOC`. Param only for limit order
         *  @returns An object with the result of the processed order or an error.
         */
        this.createOrder = function (
        // common for all order types
        type, side, size, 
        // Specific for limit order type
        price, orderID, timeInForce) {
            if (timeInForce === void 0) { timeInForce = order_1.TimeInForce.GTC; }
            switch (type) {
                case order_1.OrderType.MARKET:
                    return _this.market(side, size);
                case order_1.OrderType.LIMIT:
                    return _this.limit(side, orderID, size, price, timeInForce);
                default:
                    return {
                        done: [],
                        partial: null,
                        partialQuantityProcessed: 0,
                        quantityLeft: size,
                        err: new Error("orderbook: supported order type are 'limit' and 'market'"),
                    };
            }
        };
        /**
         * Create a market order
         *  @see {@link IProcessOrder} for the returned data structure
         *
         * @param side - `sell` or `buy`
         * @param size - How much of currency you want to trade in units of base currency
         * @returns An object with the result of the processed order or an error
         */
        this.market = function (side, size) {
            var response = {
                done: [],
                partial: null,
                partialQuantityProcessed: 0,
                quantityLeft: size,
                err: null,
            };
            if (side !== order_1.Side.SELL && side !== order_1.Side.BUY) {
                response.err = new Error("orderbook: given neither 'bid' nor 'ask'");
                return response;
            }
            if (!size || typeof size !== "number" || size <= 0) {
                response.err = new Error("orderbook: insufficient quantity to calculate price");
                return response;
            }
            var iter;
            var sideToProcess;
            if (side === order_1.Side.BUY) {
                iter = _this.asks.minPriceQueue;
                sideToProcess = _this.asks;
            }
            else {
                iter = _this.bids.maxPriceQueue;
                sideToProcess = _this.bids;
            }
            while (size > 0 && sideToProcess.len() > 0) {
                // if sideToProcess.len > 0 it is not necessary to verify that bestPrice exists
                var bestPrice = iter();
                var _a = _this.processQueue(bestPrice, size), done = _a.done, partial = _a.partial, partialQuantityProcessed = _a.partialQuantityProcessed, quantityLeft = _a.quantityLeft;
                response.done = response.done.concat(done);
                response.partial = partial;
                response.partialQuantityProcessed = partialQuantityProcessed;
                size = quantityLeft || 0;
            }
            response.quantityLeft = size;
            return response;
            return response;
        };
        /**
         * Create a limit order
         *  @see {@link IProcessOrder} for the returned data structure
         *
         * @param side - `sell` or `buy`
         * @param orderID - Unique order ID
         * @param size - How much of currency you want to trade in units of base currency
         * @param price - The price at which the order is to be fullfilled, in units of the quote currency
         * @param timeInForce - Time-in-force type supported are: GTC, FOK, IOC
         * @returns An object with the result of the processed order or an error
         */
        this.limit = function (side, orderID, size, price, timeInForce) {
            if (timeInForce === void 0) { timeInForce = order_1.TimeInForce.GTC; }
            var response = {
                done: [],
                partial: null,
                partialQuantityProcessed: 0,
                quantityLeft: size,
                err: null,
            };
            if (side !== order_1.Side.SELL && side !== order_1.Side.BUY) {
                response.err = new Error("orderbook: given neither 'bid' nor 'ask'");
                return response;
            }
            if (_this.orders[orderID]) {
                response.err = new Error("orderbook: order already exists");
                return response;
            }
            if (!size || typeof size !== "number" || size <= 0) {
                response.err = new Error("orderbook: invalid order quantity");
                return response;
            }
            if (!price || typeof price !== "number" || price <= 0) {
                response.err = new Error("orderbook: invalid order price");
                return response;
            }
            if (!validTimeInForce.includes(timeInForce)) {
                response.err = new Error("orderbook: supported time in force are 'GTC', 'IOC' and 'FOK'");
                return response;
            }
            var quantityToTrade = size;
            var sideToProcess;
            var sideToAdd;
            var comparator;
            var iter;
            if (side === order_1.Side.BUY) {
                sideToAdd = _this.bids;
                sideToProcess = _this.asks;
                comparator = _this.greaterThanOrEqual;
                iter = _this.asks.minPriceQueue;
            }
            else {
                sideToAdd = _this.asks;
                sideToProcess = _this.bids;
                comparator = _this.lowerThanOrEqual;
                iter = _this.bids.maxPriceQueue;
            }
            if (timeInForce === order_1.TimeInForce.FOK) {
                var fillable = _this.canFillOrder(sideToProcess, side, size, price);
                if (!fillable) {
                    response.err = new Error("orderbook: limit FOK order not fillable");
                    return response;
                }
            }
            var bestPrice = iter();
            while (quantityToTrade > 0 &&
                sideToProcess.len() > 0 &&
                bestPrice &&
                comparator(price, bestPrice.price())) {
                var _a = _this.processQueue(bestPrice, quantityToTrade), done = _a.done, partial = _a.partial, partialQuantityProcessed = _a.partialQuantityProcessed, quantityLeft = _a.quantityLeft;
                response.done = response.done.concat(done);
                response.partial = partial;
                response.partialQuantityProcessed = partialQuantityProcessed;
                quantityToTrade = quantityLeft || 0;
                response.quantityLeft = quantityToTrade;
                bestPrice = iter();
            }
            if (quantityToTrade > 0) {
                var order = new order_1.Order(orderID, side, quantityToTrade, price, Date.now(), true);
                if (response.done.length > 0) {
                    response.partialQuantityProcessed = size - quantityToTrade;
                    response.partial = order;
                }
                _this.orders[orderID] = sideToAdd.append(order);
            }
            else {
                var totalQuantity_1 = 0;
                var totalPrice_1 = 0;
                response.done.forEach(function (order) {
                    totalQuantity_1 += order.size;
                    totalPrice_1 += order.price * order.size;
                });
                if (response.partialQuantityProcessed && response.partial) {
                    if (response.partialQuantityProcessed > 0) {
                        totalQuantity_1 += response.partialQuantityProcessed;
                        totalPrice_1 +=
                            response.partial.price * response.partialQuantityProcessed;
                    }
                }
                response.done.push(new order_1.Order(orderID, side, size, totalPrice_1 / totalQuantity_1, Date.now()));
            }
            // If IOC order was not matched completely remove from the order book
            if (timeInForce === order_1.TimeInForce.IOC && response.quantityLeft > 0) {
                _this.cancel(orderID);
            }
            return response;
        };
        /**
         * Modify an existing order with given ID
         *
         * @param orderID - The ID of the order to be modified
         * @param orderUpdate - An object with the modified size and/or price of an order. To be note that the `side` can't be modified. The shape of the object is `{side, size, price}`.
         * @returns The modified order if exists or `undefined`
         */
        this.modify = function (orderID, orderUpdate) {
            var order = _this.orders[orderID];
            if (!order)
                return;
            var side = orderUpdate.side;
            if (side === order_1.Side.BUY) {
                return _this.bids.update(order, orderUpdate);
            }
            else if (side === order_1.Side.SELL) {
                return _this.asks.update(order, orderUpdate);
            }
            else {
                throw new Error("orderbook: given neither 'bid' nor 'ask'");
            }
        };
        /**
         * Remove an existing order with given ID from the order book
         *
         * @param orderID - The ID of the order to be removed
         * @returns The removed order if exists or `undefined`
         */
        this.cancel = function (orderID) {
            var order = _this.orders[orderID];
            if (!order)
                return;
            delete _this.orders[orderID];
            if (order.side === order_1.Side.BUY) {
                return _this.bids.remove(order);
            }
            return _this.asks.remove(order);
        };
        /**
         * Get an existing order with the given ID
         *
         * @param orderID - The ID of the order to be returned
         * @returns The order if exists or `undefined`
         */
        this.order = function (orderID) {
            return _this.orders[orderID];
        };
        // Returns price levels and volume at price level
        this.depth = function () {
            var asks = [];
            var bids = [];
            _this.asks.priceTree().forEach(function (levelPrice, level) {
                asks.push([levelPrice, level.volume()]);
            });
            _this.bids.priceTree().forEach(function (levelPrice, level) {
                bids.push([levelPrice, level.volume()]);
            });
            return [asks, bids];
        };
        this.toString = function () {
            return (_this.asks.toString() +
                "\r\n------------------------------------" +
                _this.bids.toString());
        };
        // Returns total market price for requested quantity
        // if err is not null price returns total price of all levels in side
        this.calculateMarketPrice = function (side, size) {
            var price = 0;
            var err = null;
            var level;
            var iter;
            if (side === order_1.Side.BUY) {
                level = _this.asks.minPriceQueue();
                iter = _this.asks.greaterThan;
            }
            else {
                level = _this.bids.maxPriceQueue();
                iter = _this.bids.lowerThan;
            }
            while (size > 0 && level) {
                var levelVolume = level.volume();
                var levelPrice = level.price();
                if (_this.greaterThanOrEqual(size, levelVolume)) {
                    price += levelPrice * levelVolume;
                    size -= levelVolume;
                    level = iter(levelPrice);
                }
                else {
                    price += levelPrice * size;
                    size = 0;
                }
            }
            if (size > 0) {
                err = new Error("orderbook: insufficient quantity to calculate price");
            }
            return { price: price, err: err };
        };
        this.greaterThanOrEqual = function (a, b) {
            return a >= b;
        };
        this.lowerThanOrEqual = function (a, b) {
            return a <= b;
        };
        this.processQueue = function (orderQueue, quantityToTrade) {
            var response = {
                done: [],
                partial: null,
                partialQuantityProcessed: 0,
                quantityLeft: quantityToTrade,
                err: null,
            };
            if (response.quantityLeft) {
                while (orderQueue.len() > 0 && response.quantityLeft > 0) {
                    var headOrder = orderQueue.head();
                    if (headOrder) {
                        if (response.quantityLeft < headOrder.size) {
                            response.partial = new order_1.Order(headOrder.id, headOrder.side, headOrder.size - response.quantityLeft, headOrder.price, headOrder.time, true);
                            _this.orders[headOrder.id] = response.partial;
                            response.partialQuantityProcessed = response.quantityLeft;
                            orderQueue.update(headOrder, response.partial);
                            response.quantityLeft = 0;
                        }
                        else {
                            response.quantityLeft = response.quantityLeft - headOrder.size;
                            var canceledOrder = _this.cancel(headOrder.id);
                            if (canceledOrder)
                                response.done.push(canceledOrder);
                        }
                    }
                }
            }
            return response;
        };
        this.canFillOrder = function (orderSide, side, size, price) {
            return side === order_1.Side.BUY
                ? _this.buyOrderCanBeFilled(orderSide, size, price)
                : _this.sellOrderCanBeFilled(orderSide, size, price);
        };
        this.buyOrderCanBeFilled = function (orderSide, size, price) {
            if (orderSide.volume() < size) {
                return false;
            }
            var cumulativeSize = 0;
            orderSide.priceTree().forEach(function (_key, priceLevel) {
                if (price >= priceLevel.price() && cumulativeSize < size) {
                    cumulativeSize += priceLevel.volume();
                }
                else {
                    return true; // break the loop
                }
            });
            return cumulativeSize >= size;
        };
        this.sellOrderCanBeFilled = function (orderSide, size, price) {
            if (orderSide.volume() < size) {
                return false;
            }
            var cumulativeSize = 0;
            orderSide.priceTree().forEach(function (_key, priceLevel) {
                if (price <= priceLevel.price() && cumulativeSize < size) {
                    cumulativeSize += priceLevel.volume();
                }
                else {
                    return true; // break the loop
                }
            });
            return cumulativeSize >= size;
        };
        this.bids = new side_1.OrderSide(order_1.Side.BUY);
        this.asks = new side_1.OrderSide(order_1.Side.SELL);
    }
    return OrderBook;
}());
exports.OrderBook = OrderBook;
