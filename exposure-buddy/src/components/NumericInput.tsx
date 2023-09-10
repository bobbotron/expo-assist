import { Form } from "semantic-ui-react";

interface NumericInputProps {
  label: string;
  value: string;
  update: (s: string) => void;
}
const onChangeHandler =
  (handler: any) => (e: React.ChangeEvent<HTMLInputElement>) =>
    handler(e.target.value);

const NumbericInput: React.FC<NumericInputProps> = ({
  label,
  value,
  update,
}) => (
  <>
    <Form.Input
      fluid
      label={label}
      labelPosition="left"
      icon="sliders horizontal"
      iconPosition="left"
      placeholder={label}
      value={value}
      inputmode="numeric"
      pattern="[0-9]*"
      type="text"
      onChange={onChangeHandler(update)}
    />
  </>
);

export default NumbericInput;
