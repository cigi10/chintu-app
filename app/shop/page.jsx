import Navbar from "@/components/Navbar";
import CoinShop from "@/components/CoinShop";

export const metadata = {
  title: "Study app: Shop",
  description: "Spend your coins on your companion's room and outfits.",
};

export default function ShopPage() {
  return (
    <div className="page-root">
      <Navbar />
      <main className="page-main">
        <div className="page-header" style={{ textAlign: "center" }}>
          <h1>Your Companion&apos;s Room </h1>
          <p>Spend coins to decorate your companion&apos;s space</p>
        </div>
        <CoinShop />
      </main>
    </div>
  );
}