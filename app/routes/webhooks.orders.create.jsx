import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { payload, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook from ${shop}`);

  const order = payload;

  const customerName = order.customer
    ? `${order.customer.first_name ?? ""} ${order.customer.last_name ?? ""}`.trim()
    : null;

  await db.order.upsert({
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

  console.log(`Order ${order.name} saved to database`);

  return new Response();
};
