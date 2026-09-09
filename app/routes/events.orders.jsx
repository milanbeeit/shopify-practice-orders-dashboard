import { orderEvents } from "../utils/order-events.server";

export const loader = async ({ request }) => {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const sendOrder = (order) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(order)}\n\n`),
        );
      };

      orderEvents.on("order", sendOrder);

      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(": keep-alive\n\n"));
      }, 15000);

      request.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        orderEvents.off("order", sendOrder);

        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
