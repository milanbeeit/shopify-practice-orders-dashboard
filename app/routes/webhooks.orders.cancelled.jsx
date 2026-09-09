import { authenticate } from "../shopify.server";
import { saveOrder } from "../utils/order.server";

export const action = async ({ request }) => {
  const { payload, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook from ${shop}`);

  await saveOrder(payload);

  return new Response();
};
