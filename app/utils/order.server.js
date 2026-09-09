import db from "../db.server";

export async function saveOrder(order) {
  const customerName = order.customer
    ? `${order.customer.first_name ?? ""} ${order.customer.last_name ?? ""}`.trim()
    : null;

  return db.order.upsert({
    where: {
      shopifyOrderId: String(order.id),
    },

    update: {
      orderNumber: String(order.name ?? order.order_number),
      customerName,
      total: String(order.total_price),
      currency: order.currency,
      financialStatus: order.financial_status,
      fulfillmentStatus: order.fulfillment_status,
      cancelled: Boolean(order.cancelled_at),
    },

    create: {
      id: String(order.id),
      shopifyOrderId: String(order.id),
      orderNumber: String(order.name ?? order.order_number),
      customerName,
      total: String(order.total_price),
      currency: order.currency,
      financialStatus: order.financial_status,
      fulfillmentStatus: order.fulfillment_status,
      cancelled: Boolean(order.cancelled_at),
    },
  });
}
