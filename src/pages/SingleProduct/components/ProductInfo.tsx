type ProductInfoProps = {
  title: string;
  company: string;
  dollarsAmount: string;
  description: string;
};

export const ProductInfo = ({
  title,
  company,
  dollarsAmount,
  description,
}: ProductInfoProps) => {
  return (
    <>
      <h1 className="capitalize text-3xl font-bold">{title}</h1>
      <h4 className="text-xl text-neutral-content font-bold mt-2">{company}</h4>

      <p className="mt-3 text-xl">{dollarsAmount}</p>

      <p className="mt-6 leading-8">{description}</p>
    </>
  );
};
