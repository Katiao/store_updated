import { useLoaderData, LoaderFunctionArgs } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../../features/cart/cartSlice";
import { formatPrice, customFetch } from "../../utils";
import { useState } from "react";

import type { Product, CartProduct } from "../../types";
import { CartButton, Amount, Breadcrumbs, ProductInfo } from "./components";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const response = await customFetch(`/products/${params.id}`);
  return { product: response.data.data };
};

export const SingleProduct = () => {
  const { product } = useLoaderData() as { product: Product };
  const { image, title, price, description, company } = product.attributes;
  const dollarsAmount = formatPrice(price);

  const [amount, setAmount] = useState(1);
  const dispatch = useDispatch();

  const cartProduct: CartProduct = {
    // cart ID probably will not be needed anymore as I removed color
    cartID: product.id,
    productID: product.id,
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
