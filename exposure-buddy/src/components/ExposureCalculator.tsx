import { useState, useEffect } from "react";

import CurveDb from "../data/CurveDB";
import Reciprocity from "../data/Reciprocity";
import NumbericInput from "./NumericInput";
import './ExposureCalculator.css';

const validNumber = (val: string | undefined): boolean => {
  if (val === undefined) {
    return false;
  }

  const n = Number(val);
  return (
    !isNaN(n) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(val))
  );
};

const ExposureCalculator = () => {
  const [focalLength, setFocalLength] = useState("200");
  const [bellowsLength, setBellowsLength] = useState("");
  const [exposureComp, setExposureComp] = useState("");
  const [baseExposureSeconds, setBaseExposureSecondes] = useState("");
  const [reciprocityCurve, setReciprocityCurve] = useState<Reciprocity>("none");
  const [adjustedExposure, setAdjustedExposure] = useState("-");

  useEffect(() => {
    if (validNumber(focalLength) && validNumber(bellowsLength)) {
      const fl: number = Number(focalLength);
      const bl: number = Number(bellowsLength);
      if (fl > 0 && bl > 0 && bl >= fl) {
        const stops: number = Math.log2(Math.pow(bl / fl, 2.0));
        setExposureComp("+ " + stops.toFixed(2) + " stop(s)");
      } else {
        setExposureComp("0 stops");
      }
    } else {
      setExposureComp("-");
    }
  }, [focalLength, bellowsLength]);

  useEffect(() => {
    if ([focalLength, bellowsLength, baseExposureSeconds].every(validNumber)) {
      const fl: number = Number(focalLength);
      const bl: number = Number(bellowsLength);
      const seconds = parseFloat(baseExposureSeconds);
      const stops: number =
        fl > 0 && bl > 0 && bl >= fl ? Math.log2(Math.pow(bl / fl, 2.0)) : 0;
      const bellowsAdjustedSeconds = seconds * Math.pow(2, stops);
      const curve = CurveDb[reciprocityCurve];

      setAdjustedExposure(
        curve.curve(bellowsAdjustedSeconds).toFixed(2) + " seconds"
      );
    } else {
      setAdjustedExposure("-");
    }
  }, [focalLength, bellowsLength, baseExposureSeconds, reciprocityCurve]);


  return (
    <div className="exposure-calc">
      <h3>Exposure Buddy</h3>
      <NumbericInput
        label="Focal Length"
        value={focalLength}
        update={setFocalLength}
      />

      <NumbericInput
        label="Bellows Length"
        value={bellowsLength}
        update={setBellowsLength}
      />

      <label>
        Bellows Exposure Comp
        <input type="text" value={exposureComp} disabled={true} />
      </label>
      <br />

      <NumbericInput
        label="Base Exposure (seconds)"
        value={baseExposureSeconds}
        update={setBaseExposureSecondes}
      />

      <label>
        Reciprocity Curve
        <select
          value={reciprocityCurve}
          onChange={(e) => setReciprocityCurve(e.target.value as Reciprocity)}
          
        >
          {Object.keys(CurveDb).map((key, index) => (
            <option value={key} key={key}>
              {key}
            </option>
          ))}
        </select>
      </label>
      <br />
      {/* <DropDown
        label="Reciprocity Curve / Film"
        mode={"outlined"}
        dropDownStyle={style.text}
        visible={showDropDown}
        showDropDown={() => setShowDropDown(true)}
        onDismiss={() => setShowDropDown(false)}
        value={reciprocityCurve}
        setValue={setReciprocityCurve}
        list={[
          { label: "Foma 100", value: "foma100" },
          { label: "Foma 200", value: "foma200" },
          { label: "TMax 100", value: "tmax100" },
          { label: "TMax 400", value: "tmax400" },
          { label: "Fujicolor 100", value: "fujicolor100" },
          { label: "None", value: "none" },
        ]}
      ></DropDown> */}
      <label>
        Corrected Exposure
        <input type="text" value={adjustedExposure} disabled={true} />
      </label>
    </div>
  );
};

export default ExposureCalculator;