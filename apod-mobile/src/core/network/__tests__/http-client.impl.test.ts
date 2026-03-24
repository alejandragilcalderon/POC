import { HttpClientImpl } from "@/core/network/http-client.impl";

describe("HttpClientImpl", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("joins baseUrl and path", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{"a":1}',
    });
    global.fetch = fetchMock;

    const client = new HttpClientImpl({ baseUrl: "https://api.example.com/v1/" });
    const data = await client.getJson<{ a: number }>("/x");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/v1/x",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({ Accept: "application/json" }),
      })
    );
    expect(data).toEqual({ a: 1 });
  });

  it("merges custom headers", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "null",
    });
    global.fetch = fetchMock;

    const client = new HttpClientImpl({ baseUrl: "https://x.com" });
    await client.getJson("/p", { Authorization: "Bearer t" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://x.com/p",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
          Authorization: "Bearer t",
        }),
      })
    );
  });

  it("throws ApiError on non-OK response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 502,
      statusText: "Bad Gateway",
      text: async () => JSON.stringify({ message: "upstream" }),
    });

    const client = new HttpClientImpl({ baseUrl: "https://x.com" });
    await expect(client.getJson("/")).rejects.toMatchObject({
      statusCode: 502,
      message: "upstream",
    });
  });
});
