import { OrderType, TimeInForce, Side } from "./order";
import { OrderSide } from "./side";
var vaidTimeInForce = Object.values(TimeInForce);
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
            if (timeInForce === void 0) { timeInForce = TimeInForce.GTC; }
            switch (type) {
                case OrderType.MARKET:
                    return _this.market(side, size);
                case OrderType.LIMIT:
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
            // Add Logic
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
            if (timeInForce === void 0) { timeInForce = TimeInForce.GTC; }
            var response = {
                done: [],
                partial: null,
                partialQuantityProcessed: 0,
                quantityLeft: size,
                err: null,
            };
            // Add logic
            return response;
        };
        this.bids = new OrderSide(Side.BUY);
        this.asks = new OrderSide(Side.SELL);
    }
    return OrderBook;
}());
export { OrderBook };
