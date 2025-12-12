```typescript
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { API_URL } from "../config";

interface Product {
  productoId: number;
  nombreProducto: string;
  descripcion: string;
  precio: number;
  imagenPrincipal: string;
  nombreVendedor: string;
  nombreCategoria: string;
}

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

export function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${ API_URL } /admin/productos / pendientes`, {
        headers: {
          "Authorization": `Bearer ${ token } `
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPendingProducts(data);
      }
    } catch (error) {
      console.error("Error fetching pending products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: number, approved: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${ API_URL } /admin/productos / ${ id }/verificar?aprobado=${approved}`, {
method: "PUT",
  headers: {
  "Authorization": `Bearer ${token}`
}
      });

if (response.ok) {
  // Remove from list
  setPendingProducts(prev => prev.filter(p => p.productoId !== id));
} else {
  alert("Error al procesar la solicitud");
}
    } catch (error) {
  console.error("Error verifying product:", error);
}
  };

if (loading) {
  return <div className="p-8 text-center">Cargando...</div>;
}

return (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

    <div className="grid gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Productos Pendientes de Aprobación
          </h2>
          <Badge variant="secondary">{pendingProducts.length} pendientes</Badge>
        </div>

        {pendingProducts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No hay productos pendientes de revisión.
          </p>
        ) : (
          <div className="space-y-4">
            {pendingProducts.map((product) => (
              <div key={product.productoId} className="flex gap-4 p-4 border rounded-lg bg-card">
                <div className="w-32 h-32 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={product.imagenPrincipal}
                    alt={product.nombreProducto}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{product.nombreProducto}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Vendedor: {product.nombreVendedor} | Categoría: {product.nombreCategoria}
                      </p>
                      <p className="text-sm mb-2">{product.descripcion}</p>
                      <p className="font-bold text-primary">€{product.precio.toFixed(2)}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleVerify(product.productoId, false)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rechazar
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleVerify(product.productoId, true)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Aprobar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  </div>
);
}
