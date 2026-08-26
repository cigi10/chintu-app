import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        minHeight: "100vh",
        background: "var(--color-bg)",
      }}
    >
      <Spinner size={40} />
      <p style={{ margin: 0, fontFamily: "var(--font-body)", color: "var(--color-text-secondary)" }}>
        Loading...
      </p>
    </div>
  );
}
