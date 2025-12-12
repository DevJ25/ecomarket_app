import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { API_URL } from "../config";
import { ShoppingBag, ChevronLeft, Package } from "lucide-react";

import { ReviewModal } from "./ReviewModal";
import { ReturnModal } from "./ReturnModal";

interface OrderDetail {
    id: number;
    producto: {
        productoId: number;
        nombreProducto: string;
        imagenPrincipal: string;
    };
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

interface Order {
    pedidoId: number;
    fechaPedido: string;
    estado: string;
    total: number;
    detalles: OrderDetail[];
    direccionEnvio: string;
}

export function OrderHistory({ onNavigate }: { onNavigate: (page: string) => void }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState<{ productoId: number, pedidoId: number, productName: string } | null>(null);
    const [selectedReturn, setSelectedReturn] = useState<{ productoId: number, pedidoId: number, productName: string, maxQuantity: number } | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await fetch(`${API_URL}/pedidos/mis-pedidos`, {
                    headers: { Authorization: `Bearer ${token}` }
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

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p>Cargando historial...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen bg-background">
            <Button variant="ghost" className="mb-6" onClick={() => onNavigate("dashboard")}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Volver al Panel
            </Button>

            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <ShoppingBag className="w-8 h-8 text-primary" />
                Historial de Compras
            </h1>

            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Aún no tienes pedidos</h2>
                    <p className="text-muted-foreground mb-6">
                        ¡Explora nuestro catálogo y empieza a comprar sostenible!
                    </p>
                    <Button onClick={() => onNavigate("catalog")}>Ir al Catálogo</Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order.pedidoId} className="p-6">
                            <div className="flex flex-col md:flex-row justify-between mb-4 border-b pb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold">Pedido #{order.pedidoId}</h3>
                                        <Badge variant={order.estado === "ENTREGADO" ? "default" : "outline"}>
                                            {order.estado}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(order.fechaPedido).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">€{order.total.toFixed(2)}</p>
                                    <p className="text-sm text-muted-foreground">{order.detalles.length} productos</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {order.detalles.map((detail, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-4">
                                            {detail.producto.imagenPrincipal && (
                                                <img
                                                    src={detail.producto.imagenPrincipal}
                                                    alt={detail.producto.nombreProducto}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium">{detail.producto.nombreProducto}</p>
                                                <p className="text-muted-foreground">x{detail.cantidad}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="font-medium">€{detail.subtotal.toFixed(2)}</p>
                                            {order.estado === "ENTREGADO" && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setSelectedReview({
                                                            productoId: detail.producto.productoId,
                                                            pedidoId: order.pedidoId,
                                                            productName: detail.producto.nombreProducto
                                                        })}
                                                    >
                                                        Calificar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => setSelectedReturn({
                                                            productoId: detail.producto.productoId,
                                                            pedidoId: order.pedidoId,
                                                            productName: detail.producto.nombreProducto,
                                                            maxQuantity: detail.cantidad
                                                        })}
                                                    >
                                                        Devolver
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {selectedReview && (
                <ReviewModal
                    isOpen={!!selectedReview}
                    onClose={() => setSelectedReview(null)}
                    productoId={selectedReview.productoId}
                    pedidoId={selectedReview.pedidoId}
                    productName={selectedReview.productName}
                    onReviewSubmit={() => {
                        alert("¡Gracias por tu reseña!");
                    }}
                />
            )}

            {selectedReturn && (
                <ReturnModal
                    isOpen={!!selectedReturn}
                    onClose={() => setSelectedReturn(null)}
                    productoId={selectedReturn.productoId}
                    pedidoId={selectedReturn.pedidoId}
                    productName={selectedReturn.productName}
                    maxQuantity={selectedReturn.maxQuantity}
                    onReturnSubmit={() => {
                        // Refresh or logic
                    }}
                />
            )}
        </div>
    );
}
