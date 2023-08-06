import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { TextInput } from "react-native-paper";

import CurveDb from "../data/CurveDB";
import Reciprocity from "../data/Reciprocity";
import DropDown from "react-native-paper-dropdown";

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
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
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
        curve(bellowsAdjustedSeconds).toFixed(2) + " seconds"
      );
    } else {
      setAdjustedExposure("-");
    }
  }, [focalLength, bellowsLength, baseExposureSeconds, reciprocityCurve]);

  const style = StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      alignItems: "stretch",
      justifyContent: "center",
      verticalAlign: "top",
      flexGrow: 1,
      width: "75%",
    },
    header: {
      fontSize: 16,
      paddingBottom: 10,
      fontWeight: "600",
    },
    text: { marginBottom: 10 },
  });

  return (
    <View style={style.container}>
      <Text style={style.header}>Exposure Buddy</Text>
      <TextInput
        label="Focal Length"
        value={focalLength}
        style={style.text}
        onChangeText={(text) => setFocalLength(text)}
      />
      <TextInput
        label="Bellows Draw"
        value={bellowsLength}
        style={style.text}
        onChangeText={(text) => setBellowsLength(text)}
      />

      <TextInput
        label="Bellows Exposure Comp"
        style={style.text}
        value={exposureComp}
        disabled={true}
      />

      <TextInput
        label="Base Exposure (seconds)"
        value={baseExposureSeconds}
        style={style.text}
        placeholder="Exposure in seconds before correction"
        onChangeText={(text) => setBaseExposureSecondes(text)}
      />

      <DropDown
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
      ></DropDown>

      <TextInput
        label="Adjusted Exposure"
        style={{ ...style.text, marginTop: 10 }}
        value={adjustedExposure}
        disabled={true}
      />
    </View>
  );
};

export default ExposureCalculator;
