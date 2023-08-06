import { Text } from "react-native";
import { useState, useEffect } from "react";
import { TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

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

type ReciprocityCurves = "foma100" | "foma200" | "tmax100" | "none";

// https://www.magnaimages.com/post/foma-fomapan-100-reciprocity-failure-charts
// https://www.flickr.com/photos/janokelly/6804638225/
const curveDb = {
  foma100: (n: number): number =>
    n * (Math.pow(Math.log10(n), 2) + 5 * Math.log10(n) + 2),
  foma200: (n: number): number =>
    n * (1.5 * Math.pow(Math.log10(n), 2) + 4.5 * Math.log10(n) + 3),
  tmax100: (n: number): number =>
    n * ((1 / 6) * Math.pow(Math.log10(n), 2) + 4 / 3),
  none: (n: number): number => n,
};

const ExposureCalculator = () => {
  const [focalLength, setFocalLength] = useState("200");
  const [bellowsLength, setBellowsLength] = useState("");
  const [exposureComp, setExposureComp] = useState("");
  const [baseExposureSeconds, setBaseExposureSecondes] = useState("");
  const [reciprocityCurve, setReciprocityCurve] =
    useState<ReciprocityCurves>("tmax100");
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
      const curve = curveDb[reciprocityCurve];

      setAdjustedExposure(curve(bellowsAdjustedSeconds).toFixed(2) + " seconds");
      /**
       * Check all data is good
       * Calculate exposure comp
       */
    } else {
      setAdjustedExposure("-");
    }
  }, [focalLength, bellowsLength, baseExposureSeconds, reciprocityCurve]);
  return (
    <>
      <TextInput
        label="Focal Length"
        value={focalLength}
        onChangeText={(text) => setFocalLength(text)}
      />
      <TextInput
        label="Bellows Draw"
        value={bellowsLength}
        onChangeText={(text) => setBellowsLength(text)}
      />

      <TextInput label="Exposure Comp" value={exposureComp} disabled={true} />

      <TextInput
        label="Base Exposure (seconds)"
        value={baseExposureSeconds}
        placeholder="Exposure in seconds before correction"
        onChangeText={(text) => setBaseExposureSecondes(text)}
      />

      <Picker
        selectedValue={reciprocityCurve}
        onValueChange={(itemValue, itemIndex) => setReciprocityCurve(itemValue)}
      >
        <Picker.Item label="Foma 100" value="foma100" />
        <Picker.Item label="Foma 200" value="foma200" />
        <Picker.Item label="TMax100" value="tmax100" />
        <Picker.Item label="None" value="none" />
      </Picker>

      <TextInput
        label="Adjusted Exposure"
        value={adjustedExposure}
        disabled={true}
      />
    </>
  );
};

export default ExposureCalculator;
