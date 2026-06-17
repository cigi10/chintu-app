import Navbar from "@/components/Navbar";
import CoinShop from "@/components/CoinShop";

export const metadata = {
  title: "Chintu 🐿️ — Shop",
  description: "Spend your coins on Chintu's room and outfits.",
};

export default function ShopPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FDF6EC", fontFamily: "'Nunito', sans-serif", color: "#1C1917" }}>
      <Navbar />
      <main style={{ padding: "1.5rem 1.25rem 6rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontWeight: 800, fontSize: "1.5rem", margin: "0 0 4px" }}>Chintu's Room 🛍️</h1>
          <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "#92400E", margin: 0 }}>
            Spend coins to decorate Chintu's space
          </p>
        </div>
        <CoinShop />
      </main>
    </div>
  );
}