import { useLoaderData, LoaderFunctionArgs } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../../features/cart/cartSlice";
import { formatPrice, customFetch } from "../../utils";
import { useState } from "react";

import type { Product, CartProduct } from "../../types";
import { CartButton, Amount, Breadcrumbs, ProductInfo } from "./components";
import { QueryClient } from "@tanstack/react-query";

const singleProductQuery = (id: string) => {
  return {
    queryKey: ["singleProduct", id],
    queryFn: () => customFetch.get(`/products/${id}`),
  };
};

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.id) {
      throw new Error("Product ID is not defined");
    }

    const response = await queryClient.ensureQueryData(
      singleProductQuery(params.id)
    );
    return { product: response.data.product };
  };

export const SingleProduct = () => {
  const { product } = useLoaderData() as { product: Product };
  const { image, title, price, description, company } = product;
  const dollarsAmount = formatPrice(price);

  const [amount, setAmount] = useState(1);
  const dispatch = useDispatch();

  const cartProduct: CartProduct = {
    // cart ID probably will not be needed anymore as I removed color
    cartID: product.productID,
    productID: product.productID,
    image,
    title,
    price,
    amount,
    company,
  };

  const addToCart = () => {
    dispatch(addItem({ product: cartProduct }));
  };

  const handleAmount = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAmount(parseInt(e.target.value));
  };

  return (
    <section>
      <Breadcrumbs />

      <div className="mt-6 grid gap-y-8 lg:grid-cols-2  lg:gap-x-16">
        <img
          src={image}
          alt={title}
          className="w-96 h-96 object-cover rounded-lg lg:w-full  "
        />
        <div>
          <ProductInfo
            title={title}
            company={company}
            dollarsAmount={dollarsAmount}
            description={description}
          />

          <Amount amount={amount} handleAmount={handleAmount} />

          <CartButton onButtonClick={addToCart} />
        </div>
      </div>
    </section>
  );
};
