import axios from "axios";

const devURL = "http://localhost:3000/api/v1";
// const productionUrl = "https://strapi-store-server.onrender.com/api";

export const customFetch = axios.create({
  baseURL: devURL,
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
