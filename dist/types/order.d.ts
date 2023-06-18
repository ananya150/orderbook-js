export declare enum Side {
  BUY = "buy",
  SELL = "sell",
}
export declare enum OrderType {
  LIMIT = "limit",
  MARKET = "market",
}
export declare enum TimeInForce {
  GTC = "GTC",
  IOC = "IOC",
  FOK = "FOK",
}
export interface OrderUpdate {
  size: number;
  price: number;
  side: Side;
}
export declare class Order {
  private _id;
  private _side;
  private _size;
  private _price;
  private _time;
  private _isMaker;
  constructor(
    orderId: string,
    side: Side,
    size: number,
    price: number,
    time?: number,
    isMaker?: boolean
  );
  get id(): string;
  get side(): Side;
  get price(): number;
  get size(): number;
  set size(size: number);
  get time(): number;
  set time(time: number);
  get isMaker(): boolean;
  toString: () => string;
  toJSON: () => string;
  toObject: () => {
    id: string;
    side: Side;
    size: number;
    price: number;
    time: number;
    isMaker: boolean;
  };
}
