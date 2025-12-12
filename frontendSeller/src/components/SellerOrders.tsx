import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { API_URL } from "../config";
import { Truck, CheckCircle, ChevronLeft } from "lucide-react";

interface Order {
    pedidoId: number;
    fechaPedido: string;
    estado: string;
    total: number;
    detalles: any[];
    usuario: {
        nombre: string;
        apellido: string;
        email: string;
    };
    direccionEnvio: string;
}

interface SellerOrdersProps {
    onNavigate: (page: string) => void;
}

export function SellerOrders({ onNavigate }: SellerOrdersProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/pedidos/vendedor`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                console.error("Error loading orders");
            }
        } catch (error) {
            console.error("Error fetching seller orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/pedidos/${id}/estado?estado=${newStatus}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Reload orders after successful update
                cargarPedidos();
            } else {
                alert("Error al actualizar el estado del pedido");
            }
        } catch (e) {
            console.error("Error updating status backend", e);
            alert("Error de conexión");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
                <p>Cargando pedidos...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" onClick={() => onNavigate("dashboard")}>
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
                </div>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order.pedidoId} className="p-6 bg-slate-900 border-slate-800 text-slate-100">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold">Pedido #{order.pedidoId}</h3>
                                        <Badge variant="outline" className="bg-slate-800 text-slate-200 border-slate-700">
                                            {order.estado}
                                        </Badge>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-1">
                                        Cliente: {order.usuario.nombre} {order.usuario.apellido}
                                    </p>
                                    <p className="text-slate-400 text-sm mb-1">
                                        Fecha: {new Date(order.fechaPedido).toLocaleDateString()}
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        Dirección: {order.direccionEnvio}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-4">
                                    <div className="text-2xl font-bold text-green-400">
                                        €{order.total.toFixed(2)}
                                    </div>

                                    <div className="flex gap-2">
                                        {order.estado === "PENDIENTE" && (
                                            <Button
                                                className="bg-blue-600 hover:bg-blue-700"
                                                onClick={() => handleUpdateStatus(order.pedidoId, "ENVIADO")}
                                            >
                                                <Truck className="w-4 h-4 mr-2" />
                                                Marcar Enviado
                                            </Button>
                                        )}
                                        {order.estado === "ENVIADO" && (
                                            <Button
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => handleUpdateStatus(order.pedidoId, "ENTREGADO")}
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Marcar Entregado
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
