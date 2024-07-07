import React, { useState } from "react";
import {
  Form,
  Grid,
  Header,
  HeaderSubheader,
  Segment,
  Table,
} from "semantic-ui-react";

const evValues = [
  ["", "Select EV value"],
  ["-6", "Night, away from city lights, subject under starlight only."],
  ["-5", "Night, away from city lights, subject under crescent moon."],
  [
    "-4",
    "Night, away from city lights, subject under half moon. Meteors (during showers, with time exposure).",
  ],
  ["-3", "Night, away from city lights, subject under full moon."],
  ["-2", "Night, away from city lights, snowscape under full moon."],
  ["-1", "Subjects lit by dim ambient artificial light."],
  ["0", "Subjects lit by dim ambient artificial light."],
  ["1", "Distant view of lighted skyline."],
  ["2", "Lightning (with time exposure). Total eclipse of moon."],
  ["3", "Fireworks (with time exposure)."],
  [
    "4",
    "Candle lit close-ups. Christmas lights, floodlit buildings, fountains, and monuments. Subjects under bright street lamps.",
  ],
  [
    "5",
    "Night home interiors, average light. School or church auditoriums. Subjects lit by campfires or bonfires.",
  ],
  ["6", "Brightly lit home interiors at night. Fairs, amusement parks."],
  [
    "7",
    "Bottom of rainforest canopy. Brightly lighted nighttime streets. Indoor sports. Stage shows, circuses.",
  ],
  [
    "8",
    "Las Vegas or Times Square at night. Store windows. Campfires, bonfires, burning buildings. Ice shows, football, baseball etc. at night. Interiors with bright florescent lights.",
  ],
  [
    "9",
    "Landscapes, city skylines 10 minutes after sunset. Neon lights, spotlighted subjects.",
  ],
  [
    "10",
    "Landscapes and skylines immediately after sunset. Crescent moon (long lens).",
  ],
  ["11", "Sunsets. Subjects in open shade."],
  ["12", "Half moon (long lens). Subject in heavy overcast."],
  [
    "13",
    "Gibbous moon (long lens). Subjects in cloudy-bright light (no shadows).",
  ],
  ["14", "Full moon (long lens). Subjects in weak, hazy sun."],
  ["15", "Subjects in bright or hazy sun (Sunny f/16 rule)."],
  ["16", "Subjects in bright daylight on sand or snow."],
  ["17", "Rarely encountered in nature. Some man made lighting."],
  ["18", "Rarely encountered in nature. Some man made lighting."],
  ["19", "Rarely encountered in nature. Some man made lighting."],
  ["20", "Rarely encountered in nature. Some man made lighting."],
  ["21", "Rarely encountered in nature. Some man made lighting."],
  ["22", "Extremely bright. Rarely encountered in nature."],
];

const ISORange = Array.from({ length: 10 }, (value, key) => key).map(
  (x, index) => 25 * Math.pow(2, x)
);
const apertureRange =
  ", f/1, f/1.4, f/2, f/2.8, f/4, f/5.6, f/8, f/11, f/16, f/22".split(", ");

const shutterLookup = [
  "512m",
  "256m",
  "128m",
  "64m",
  "32m",
  "16m", // EV 1 f/22 ISO 25
  "8m",
  "4m",
  "2m",
  "60s",
  "30s",
  "15s",
  "8s",
  "4s",
  "2s",
  "1s",
  "1/2s",
  "1/4s",
  "1/8s",
  "1/15s",
  "1/30s",
  "1/60s",
  "1/125s",
  "1/250s",
  "1/500s",
  "1/1000s",
  "1/2000s",
  "1/4000s",
  "1/8000s",
  "1/1600s",
  "1/3200s",
];

function shutterSpeedLookup(
  aperture: string,
  evVal: number,
  isoVal: number
): any {
  const apertureOffset = apertureRange.indexOf(aperture);
  const evOffset = evVal - 1 + Math.log2(isoVal / 25) - apertureOffset + 15;
  return shutterLookup[evOffset];
  // return (
  //   (aperture * aperture) /
  //   Math.pow(2, evVal + Math.log2(isoVal / 100.0))
  // ).toFixed(2);
}

function calculateEvChart(evVal: number, isoVal: number, aperture: string) {
  if (aperture === "") {
    const validApertures = apertureRange.slice(1);
    return [
      validApertures,
      validApertures.map((aperture) =>
        shutterSpeedLookup(aperture, evVal, isoVal)
      ),
    ];
  } else {
    return [[aperture], [String(shutterSpeedLookup(aperture, evVal, isoVal))]];
  }
}

const EvCalculator: React.FC = () => {
  const [evVal, setEvVal] = useState("");
  const [isoVal, setIsoVal] = useState(ISORange[2]);
  const [aperture, setAperture] = useState("");

  const evSet = evVal !== "";
  const tableData = evSet
    ? calculateEvChart(Number(evVal), isoVal, aperture)
    : undefined;
  return (
    <>
      <Grid
        textAlign="left"
        centered={true}
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: "90%" }}>
          <Header as="h2" color="teal" textAlign="center">
            Exposure Value Assist
            <HeaderSubheader
              style={{ paddingLeft: "14px", paddingRight: "14px" }}
            >
              Simple calculator getting ballpark exposure settings for scenes
            </HeaderSubheader>
          </Header>
          <Form size="large">
            <Segment stacked>
              <Form.Field
                label="Scene Brightness/Exposure"
                control="select"
                value={evVal}
                onChange={(e: any) => setEvVal(e.target.value)}
              >
                {evValues.map((key, index) => (
                  <option value={key[0]} key={key[0]}>
                    EV {key[0]} - {key[1]}
                  </option>
                ))}
              </Form.Field>

              <Form.Field
                label="ISO"
                control="select"
                value={isoVal}
                onChange={(e: any) => setIsoVal(e.target.value)}
              >
                {ISORange.map((key, index) => (
                  <option value={key} key={key}>
                    {key}
                  </option>
                ))}
              </Form.Field>

              <Form.Field
                label="Aperture"
                control="select"
                value={aperture}
                onChange={(e: any) => setAperture(e.target.value)}
              >
                {apertureRange.map((key, index) => (
                  <option value={key} key={key}>
                    {key}
                  </option>
                ))}
              </Form.Field>
            </Segment>
          </Form>
          {tableData && tableData.length > 1 && (
            <>
              <Table>
                <Table.Header>
                  <Table.Row>
                    {tableData[0] &&
                      tableData[0].map((cell, idx) => (
                        <Table.HeaderCell key={idx}>{cell}</Table.HeaderCell>
                      ))}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    {tableData[1] &&
                      tableData[1].map((cell, idx) => (
                        <Table.Cell key={idx}>{cell}</Table.Cell>
                      ))}
                  </Table.Row>
                </Table.Body>
              </Table>
            </>
          )}
        </Grid.Column>
      </Grid>
    </>
  );
};

export default EvCalculator;
