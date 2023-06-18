import { Order } from "./order";
import Denque from "denque";

export class Queue {
  private _price: number;
  private _volume: number;
  private _orders: Denque<Order>;
  private _ordersMap: { [key: string]: number } = {};

  constructor(price: number) {
    this._price = price;
    this._volume = 0;
    this._orders = new Denque<Order>();
  }

  // returns number of orders
  len = (): number => {
    return this._orders.length;
  };

  // returns orders as an array
  toArray = (): Order[] => {
    return this._orders.toArray();
  };

  // returns price level of queue
  price = (): number => {
    return this._price;
  };

  // returns total volume of orders in queue
  volume = (): number => {
    return this._volume;
  };

  // return top order of queue
  head = (): Order | undefined => {
    return this._orders.peekFront();
  };

  // return bottom order of queue
  tail = (): Order | undefined => {
    return this._orders.peekBack();
  };

  // adds order to tail of the queue
  append = (order: Order): Order => {
    this._volume += order.size;
    this._orders.push(order);
    this._ordersMap[order.id] = this._orders.length - 1;
    return order;
  };

  // sets up new order to list value
  update = (oldOrder: Order, newOrder: Order) => {
    this._volume -= oldOrder.size;
    this._volume += newOrder.size;
    // Remove old order from head
    this._orders.shift();
    delete this._ordersMap[oldOrder.id];
    // Add new order to head
    this._orders.unshift(newOrder);
    this._ordersMap[newOrder.id] = 0;
  };

  // remove order from queue
  remove = (order: Order) => {
    this._volume -= order.size;
    const deletedOrderIndex = this._ordersMap[order.id];
    this._orders.removeOne(deletedOrderIndex);
    delete this._ordersMap[order.id];
    // Update all orders indexes where index is greater than the deleted one
    for (const orderId in this._ordersMap) {
      if (Object.prototype.hasOwnProperty.call(this._ordersMap, orderId)) {
        if (this._ordersMap[orderId] > deletedOrderIndex) {
          this._ordersMap[orderId] -= 1;
        }
      }
    }
  };

  updateOrderSize = (order: Order, newSize: number) => {
    this._volume += newSize - order.size; // update volume
    order.size = newSize;
    order.time = Date.now();
  };
}
