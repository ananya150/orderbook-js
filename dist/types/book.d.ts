import { Order, OrderType, OrderUpdate, TimeInForce, Side } from "./order";
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
export declare class OrderBook {
  private orders;
  private bids;
  private asks;
  constructor();
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
  createOrder: (
    type: OrderType,
    side: Side,
    size: number,
    price?: number,
    orderID?: string,
    timeInForce?: TimeInForce
  ) => IProcessOrder;
  /**
   * Create a market order
   *  @see {@link IProcessOrder} for the returned data structure
   *
   * @param side - `sell` or `buy`
   * @param size - How much of currency you want to trade in units of base currency
   * @returns An object with the result of the processed order or an error
   */
  market: (side: Side, size: number) => IProcessOrder;
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
  limit: (
    side: Side,
    orderID: string,
    size: number,
    price: number,
    timeInForce?: TimeInForce
  ) => IProcessOrder;
  /**
   * Modify an existing order with given ID
   *
   * @param orderID - The ID of the order to be modified
   * @param orderUpdate - An object with the modified size and/or price of an order. To be note that the `side` can't be modified. The shape of the object is `{side, size, price}`.
   * @returns The modified order if exists or `undefined`
   */
  modify: (
    orderID: string,
    orderUpdate: OrderUpdate
  ) => Order | undefined | void;
  /**
   * Remove an existing order with given ID from the order book
   *
   * @param orderID - The ID of the order to be removed
   * @returns The removed order if exists or `undefined`
   */
  cancel: (orderID: string) => Order | undefined;
  /**
   * Get an existing order with the given ID
   *
   * @param orderID - The ID of the order to be returned
   * @returns The order if exists or `undefined`
   */
  order: (orderID: string) => Order | undefined;
  depth: () => [[number, number][], [number, number][]];
  toString: () => string;
  calculateMarketPrice: (
    side: Side,
    size: number
  ) => {
    price: number;
    err: null | Error;
  };
  private greaterThanOrEqual;
  private lowerThanOrEqual;
  private processQueue;
  private canFillOrder;
  private buyOrderCanBeFilled;
  private sellOrderCanBeFilled;
}
export {};
