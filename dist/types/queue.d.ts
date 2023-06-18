import { Order } from "./order";
export declare class Queue {
  private _price;
  private _volume;
  private _orders;
  private _ordersMap;
  constructor(price: number);
  len: () => number;
  toArray: () => Order[];
  price: () => number;
  volume: () => number;
  head: () => Order | undefined;
  tail: () => Order | undefined;
  append: (order: Order) => Order;
  update: (oldOrder: Order, newOrder: Order) => void;
  remove: (order: Order) => void;
  updateOrderSize: (order: Order, newSize: number) => void;
}
