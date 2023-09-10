import { Form, Icon } from "semantic-ui-react";

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
      iconPosition="left"
      placeholder={label}
      value={value}
      onChange={onChangeHandler(update)}
    >
      <Icon name="sliders horizontal" />
      <input inputMode="decimal" pattern="\d*" type="text" />
    </Form.Input>
  </>
);

export default NumbericInput;
