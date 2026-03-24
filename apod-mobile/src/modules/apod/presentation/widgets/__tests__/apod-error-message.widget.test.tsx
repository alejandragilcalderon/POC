import { render, screen } from "@testing-library/react-native";
import { ApodErrorMessageWidget } from "@/modules/apod/presentation/widgets/apod-error-message.widget";
import { strings } from "@/shared/resources";

describe("ApodErrorMessageWidget", () => {
  it("renders unauthorized copy", () => {
    render(<ApodErrorMessageWidget failure={{ kind: "unauthorized" }} />);
    expect(screen.getByText(strings.errors.unauthorizedTitle)).toBeOnTheScreen();
    expect(screen.getByText(/needs permission/)).toBeOnTheScreen();
  });

  it("renders network guidance", () => {
    render(<ApodErrorMessageWidget failure={{ kind: "network", message: "timeout" }} />);
    expect(screen.getByText("You’re offline or we can’t connect")).toBeOnTheScreen();
    expect(screen.getByText(/couldn’t finish loading/)).toBeOnTheScreen();
    expect(screen.getByText(/timeout/)).toBeOnTheScreen();
  });

  it("renders upstream error with friendly base and details", () => {
    render(
      <ApodErrorMessageWidget
        failure={{ kind: "upstream", status: 502, message: "bad", details: {} }}
      />
    );
    expect(screen.getByText("We couldn’t load today’s picture")).toBeOnTheScreen();
    expect(screen.getByText(/trouble connecting upstream/)).toBeOnTheScreen();
    expect(screen.getByText(/More detail:/)).toBeOnTheScreen();
    expect(screen.getByText(/bad/)).toBeOnTheScreen();
  });
});
