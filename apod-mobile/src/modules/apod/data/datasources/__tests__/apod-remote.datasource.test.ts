import type { IHttpClient } from "@/core/network/http-client.interface";
import { ApodRemoteDataSource } from "@/modules/apod/data/datasources/apod-remote.datasource";

describe("ApodRemoteDataSource", () => {
  it("calls GET /apod with query for single date", async () => {
    const getJson = jest.fn().mockResolvedValue({ title: "x" });
    const httpClient: IHttpClient = { getJson };
    const ds = new ApodRemoteDataSource({ httpClient, apodPath: "/apod" });

    await ds.fetchApod({ mode: "single", date: "2024-06-01", thumbs: true });

    expect(getJson).toHaveBeenCalledWith("/apod?date=2024-06-01&thumbs=true");
  });

  it("calls range and random modes", async () => {
    const getJson = jest.fn().mockResolvedValue([]);
    const httpClient: IHttpClient = { getJson };
    const ds = new ApodRemoteDataSource({ httpClient, apodPath: "/apod" });

    await ds.fetchApod({
      mode: "range",
      startDate: "2024-01-01",
      endDate: "2024-01-02",
    });
    expect(getJson).toHaveBeenCalledWith(
      "/apod?start_date=2024-01-01&end_date=2024-01-02"
    );

    await ds.fetchApod({ mode: "random", count: 3 });
    expect(getJson).toHaveBeenCalledWith("/apod?count=3");
  });

  it("uses path without query when empty", async () => {
    const getJson = jest.fn().mockResolvedValue({});
    const httpClient: IHttpClient = { getJson };
    const ds = new ApodRemoteDataSource({ httpClient, apodPath: "/apod" });

    await ds.fetchApod({ mode: "single" });
    expect(getJson).toHaveBeenCalledWith("/apod");
  });
});
