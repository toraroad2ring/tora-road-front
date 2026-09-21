import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Tora Road - Motorcycle Touring Journal";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5f5f2",
          color: "#111111",
          padding: "72px",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.3em",
          }}
        >
          MOTORCYCLE TOURING JOURNAL
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 108,
              fontWeight: 900,
              letterSpacing: "0.08em",
            }}
          >
            TORA ROAD
          </div>

          <div
            style={{
              marginTop: "20px",
              fontSize: 30,
              color: "#555555",
            }}
          >
            Roads, rides, landscapes and Dormy Inn.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
          }}
        >
          <div>JAPAN TOURING</div>
          <div>tora-road-front.vercel.app</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}