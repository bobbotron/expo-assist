import React, { useState, useEffect } from "react";

import CurveDb, { calculateReciprocity } from "../data/CurveDB";
import Reciprocity from "../data/Reciprocity";
import "./ExposureCalculator.scss";

import {
  Accordion,
  AccordionContent,
  AccordionTitle,
  Form,
  Grid,
  Header,
  HeaderSubheader,
  Icon,
  Message,
  Segment,
  Table,
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
  const [reciprocityDetailExpanded, setReciprocityDetailExpanded] =
    useState(false);
  const [repoChartData, setRepoChartData] = useState([[0, ""]]);

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

  const createReadableTime = (n: number) => {
    const minutes = Math.floor(n / 60);
    const seconds = n - minutes * 60;

    return (
      (minutes > 0 ? minutes + " minutes, " : "") +
      seconds.toFixed(2) +
      " seconds"
    );
  };
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

      const totalAdjustedTime = calculateReciprocity(
        reciprocityCurve,
        filterAdjustedSeconds
      );

      setAdjustedExposure(createReadableTime(totalAdjustedTime));
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

  useEffect(() => {
    const repoData = [0, 1, 5, 10, 20, 60, 100].map((x) => [
      x,
      createReadableTime(calculateReciprocity(reciprocityCurve, x)),
    ]);

    setRepoChartData(repoData);
  }, [reciprocityCurve]);

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
              <Accordion>
                <AccordionTitle
                  active={reciprocityDetailExpanded}
                  onClick={() =>
                    setReciprocityDetailExpanded(!reciprocityDetailExpanded)
                  }
                >
                  <Icon name="dropdown" />
                  {reciprocityDetailExpanded ? "Hide" : "Show"} reciprocity
                  table
                </AccordionTitle>
                <AccordionContent active={reciprocityDetailExpanded}>
                  <Table celled>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Seconds</Table.HeaderCell>
                        <Table.HeaderCell>Adjusted Seconds</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {repoChartData.map((x) => (
                        <Table.Row key={x[0]}>
                          <Table.Cell>{x[0]}</Table.Cell>
                          <Table.Cell>{x[1]}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </AccordionContent>
              </Accordion>
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
