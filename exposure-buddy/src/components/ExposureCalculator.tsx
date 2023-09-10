import React, { useState, useEffect } from "react";

import CurveDb from "../data/CurveDB";
import Reciprocity from "../data/Reciprocity";
import "./ExposureCalculator.scss";

import {
  Form,
  Grid,
  Header,
  HeaderSubheader,
  Message,
  Segment,
} from "semantic-ui-react";
import NumbericInput from "./NumericInput";
import { bellowsStopAdjustment } from "../algorithms/BellowsMath";

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
  const [focalLength, setFocalLength] = useState("1");
  const [bellowsLength, setBellowsLength] = useState("1");
  const [exposureComp, setExposureComp] = useState("");
  const [filterStops, setFilterStops] = useState("0");
  const [baseExposureSeconds, setBaseExposureSecondes] = useState("");
  const [reciprocityCurve, setReciprocityCurve] = useState<Reciprocity>("none");
  const [adjustedExposure, setAdjustedExposure] = useState("-");

  useEffect(() => {
    if (validNumber(focalLength) && validNumber(bellowsLength)) {
      const fl: number = Number(focalLength);
      const bl: number = Number(bellowsLength);
      if (fl > 0 && bl > 0 && bl >= fl) {
        const stops: number = bellowsStopAdjustment(fl, bl);
        setExposureComp("+ " + stops.toFixed(2) + " stop(s)");
      } else {
        setExposureComp("0 stops");
      }
    } else {
      setExposureComp("-");
    }
  }, [focalLength, bellowsLength]);

  useEffect(() => {
    if (!validNumber(filterStops)) {
      setFilterStops("0");
    } else {
      const fil: number = Number(filterStops);
      if (fil < 0) {
        setFilterStops("0");
      }
    }
  }, [filterStops]);

  useEffect(() => {
    if (
      [focalLength, bellowsLength, baseExposureSeconds, filterStops].every(
        validNumber
      )
    ) {
      const fl: number = Number(focalLength);
      const bl: number = Number(bellowsLength);
      const fil: number = Number(filterStops);
      const seconds = parseFloat(baseExposureSeconds);
      const stops: number =
        fl > 0 && bl > 0 && bl >= fl ? Math.log2(Math.pow(bl / fl, 2.0)) : 0;
      const bellowsAdjustedSeconds = seconds * Math.pow(2, stops);
      const filterAdjustedSeconds = bellowsAdjustedSeconds * Math.pow(2, fil);
      const curve = CurveDb[reciprocityCurve];

      const totalAdjustedTime = curve.curve(filterAdjustedSeconds);
      const bellowsMinutes = Math.floor(totalAdjustedTime / 60);
      const bellowSeconds = totalAdjustedTime - bellowsMinutes * 60;
      setAdjustedExposure(
        (bellowsMinutes > 0 ? bellowsMinutes + " minutes, " : "") +
          bellowSeconds.toFixed(2) +
          " seconds"
      );
    } else {
      setAdjustedExposure("-");
    }
  }, [
    focalLength,
    bellowsLength,
    baseExposureSeconds,
    filterStops,
    reciprocityCurve,
  ]);

  return (
    <div className="expo-calc-component">
      <Grid
        textAlign="left"
        centered={true}
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Exposure Buddy
            <HeaderSubheader
              style={{ paddingLeft: "14px", paddingRight: "14px" }}
            >
              Simple calculator for bellows exposure related calculations
            </HeaderSubheader>
          </Header>
          <Form size="large">
            <Segment stacked>
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

              <Message
                // icon='inbox'
                header="Bellows Exposure Comp"
                content={<>{exposureComp}</>}
                size="large"
              />
              <NumbericInput
                label="ND Filter Stops"
                value={filterStops}
                update={setFilterStops}
              />
              <NumbericInput
                label="Base Exposure (seconds)"
                value={baseExposureSeconds}
                update={setBaseExposureSecondes}
              />
              <Form.Field
                label="Reciprocity Curve"
                control="select"
                value={reciprocityCurve}
                onChange={(e: any) =>
                  setReciprocityCurve(e.target.value as Reciprocity)
                }
              >
                {Object.keys(CurveDb).map((key, index) => (
                  <option value={key} key={key}>
                    {CurveDb[key as Reciprocity].name}
                  </option>
                ))}
              </Form.Field>

              <Message
                // icon='inbox'
                header="Corrected Exposure"
                content={<>{adjustedExposure}</>}
                size="large"
              />
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default ExposureCalculator;
