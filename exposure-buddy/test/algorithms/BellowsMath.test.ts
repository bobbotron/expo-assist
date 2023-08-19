import { describe, expect, test } from "@jest/globals";
import { bellowsStopAdjustment } from "../../src/algorithms/BellowsMath";

describe("bellows math", () => {
  test("bellows adjustment factor", () => {
    expect(bellowsStopAdjustment(1, 1)).toBe(0);
    expect(bellowsStopAdjustment(1, 2)).toBe(2);
    expect(bellowsStopAdjustment(10, 40)).toBe(4);
  });
});
