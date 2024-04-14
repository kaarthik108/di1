import { getChat } from "@/app/actions";
import { ImageResponse } from "@vercel/og";

export const size = {
  width: 1200,
  height: 630,
};
export const runtime = "edge";

export const alt = "AI Driven Insights With Cloudflare D1";

export default async function og({ params }: { params: { id: string } }) {
  const chat = await getChat(params.id);

  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://di1-iyr.pages.dev";

  const logourl = `${baseURL}/logobg.png`;

  if (!chat) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "1200px",
            height: "630px",
            background: "#f8f4f0",
            color: "white",
            fontFamily: "Faro",
            fontSize: "48px",
            padding: "50px",
            position: "relative",
          }}
        >
          <img
            src={logourl}
            alt="Logo"
            style={{
              position: "absolute",
              top: "30px",
              left: "30px",
              width: "80px",
            }}
          />
          <h1
            style={{
              marginTop: "100px",
              fontSize: "48px",
              fontWeight: "bold",
              color: "1e3a2b",
            }}
          >
            {"No Chat Found"} ..
          </h1>
          <p style={{ fontSize: "24px", color: "1e3a2b" }}>
            AI Driven Insights With Cloudflare D1 & Vercel AI SDK
          </p>
          <a
            href={baseURL}
            style={{
              color: "1e3a2b",
              fontSize: "14px",
              fontWeight: "bold",
              textDecoration: "none",
              marginTop: "20px",
            }}
          >
            di1-iyr.pages.dev
          </a>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "1200px",
          height: "630px",
          background: "#f8f4f0",
          color: "white",
          fontFamily: "Faro",
          fontSize: "48px",
          padding: "50px",
          position: "relative",
        }}
      >
        <img
          src={logourl}
          alt="Logo"
          style={{
            position: "absolute",
            top: "30px",
            left: "30px",
            width: "80px",
          }}
        />
        <h1
          style={{
            marginTop: "100px",
            fontSize: "48px",
            fontWeight: "bold",
            color: "1e3a2b",
          }}
        >
          {chat.title} ..
        </h1>
        <p style={{ fontSize: "24px", color: "1e3a2b" }}>
          AI Driven Insights With Cloudflare D1 & Vercel AI SDK
        </p>
        <a
          href={baseURL}
          style={{
            color: "1e3a2b",
            fontSize: "14px",
            fontWeight: "bold",
            textDecoration: "none",
            marginTop: "20px",
          }}
        >
          di1-iyr.pages.dev
        </a>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
