import { Search, ShoppingCart, User, Heart, Menu, Leaf, LogOut, Bell, ShoppingBag, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../lib/CartContext";
import { API_URL } from "../config";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HeaderProps {
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { cartCount } = useCart();
  const [user, setUser] = useState<any>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      setUser(null); // Clear user if not found
    }

    // Fetch products for search
    fetch(`${API_URL}/productos`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => console.error("Error fetching products for search:", err));
  }, [currentPage]); // Re-check on navigation (e.g. after login)

  // Handle outside click to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProducts([]);
      setShowResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = products.filter(p =>
      p.nombreProducto.toLowerCase().includes(lowerQuery) ||
      p.descripcion?.toLowerCase().includes(lowerQuery)
    ).slice(0, 5); // Limit to 5 results

    setFilteredProducts(filtered);
    setShowResults(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    onNavigate("home");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-primary">Ecomarket</span>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="search"
                placeholder="Buscar productos ecológicos..."
                className="pl-10 bg-input-background border-border"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && filteredProducts.length > 0 && (
              <Card className="absolute top-full left-0 right-0 mt-2 p-2 max-h-96 overflow-y-auto z-50 shadow-lg border-border">
                {filteredProducts.map((product) => (
                  <div
                    key={product.productoId}
                    className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      onNavigate("product", { id: product.productoId });
                      setShowResults(false);
                      setSearchQuery("");
                    }}
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <ImageWithFallback
                        src={product.imagenPrincipal || "https://via.placeholder.com/150"}
                        alt={product.nombreProducto}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{product.nombreProducto}</h4>
                      <p className="text-sm text-primary">€{product.precio}</p>
                    </div>
                  </div>
                ))}
              </Card>
            )}

            {showResults && searchQuery && filteredProducts.length === 0 && (
              <Card className="absolute top-full left-0 right-0 mt-2 p-4 text-center text-muted-foreground z-50 border-border">
                No se encontraron productos
              </Card>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("catalog")}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("favorites")}
            >
              <Heart className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => onNavigate("cart")}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex gap-2 items-center">
                    <User className="w-5 h-5" />
                    <span className="text-sm font-medium hidden md:block">
                      {user.nombre}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate("orders")}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Mis Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate("favorites")}>
                    <Heart className="w-4 h-4 mr-2" />
                    Favoritos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate("auth")}
              >
                <User className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { }}
            >
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
