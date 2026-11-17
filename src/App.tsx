import { TopBar } from "./components/TopBar";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Catalog } from "./components/Catalog";
import { CustomOrder } from "./components/CustomOrder";
import { Reviews } from "./components/Reviews";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { CartProvider } from "./context/CartContext";
import menuDataJson from "./data/menu.json";
import type { MenuData } from "./types/menu";
import "./styles/components.css";
import "./styles/App.css";

function App() {
  const menuData = menuDataJson as MenuData;

  return (
    <CartProvider>
      <TopBar />
      <Header />
      <main>
        <Hero />
        <Features />
        <Catalog />
        <CustomOrder />
        <Reviews />
        <CTA />
      </main>
      <Footer />

      {/* Рендерим корзину в самом конце */}
      <CartDrawer pies={menuData.pies} sizes={menuData.sizes} />
    </CartProvider>
  );
}

export default App;
