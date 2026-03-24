import { render, screen } from "@testing-library/react-native";
import { ApodErrorMessageWidget } from "@/modules/apod/presentation/widgets/apod-error-message.widget";

describe("ApodErrorMessageWidget", () => {
  it("renders unauthorized copy", () => {
    render(<ApodErrorMessageWidget failure={{ kind: "unauthorized" }} />);
    expect(screen.getByText("Access denied")).toBeOnTheScreen();
    expect(screen.getByText(/rejected this request/)).toBeOnTheScreen();
  });

  it("renders network guidance", () => {
    render(<ApodErrorMessageWidget failure={{ kind: "network", message: "timeout" }} />);
    expect(screen.getByText("Can’t reach the server")).toBeOnTheScreen();
    expect(screen.getByText(/Connection problem: timeout/)).toBeOnTheScreen();
  });

  it("renders upstream error with friendly base and details", () => {
    render(
      <ApodErrorMessageWidget
        failure={{ kind: "upstream", status: 502, message: "bad", details: {} }}
      />
    );
    expect(screen.getByText("Server or API error")).toBeOnTheScreen();
    expect(screen.getByText(/Bad gateway/)).toBeOnTheScreen();
    expect(screen.getByText(/Details: bad/)).toBeOnTheScreen();
  });
});
