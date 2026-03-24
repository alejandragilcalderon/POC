import type { Metadata } from "next";
import pkg from "../package.json";

export const metadata: Metadata = {
  title: "NASA APIs — Reference",
  description:
    "REST endpoints for NASA APOD, InSight Mars Weather proxy, and health checks",
};

export default function ApiReferencePage() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "2rem 1.25rem 3rem",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.65rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
          NASA APIs backend
        </h1>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>
          JSON REST endpoints. Base URL is this origin (e.g.{" "}
          <code style={{ fontSize: "0.9em" }}>http://localhost:3000</code> in local dev).
        </p>
        <p
          style={{
            margin: "0.75rem 0 0",
            padding: "0.65rem 0.85rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: "0.9rem",
            color: "var(--muted)",
          }}
        >
          <strong style={{ color: "var(--text)" }}>Local dev:</strong> use{" "}
          <code>http://</code>, not <code>https://</code>, or the browser may show “invalid
          response.”
        </p>
      </header>

      <section style={{ marginBottom: "2.25rem" }}>
        <h2
          style={{
            fontSize: "1.15rem",
            fontWeight: 650,
            margin: "0 0 0.75rem",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "0.35rem",
          }}
        >
          GET /api/health
        </h2>
        <p style={{ margin: "0 0 1rem", color: "var(--muted)" }}>
          Liveness check. No authentication. Does not call NASA.
        </p>
        <p style={{ margin: "0 0 0.35rem", fontWeight: 600, fontSize: "0.9rem" }}>
          Response
        </p>
        <pre>{`{
  "status": "ok",
  "service": "apod-backend",
  "version": "${pkg.version}",
  "timestamp": "<ISO-8601>"
}`}</pre>
        <p style={{ margin: "1rem 0 0.35rem", fontWeight: 600, fontSize: "0.9rem" }}>
          Try it
        </p>
        <pre>{`curl -s http://localhost:3000/api/health`}</pre>
        <p style={{ margin: "0.75rem 0 0" }}>
          <a href="/api/health">Open /api/health in the browser →</a>
        </p>
      </section>

      <section style={{ marginBottom: "2.25rem" }}>
        <h2
          style={{
            fontSize: "1.15rem",
            fontWeight: 650,
            margin: "0 0 0.75rem",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "0.35rem",
          }}
        >
          GET /api/apod
        </h2>
        <p style={{ margin: "0 0 1rem", color: "var(--muted)" }}>
          Proxies{" "}
          <a href="https://api.nasa.gov/planetary/apod" target="_blank" rel="noreferrer">
            NASA Astronomy Picture of the Day
          </a>
          . The server sends your <code>NASA_APOD_API_KEY</code>; clients must not pass{" "}
          <code>api_key</code>.
        </p>

        <p style={{ margin: "0 0 0.5rem", fontWeight: 600, fontSize: "0.9rem" }}>
          Query parameters (NASA rules)
        </p>
        <ul style={{ margin: "0 0 1rem", paddingLeft: "1.25rem", color: "var(--muted)" }}>
          <li style={{ marginBottom: "0.35rem" }}>
            <strong style={{ color: "var(--text)" }}>date</strong> — single day{" "}
            <code>YYYY-MM-DD</code>. Mutually exclusive with range and <code>count</code>.
          </li>
          <li style={{ marginBottom: "0.35rem" }}>
            <strong style={{ color: "var(--text)" }}>start_date</strong>,{" "}
            <strong style={{ color: "var(--text)" }}>end_date</strong> — range (optional end).
            Not with <code>date</code> or <code>count</code>.
          </li>
          <li style={{ marginBottom: "0.35rem" }}>
            <strong style={{ color: "var(--text)" }}>count</strong> — positive integer for a batch
            of random images. Not with <code>date</code> or range.
          </li>
          <li>
            <strong style={{ color: "var(--text)" }}>thumbs</strong> —{" "}
            <code>true</code> / <code>1</code> / <code>yes</code> for video thumbnail URLs when
            applicable.
          </li>
        </ul>
        <p style={{ margin: "0 0 0.35rem", fontWeight: 600, fontSize: "0.9rem" }}>
          Examples
        </p>
        <pre>{`# Today’s picture (default when no date/range/count)
curl -s "http://localhost:3000/api/apod"

# Specific date
curl -s "http://localhost:3000/api/apod?date=2024-06-01"

# Date range
curl -s "http://localhost:3000/api/apod?start_date=2024-06-01&end_date=2024-06-03"

# Random batch
curl -s "http://localhost:3000/api/apod?count=3"`}</pre>
        <p style={{ margin: "0.75rem 0 0" }}>
          <a href="/api/apod">Open /api/apod (default) →</a>
        </p>
      </section>

      <section style={{ marginBottom: "2.25rem" }}>
        <h2
          style={{
            fontSize: "1.15rem",
            fontWeight: 650,
            margin: "0 0 0.75rem",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "0.35rem",
          }}
        >
          InSight: Mars Weather Service API
        </h2>
        <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", color: "var(--muted)" }}>
          (Last updated in NASA docs: 3/30/2021)
        </p>

        <div
          style={{
            margin: "0 0 1rem",
            padding: "0.65rem 0.85rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: "0.9rem",
            color: "var(--muted)",
          }}
        >
          <strong style={{ color: "var(--text)" }}>Important:</strong> this service has
          significant missing data because InSight had to manage power use. See the{" "}
          <a
            href="https://mars.nasa.gov/insight/weather/"
            target="_blank"
            rel="noreferrer"
          >
            seasonal weather report
          </a>{" "}
          for gaps and NASA articles on how dust and distance from the Sun affect power.
        </div>

        <p style={{ margin: "0 0 1rem", color: "var(--muted)" }}>
          NASA’s InSight Mars lander took continuous weather measurements (temperature, wind,
          pressure) at Elysium Planitia, near Mars’ equator. Sensors can fail or drop out —
          long gaps may be documented in search results or mission pages. Summaries:{" "}
          <a href="https://mars.nasa.gov/insight/weather/" target="_blank" rel="noreferrer">
            mars.nasa.gov/insight/weather
          </a>
          .
        </p>

        <p style={{ margin: "0 0 1rem", color: "var(--muted)" }}>
          The upstream API returns per-Sol summary data for each of the last seven available Sols
          (Martian days). Values can change as more data are downlinked. Wind and other sensors
          may have no data for some ranges — the seasonal report shows those gaps.
        </p>

        <p style={{ margin: "0 0 1rem", color: "var(--muted)" }}>
          Maintained by NASA JPL and Cornell. Bug reports:{" "}
          <a href="https://mars.nasa.gov/feedback/" target="_blank" rel="noreferrer">
            mars.nasa.gov/feedback
          </a>
          . <strong style={{ color: "var(--text)" }}>Rate limit (NASA):</strong> at most 2000
          requests per hour per IP.
        </p>

        <p style={{ margin: "0 0 1rem", color: "var(--muted)" }}>
          Upstream:{" "}
          <code style={{ fontSize: "0.88em" }}>
            GET https://api.nasa.gov/insight_weather/?api_key=…&amp;feedtype=json&amp;ver=1.0
          </code>
          . Data are JSON (RFC 7159). NASA also publishes example HTML using wind-direction
          distributions from this API’s JSON.
        </p>

        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 650,
            margin: "1.25rem 0 0.5rem",
          }}
        >
          GET /api/insight-weather
        </h3>
        <p style={{ margin: "0 0 1rem", color: "var(--muted)" }}>
          Proxies{" "}
          <a
            href="https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0"
            target="_blank"
            rel="noreferrer"
          >
            InSight Mars Weather
          </a>
          . The server sends your <code>NASA_APOD_API_KEY</code> (same api.nasa.gov key); clients
          must not pass <code>api_key</code>.
        </p>

        <p style={{ margin: "0 0 0.5rem", fontWeight: 600, fontSize: "0.9rem" }}>
          Query parameters (upstream NASA API)
        </p>
        <ul style={{ margin: "0 0 1rem", paddingLeft: "1.25rem", color: "var(--muted)" }}>
          <li style={{ marginBottom: "0.35rem" }}>
            <strong style={{ color: "var(--text)" }}>ver</strong> (<code>float</code>) — default{" "}
            <code>1.0</code>. API version.
          </li>
          <li style={{ marginBottom: "0.35rem" }}>
            <strong style={{ color: "var(--text)" }}>feedtype</strong> (<code>string</code>) —
            default <code>json</code>. Only JSON is supported.
          </li>
          <li>
            <strong style={{ color: "var(--text)" }}>api_key</strong> — set only on the server;
            not accepted from clients on this proxy.
          </li>
        </ul>

        <p style={{ margin: "0 0 0.35rem", fontWeight: 600, fontSize: "0.9rem" }}>
          Example (this backend)
        </p>
        <pre>{`curl -s "http://localhost:3000/api/insight-weather"`}</pre>
        <p style={{ margin: "0.75rem 0 0" }}>
          <a href="/api/insight-weather">Open /api/insight-weather →</a>
        </p>
      </section>

      <footer style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
        Set <code>NASA_APOD_API_KEY</code> in <code>.env.local</code> (see{" "}
        <code>.env.example</code>).
      </footer>
    </main>
  );
}
