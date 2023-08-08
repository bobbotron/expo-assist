interface NumericInputProps {
  label: string;
  value: string;
  update: (s: string) => void;
  labelClass?: string;
}
const NumbericInput: React.FC<NumericInputProps> = ({
  label,
  value,
  update,
  labelClass,
}) => (
  <>
    <label className={labelClass}>
      {label}{" "}
      <input
        type="number"
        value={value}
        onChange={(text) => update(text.target.value)}
      />
    </label>
    <br />
  </>
);

export default NumbericInput;
