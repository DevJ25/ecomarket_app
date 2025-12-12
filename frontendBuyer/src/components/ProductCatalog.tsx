import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { API_URL } from "../config";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Filter, Grid3x3, List, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useCart } from "../lib/CartContext";

interface ProductCatalogProps {
  onNavigate: (page: string, params?: any) => void;
}

// Removed mock data

const categories = [
  "Frutas Orgánicas",
  "Verduras Orgánicas",
  "Lácteos Orgánicos",
  "Huevos y Carnes",
  "Despensa Ecológica",
  "Bebidas y Jugos"
];
const certifications = [
  "Certificado Orgánico",
  "100% Biodegradable",
  "Zero Waste",
  "Cruelty Free",
  "GOTS Certificado",
];
const origins = ["España", "Francia", "Italia", "Portugal", "Alemania"];

export function ProductCatalog({ onNavigate }: ProductCatalogProps) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]); // Store all products for client-side filtering
  const [loading, setLoading] = useState(true);

  // Fetch products from backend

  useEffect(() => {
    fetch(`${API_URL}/productos`)
      .then((res) => res.json())
      .then((data) => {
        // Map backend data to frontend structure
        const mappedProducts = data.map((p: any) => ({
          id: p.productoId,
          name: p.nombreProducto,
          price: p.precio,
          image: p.imagenPrincipal || "https://via.placeholder.com/300",
          category: p.nombreCategoria || "General",
          certification: p.esOrganico ? "Certificado Orgánico" : "Estándar",
          origin: "Desconocido", // Simplified origin
          rating: p.calificacionPromedio || 0,
          stock: p.stock,
        }));
        setProducts(mappedProducts);
        setAllProducts(mappedProducts);

        // Extract unique categories
        const categories = Array.from(new Set(mappedProducts.map((p: any) => p.category))) as string[];
        setDynamicCategories(categories);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 100]); // Increased max range
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<
    string[]
  >([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);

  const handleCheckboxChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
    checked: boolean
  ) => {
    setter((prev) =>
      checked ? [...prev, item] : prev.filter((i) => i !== item)
    );
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    // Filter by Category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Filter by Price
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by Certification
    if (selectedCertifications.length > 0) {
      filtered = filtered.filter(p => selectedCertifications.includes(p.certification));
    }

    // Filter by Origin
    if (selectedOrigins.length > 0) {
      filtered = filtered.filter(p => selectedOrigins.includes(p.origin));
    }

    // Apply Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // Assuming higher ID means newer if no date field exists
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // relevance or unknown, keep default order
        break;
    }

    setProducts(filtered);
    setCurrentPage(1); // Reset to first page
  };

  // Auto-apply filters when selection changes
  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters();
    }
  }, [selectedCategories, priceRange, selectedCertifications, selectedOrigins, sortBy]);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <Card className="p-6 sticky top-24 border-border">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="text-foreground">Filtros</h3>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-foreground mb-3">Categoría</h4>
                <div className="space-y-2">
                  {dynamicCategories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked: any) =>
                          handleCheckboxChange(
                            setSelectedCategories,
                            category,
                            !!checked
                          )
                        }
                      />
                      <span className="text-sm text-muted-foreground">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-foreground mb-3">Precio</h4>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>€{priceRange[0]}</span>
                  <span>€{priceRange[1]}</span>
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-6">
                <h4 className="text-foreground mb-3">Certificación</h4>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <label
                      key={cert}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedCertifications.includes(cert)}
                        onCheckedChange={(checked: any) =>
                          handleCheckboxChange(
                            setSelectedCertifications,
                            cert,
                            !!checked
                          )
                        }
                      />
                      <span className="text-sm text-muted-foreground">
                        {cert}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Origin */}
              <div className="mb-6">
                <h4 className="text-foreground mb-3">Origen</h4>
                <div className="space-y-2">
                  {origins.map((origin) => (
                    <label
                      key={origin}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedOrigins.includes(origin)}
                        onCheckedChange={(checked: any) =>
                          handleCheckboxChange(
                            setSelectedOrigins,
                            origin,
                            !!checked
                          )
                        }
                      />
                      <span className="text-sm text-muted-foreground">
                        {origin}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg border border-border">
              <div>
                <p className="text-muted-foreground">
                  Mostrando{" "}
                  <span className="text-foreground">{products.length}</span>{" "}
                  productos
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Más Relevantes</SelectItem>
                    <SelectItem value="price-low">
                      Precio: Menor a Mayor
                    </SelectItem>
                    <SelectItem value="price-high">
                      Precio: Mayor a Menor
                    </SelectItem>
                    <SelectItem value="rating">Mejor Valorados</SelectItem>
                    <SelectItem value="newest">Más Recientes</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {products.map((product) => (
                <Card
                  key={product.id}
                  className={`overflow-hidden cursor-pointer hover:shadow-xl transition-shadow border-border group ${viewMode === "list" ? "flex" : ""
                    }`}
                  onClick={() => onNavigate("product", { id: product.id })}
                >
                  <div
                    className={
                      viewMode === "list"
                        ? "w-48 flex-shrink-0"
                        : "aspect-square"
                    }
                  >
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-3 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        {product.certification}
                      </Badge>
                      {product.stock < 30 && (
                        <Badge
                          variant="outline"
                          className="border-destructive/50 text-destructive"
                        >
                          Pocas unidades
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-foreground line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Origen: {product.origin}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary">€{product.price}</span>
                      <Button
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Agregar
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Stock: {product.stock} unidades
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
