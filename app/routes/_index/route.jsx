import { redirect, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import styles from "./styles.module.css";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Shopify Orders Dashboard</h1>

        <p className={styles.text}>
          Enter your Shopify store domain to open the application.
        </p>

        {showForm && (
          <form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>

              <input
                className={styles.input}
                type="text"
                name="shop"
                placeholder="example.myshopify.com"
                required
              />

              <span>e.g. my-shop-domain.myshopify.com</span>
            </label>

            <button className={styles.button} type="submit">
              Log in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
