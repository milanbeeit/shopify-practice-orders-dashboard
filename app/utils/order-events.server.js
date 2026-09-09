import { EventEmitter } from "node:events";

const globalForOrders = globalThis;

if (!globalForOrders.orderEvents) {
  globalForOrders.orderEvents = new EventEmitter();
}

export const orderEvents = globalForOrders.orderEvents;
