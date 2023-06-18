import createRBTree from "functional-red-black-tree";
import { Order, OrderUpdate, Side } from "./order";
import { Queue } from "./queue";
export declare class OrderSide {
  private _priceTree;
  private _prices;
  private _volume;
  private _total;
  private _numOrders;
  private _depthSide;
  private _side;
  constructor(side: Side);
  len: () => number;
  depth: () => number;
  volume: () => number;
  total: () => number;
  priceTree: () => createRBTree.Tree<number, Queue>;
  append: (order: Order) => Order;
  remove: (order: Order) => Order;
  update: (oldOrder: Order, orderUpdate: OrderUpdate) => Order | undefined;
  maxPriceQueue: () => Queue | undefined;
  minPriceQueue: () => Queue | undefined;
  lowerThan: (price: number) => Queue | undefined;
  greaterThan: (price: number) => Queue | undefined;
  orders: () => Order[];
  toString: () => string;
}
