interface NumericInputProps {
  label: string;
  value: string;
  update: (s: string) => void;
}
const NumbericInput: React.FC<NumericInputProps> = ({
  label,
  value,
  update,
}) => (
  <>
    <label>
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
