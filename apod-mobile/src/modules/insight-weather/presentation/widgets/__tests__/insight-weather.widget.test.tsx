import { render, screen } from "@testing-library/react-native";
import { InsightWeatherWidget } from "@/modules/insight-weather/presentation/widgets/insight-weather.widget";
import { strings } from "@/shared/resources";

describe("InsightWeatherWidget", () => {
  it("renders Sol weather cards on success", () => {
    render(
      <InsightWeatherWidget
        state={{
          status: "success",
          data: {
            sol_keys: ["675"],
            "675": {
              AT: { av: -10, mn: -20, mx: 0 },
              Season: "fall",
            },
          },
        }}
        onRefresh={jest.fn()}
        refreshing={false}
      />
    );
    expect(screen.getByText("Sol 675")).toBeOnTheScreen();
    expect(screen.getByText("Season: Fall")).toBeOnTheScreen();
  });

  it("renders upstream error", () => {
    render(
      <InsightWeatherWidget
        state={{
          status: "error",
          error: { kind: "upstream", status: 502, message: "bad" },
        }}
        onRefresh={jest.fn()}
        refreshing={false}
      />
    );
    expect(screen.getByText(strings.errors.insightUpstreamTitle)).toBeOnTheScreen();
  });
});
