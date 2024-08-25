type FormInputProps = {
  label: string;
  name: string;
  type: string;
  defaultValue?: string;
};

export const FormInput = ({
  label,
  name,
  type,
  defaultValue,
}: FormInputProps) => {
  return (
    <div className="form-control ">
      <label className="label">
        <span className="label-text capitalize">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className="input input-bordered "
      />
    </div>
  );
};
