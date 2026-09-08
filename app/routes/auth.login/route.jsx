import { Form, useActionData, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const loader = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));

  return { errors };
};

export const action = async ({ request }) => {
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();

  const shop = formData.get("shop");

  console.log("SHOP FROM FORM:", shop);
  console.log("REQUEST URL:", request.url);
  console.log("REQUEST CONTENT TYPE:", request.headers.get("content-type"));

  const result = await login(request);

  console.log("LOGIN RESULT:", result);

  const errors = loginErrorMessage(result);

  return { errors };
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();

  const { errors } = actionData || loaderData;

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "80px auto",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "24px" }}>Log in</h1>

      <Form method="post">
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="shop"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Shop domain
          </label>

          <input
            id="shop"
            name="shop"
            type="text"
            placeholder="example.myshopify.com"
            autoComplete="on"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxSizing: "border-box",
            }}
          />

          {errors?.shop && (
            <p
              style={{
                marginTop: "8px",
                color: "red",
              }}
            >
              {errors.shop}
            </p>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: "12px 20px",
            border: 0,
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Log in
        </button>
      </Form>
    </div>
  );
}
