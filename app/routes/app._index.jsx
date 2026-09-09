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
  const { orders } = useLoaderData();

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
                  const status = order.cancelled
                    ? "Cancelled"
                    : order.fulfillmentStatus ||
                      order.financialStatus ||
                      "Unknown";

                  return (
                    <tr key={order.id}>
                      <td style={cellStyle}>{order.orderNumber}</td>

                      <td style={cellStyle}>
                        {order.customerName || "No customer"}
                      </td>

                      <td style={cellStyle}>
                        {order.total} {order.currency}
                      </td>

                      <td style={cellStyle}>{status}</td>
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
