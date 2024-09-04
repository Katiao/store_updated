export const CartButton = ({
  onButtonClick,
}: {
  onButtonClick: () => void;
}) => {
  return (
    <div className="mt-10 ">
      <button className="btn btn-secondary btn-md" onClick={onButtonClick}>
        Add to cart
      </button>
    </div>
  );
};
