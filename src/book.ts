import { Order, OrderType, OrderUpdate, TimeInForce, Side } from "./order";
import { Queue } from "./queue";
import { OrderSide } from "./side";

/**
 * This interface represents the result of a processed order or an error
 *
 * @param done - An array of orders fully filled by the processed order
 * @param partial - A partially executed order. It can be null when the processed order
 * @param partialQuantityProcessed - if `partial` is not null, this field represents the processed quantity of the partial order
 * @param quantityLeft - more than zero if there are not enought orders to process all quantity
 * @param err - Not null if size or price are less or equal zero, or the provided orderId already exists, or something else went wrong.
 */
interface IProcessOrder {
  done: Order[];
  partial: Order | null;
  partialQuantityProcessed: number;
  quantityLeft: number;
  err: Error | null;
}

const vaidTimeInForce = Object.values(TimeInForce);

export class OrderBook {
  private orders: { [key: string]: Order } = {};
  private bids: OrderSide;
  private asks: OrderSide;
  constructor() {
    this.bids = new OrderSide(Side.BUY);
    this.asks = new OrderSide(Side.SELL);
  }

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
  public createOrder = (
    // common for all order types
    type: OrderType,
    side: Side,
    size: number,
    // Specific for limit order type
    price?: number,
    orderID?: string,
    timeInForce: TimeInForce = TimeInForce.GTC
  ): IProcessOrder => {
    switch (type) {
      case OrderType.MARKET:
        return this.market(side, size);
      case OrderType.LIMIT:
        return this.limit(
          side,
          orderID as string,
          size,
          price as number,
          timeInForce
        );
      default:
        return {
          done: [],
          partial: null,
          partialQuantityProcessed: 0,
          quantityLeft: size,
          err: new Error(
            "orderbook: supported order type are 'limit' and 'market'"
          ),
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
  public market = (side: Side, size: number): IProcessOrder => {
    const response: IProcessOrder = {
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
  public limit = (
    side: Side,
    orderID: string,
    size: number,
    price: number,
    timeInForce: TimeInForce = TimeInForce.GTC
  ): IProcessOrder => {
    const response: IProcessOrder = {
      done: [],
      partial: null,
      partialQuantityProcessed: 0,
      quantityLeft: size,
      err: null,
    };

    // Add logic

    return response;
  };
}
