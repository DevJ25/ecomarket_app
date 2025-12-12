import { useState, useEffect } from "react";
import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";
import { ProductList } from "./components/ProductList";
import { ProductForm } from "./components/ProductForm";
import { SellerOrders } from "./components/SellerOrders";
import { SellerReturns } from "./components/SellerReturns";
import { SellerCoupons } from "./components/SellerCoupons";
import { SellerReviews } from "./components/SellerReviews";

function App() {
  const [currentPage, setCurrentPage] = useState("auth");
  const [currentParams, setCurrentParams] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setCurrentPage("dashboard");
    }
  }, []);

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    if (params) setCurrentParams(params);
  };

  return (
    <>
      {currentPage === "auth" && <AuthPage onNavigate={handleNavigate} />}
      {currentPage === "dashboard" && <Dashboard onNavigate={handleNavigate} />}
      {currentPage === "products" && <ProductList onNavigate={handleNavigate} />}
      {currentPage === "product-form" && (
        <ProductForm
          onNavigate={handleNavigate}
          params={currentParams}
        />
      )}
      {currentPage === "orders" && (
        <SellerOrders onNavigate={handleNavigate} />
      )}
      {currentPage === "returns" && (
        <SellerReturns onNavigate={handleNavigate} />
      )}
      {currentPage === "coupons" && (
        <SellerCoupons onNavigate={handleNavigate} />
      )}
      {currentPage === "reviews" && (
        <SellerReviews onNavigate={handleNavigate} />
      )}
    </>
  );
}

export default App;
