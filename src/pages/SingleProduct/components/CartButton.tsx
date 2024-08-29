export const CartButton = () => {
  return (
    <div className="mt-10 ">
      <button
        className="btn btn-secondary btn-md"
        onClick={() => console.log("add to bag")}
      >
        Add to bag
      </button>
    </div>
  );
};
