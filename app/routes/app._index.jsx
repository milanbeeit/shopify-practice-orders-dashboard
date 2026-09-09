import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import db from "../db.server";

export const loader = async () => {
  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return { orders };
};

export default function Index() {
  const { orders: initialOrders } = useLoaderData();
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    const eventSource = new EventSource("/events/orders");

    eventSource.onmessage = (event) => {
      const incomingOrder = JSON.parse(event.data);

      setOrders((currentOrders) => {
        const exists = currentOrders.some(
          (order) => order.id === incomingOrder.id,
        );

        if (exists) {
          return currentOrders.map((order) =>
            order.id === incomingOrder.id ? incomingOrder : order,
          );
        }

        return [incomingOrder, ...currentOrders];
      });
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const getStatus = (order) => {
    if (order.cancelled) {
      return "Cancelled";
    }

    if (order.fulfillmentStatus === "fulfilled") {
      return "Fulfilled";
    }

    if (order.financialStatus === "paid") {
      return "Paid";
    }

    return order.financialStatus || "Pending";
  };

  return (
    <s-page heading="Orders Dashboard">
      <s-section>
        {orders.length === 0 ? (
          <s-paragraph>No orders yet.</s-paragraph>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={headerStyle}>Order</th>
                  <th style={headerStyle}>Customer</th>
                  <th style={headerStyle}>Total</th>
                  <th style={headerStyle}>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  return (
                    <tr key={order.id}>
                      <td style={cellStyle}>{order.orderNumber}</td>

                      <td style={cellStyle}>
                        {order.customerName || "No customer"}
                      </td>

                      <td style={cellStyle}>
                        {order.total} {order.currency}
                      </td>

                      <td style={cellStyle}>{getStatus(order)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </s-section>
    </s-page>
  );
}

const headerStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ddd",
};

const cellStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};
