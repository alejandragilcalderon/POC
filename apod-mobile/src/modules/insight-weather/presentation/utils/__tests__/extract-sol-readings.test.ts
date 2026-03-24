import { extractSolReadings } from "@/modules/insight-weather/presentation/utils/extract-sol-readings";

describe("extractSolReadings", () => {
  it("parses a Sol block like NASA InSight JSON", () => {
    const payload = {
      sol_keys: ["675"],
      "675": {
        AT: { av: -62.314, ct: 177556, mn: -96.872, mx: -15.908 },
        HWS: { av: 7.233, ct: 88628, mn: 1.051, mx: 22.455 },
        PRE: { av: 750.563, ct: 887776, mn: 722.0901, mx: 768.791 },
        WD: {
          "0": { compass_degrees: 0, compass_point: "N", compass_right: 0, compass_up: 1 },
        },
        First_UTC: "2020-10-19T18:32:20Z",
        Last_UTC: "2020-10-20T19:11:55Z",
        Month_ordinal: 10,
        Season: "fall",
        Northern_season: "early winter",
        Southern_season: "early summer",
      },
    };

    const rows = extractSolReadings(payload);

    expect(rows).toHaveLength(1);
    expect(rows[0].sol).toBe("675");
    expect(rows[0].windCompass).toBe("N");
    expect(rows[0].tempC?.avg).toBe(-62.314);
    expect(rows[0].season).toBe("Fall");
    expect(rows[0].northernSeason).toBe("Early Winter");
    expect(rows[0].southernSeason).toBe("Early Summer");
  });

  it("falls back to numeric keys when sol_keys is missing", () => {
    const payload = {
      "42": {
        AT: { av: 1, mn: 0, mx: 2 },
      },
    };

    const rows = extractSolReadings(payload);
    expect(rows.map((r) => r.sol)).toEqual(["42"]);
  });
});
