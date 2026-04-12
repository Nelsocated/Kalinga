"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();
  return (
    <div
      style={{
        background: "#F3BE0F",
        minHeight: "100vh",
        padding: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff8e1",
          borderRadius: 18,
          padding: 48,
          maxWidth: 1400,
          width: "100%",
          position: "relative",
          boxSizing: "border-box",
          margin: "2cm",
        }}
      >
        <button
          style={{
            background: "none",
            border: "none",
            fontSize: 32,
            position: "absolute",
            left: 32,
            top: 32,
            cursor: "pointer",
            color: "#222",
            fontWeight: 700,
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            transition: "background 0.15s",
          }}
          onClick={() => router.back()}
          aria-label="Back"
          onMouseOver={(e) => (e.currentTarget.style.background = "#ffe082")}
          onMouseOut={(e) => (e.currentTarget.style.background = "none")}
        >
          &#x2039;
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <Image
            src="/icons/kalinga_logo.svg"
            alt="Kalinga Logo"
            width={120}
            height={120}
            style={{ marginBottom: 16 }}
          />
          <h2
            style={{
              color: "#F3BE0F",
              fontWeight: 700,
              fontSize: 32,
              margin: 0,
            }}
          >
            KALINGA
          </h2>
        </div>
        <p
          style={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: 18,
            marginBottom: 32,
          }}
        >
          <span style={{ color: "#222" }}>Kalinga</span> is a platform that
          connects shelters and individuals with potential adopters, making it
          easier to find loving homes for stray and unclaimed animals.
        </p>
        <h1
          style={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: 36,
            margin: "32px 0 12px 0",
            color: "#111",
          }}
        >
          Our Mission
        </h1>
        <p style={{ textAlign: "center", fontSize: 18, color: "#222" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu arcu
          at massa dapibus tincidunt. Pellentesque maximus mollis augue sit amet
          euismod. Mauris sit amet ornare turpis, non suscipit purus. Aenean
          pellentesque id lacus et elementum.
        </p>

        <h2
          style={{
            textAlign: "center",
            fontWeight: 800,
            fontSize: 28,
            margin: "48px 0 24px 0",
            color: "#111",
          }}
        >
          Meet The Team
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 40,
            marginBottom: 24,
          }}
        >
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  background: "#ddd",
                  marginBottom: 8,
                }}
              />
              <span style={{ fontWeight: 700, fontSize: 18, color: "#111" }}>
                Name
              </span>
              <span style={{ fontWeight: 400, fontSize: 15, color: "#444" }}>
                Role
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
