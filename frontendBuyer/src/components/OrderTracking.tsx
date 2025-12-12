import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { API_URL } from "../config";

interface Order {
  pedidoId: number;
  fechaPedido: string;
  estado: string;
  total: number;
  detalles: any[];
}

interface OrderTrackingProps {
  onNavigate: (page: string) => void;
}

export function OrderTracking({ onNavigate }: OrderTrackingProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");


      // ...
      const response = await fetch(`${API_URL}/pedidos/mis-pedidos`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDIENTE": return <Clock className="w-5 h-5 text-yellow-500" />;
      case "ENVIADO": return <Truck className="w-5 h-5 text-blue-500" />;
      case "ENTREGADO": return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDIENTE": return "Pendiente de Envío";
      case "ENVIADO": return "En Camino";
      case "ENTREGADO": return "Entregado";
      default: return status;
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando pedidos...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No tienes pedidos aún</h2>
          <p className="text-muted-foreground mb-6">¡Explora nuestro catálogo y realiza tu primera compra!</p>
          <Button onClick={() => onNavigate("catalog")}>Ir al Catálogo</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.pedidoId} className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Pedido #{order.pedidoId}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.fechaPedido).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.estado)}
                  <Badge variant={order.estado === "ENTREGADO" ? "default" : "secondary"}>
                    {getStatusLabel(order.estado)}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>€{order.total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
