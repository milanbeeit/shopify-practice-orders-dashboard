export const loader = async () => {
  return null;
};

export const action = async () => {
  return new Response("LOGIN ACTION WORKS", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

export default function Auth() {
  return (
    <div style={{ padding: 40 }}>
      <h1>AUTH TEST VERSION 12345</h1>

      <form method="post">
        <input
          name="shop"
          defaultValue="practicestore-jv2xvjm6.myshopify.com"
        />

        <button type="submit">Test POST</button>
      </form>
    </div>
  );
}
