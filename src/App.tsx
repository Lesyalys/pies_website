import { TopBar } from "./components/layout/TopBar";
import { Header } from "./components/layout/Header";
import { Hero } from "./components/hero/Hero";
import { Features } from "./components/features/Features";
import { Catalog } from "./components/catalog/Catalog";
import { CustomOrder } from "./components/content/CustomOrder";
import { Reviews } from "./components/content/Reviews";
import { CTA } from "./components/content/CTA";
import { Footer } from "./components/layout/Footer";
import { CartDrawer } from "./components/cart/CartDrawer";
import { CheckoutModal } from "./components/checkout/CheckoutModal";
import { AddToCartBanner } from "./components/cart/AddToCartBanner";
import { DeliveryZones } from "./components/delivery/DeliveryZones";
import { CartProvider, useCart } from "./context/CartContext";
import menuDataJson from "./data/menu.json";
import type { MenuData } from "./types/menu";
import "./styles/components.css";
import "./styles/App.css";

const menuData = menuDataJson as MenuData;

function AppContent() {
  const { isCheckoutOpen, closeCheckout, lastAdded, clearLastAdded } =
    useCart();

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <Hero />
        <Features />
        <Catalog />
        <DeliveryZones />
        <CustomOrder />
        <Reviews />
        <CTA />
      </main>
      <Footer />

      <CartDrawer pies={menuData.pies} sizes={menuData.sizes} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />

      {lastAdded && (
        <AddToCartBanner productName={lastAdded} onDone={clearLastAdded} />
      )}
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
