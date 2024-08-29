import { generateAmountOptions } from "../../../utils";

type AmountProps = {
  amount: number;
  handleAmount: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const Amount = ({ amount, handleAmount }: AmountProps) => {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <h4 className="text-md font-medium tracking-wider capitalize">
          amount
        </h4>
      </label>
      <select
        className="select select-secondary select-bordered select-md"
        value={amount}
        onChange={handleAmount}
      >
        {generateAmountOptions(10)}
      </select>
    </div>
  );
};
