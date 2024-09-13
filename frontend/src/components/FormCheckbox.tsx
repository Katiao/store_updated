type FormCheckboxProps = {
  label: string;
  name: string;
  defaultValue?: boolean;
  size: string;
};

export const FormCheckbox = ({
  label,
  name,
  defaultValue,
  size,
}: FormCheckboxProps) => {
  return (
    <div className="form-control items-center">
      <label htmlFor={name} className="label cursor-pointer">
        <span className="label-text capitalize">{label}</span>
      </label>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultValue}
        className={`checkbox checkbox-primary ${size}`}
      />
    </div>
  );
};
