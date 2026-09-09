import { authenticate } from "../shopify.server";
import { saveOrder } from "../utils/order.server";
import { orderEvents } from "../utils/order-events.server";

export const action = async ({ request }) => {
  const { payload } = await authenticate.webhook(request);

  const order = await saveOrder(payload);

  orderEvents.emit("order", order);

  return new Response();
};
