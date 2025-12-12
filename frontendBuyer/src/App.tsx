import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ProductCatalog } from "./components/ProductCatalog";
import { AuthPage } from "./components/AuthPage";
import { VerifyAccount } from "./components/VerifyAccount";
import { ProductDetail } from "./components/ProductDetail";
import { Checkout } from "./components/Checkout";
import { AdminPanel } from "./components/AdminPanel";
import { OrderHistory } from "./components/OrderHistory"; // Changed from OrderTracking
import { ReturnsManagement } from "./components/ReturnsManagement";
import { Toaster } from "./components/ui/sonner";
import { CartProvider } from "./lib/CartContext";
import { CartPage } from "./components/CartPage";

type Page =
  | "home"
  | "catalog"
  | "auth"
  | "product"
  | "cart"
  | "checkout"
  | "admin"
  | "orders"
  | "returns"
  | "favorites"
  | "verify";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  useEffect(() => {
    // Check for verification token in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get("token")) {
      setCurrentPage("verify");
    }
  }, []);

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page as Page);
    if (params && params.id) {
      setSelectedProductId(params.id);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header
          onNavigate={handleNavigate}
          currentPage={currentPage}
        />

        {currentPage === "home" && (
          <HomePage onNavigate={handleNavigate} />
        )}
        {currentPage === "catalog" && (
          <ProductCatalog onNavigate={handleNavigate} />
        )}
        {currentPage === "auth" && (
          <AuthPage onNavigate={handleNavigate} />
        )}
        {currentPage === "verify" && (
          <VerifyAccount />
        )}
        {currentPage === "product" && (
          <ProductDetail
            onNavigate={handleNavigate}
            onAddToCart={() => { /* This will be handled by the context now */ }}
            productId={selectedProductId}
          />
        )}
        {currentPage === "cart" && (
          <CartPage onNavigate={handleNavigate} />
        )}
        {currentPage === "checkout" && (
          <Checkout onNavigate={handleNavigate} />
        )}
        {currentPage === "admin" && (
          <AdminPanel onNavigate={handleNavigate} />
        )}
        {currentPage === "orders" && (
          <OrderHistory onNavigate={handleNavigate} />
        )}
        {currentPage === "returns" && (
          <ReturnsManagement onNavigate={handleNavigate} />
        )}
        {currentPage === "favorites" && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-foreground mb-2">Favoritos</h2>
              <p className="text-muted-foreground">
                Esta sección está en desarrollo
              </p>
            </div>
          </div>
        )}

        <Toaster />

        {/* Footer */}
        <footer className="bg-white border-t border-border mt-16">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-foreground mb-4">
                  Sobre Ecomarket
                </h4>
                <p className="text-muted-foreground text-sm">
                  Marketplace líder en productos ecológicos y
                  sostenibles. Conectamos productores responsables
                  con consumidores conscientes.
                </p>
              </div>
              <div>
                <h4 className="text-foreground mb-4">Comprar</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <button
                      onClick={() => handleNavigate("catalog")}
                      className="hover:text-primary"
                    >
                      Catálogo de Productos
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigate("catalog")}
                      className="hover:text-primary"
                    >
                      Categorías
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigate("catalog")}
                      className="hover:text-primary"
                    >
                      Ofertas Especiales
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigate("catalog")}
                      className="hover:text-primary"
                    >
                      Nuevos Productos
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-foreground mb-4">Soporte</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <button className="hover:text-primary">
                      Centro de Ayuda
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigate("orders")}
                      className="hover:text-primary"
                    >
                      Seguimiento de Pedidos
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigate("returns")}
                      className="hover:text-primary"
                    >
                      Devoluciones
                    </button>
                  </li>
                  <li>
                    <button className="hover:text-primary">
                      Contacto
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-foreground mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <button className="hover:text-primary">
                      Privacidad
                    </button>
                  </li>
                  <li>
                    <button className="hover:text-primary">
                      Términos
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>
                © 2024 Ecomarket. Todos los derechos reservados.
                | Política de Privacidad | Términos y Condiciones
              </p>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;