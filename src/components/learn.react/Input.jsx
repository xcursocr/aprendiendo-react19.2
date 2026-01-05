import { useId } from "react";

export function Input() {
    // useId es un hook introducido en React 18 que sirve para generar identificadores (IDs) únicos y estables.
     const ageInputId = useId();
     console.log(ageInputId)
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Default Value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true} 
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}