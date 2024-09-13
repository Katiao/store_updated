import axios from "axios";

const URL =
import.meta.env.VITE_API_URL ||
  "https://sustainable-fashion-store.onrender.com/api/v1";

export const customFetch = axios.create({
  baseURL: URL,
});

export const formatPrice = (price: string) => {
  const numericPrice = parseFloat(price);
  if (isNaN(numericPrice)) {
    throw new Error("Invalid price format");
  }

  const dollarsAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(numericPrice / 100);

  return dollarsAmount;
};

export const generateAmountOptions = (number: number) => {
  return Array.from({ length: number }, (_, index) => {
    const amount = index + 1;

    return (
      <option key={amount} value={amount}>
        {amount}
      </option>
    );
  });
};
