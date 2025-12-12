import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { PackageX, CheckCircle, XCircle, Eye, ChevronLeft } from "lucide-react";
import { API_URL } from "../config";

interface Devolucion {
    devolucionId: number;
    orden: { pedidoId: number };
    producto: { nombreProducto: string; imagenPrincipal: string };
    cantidad: number;
    motivo: string;
    estado: string;
    fechaSolicitud: string;
    imagenEvidencia?: string;
    usuario: { nombre: string; apellido: string };
}

interface SellerReturnsProps {
    onNavigate: (page: string) => void;
}

export function SellerReturns({ onNavigate }: SellerReturnsProps) {
    const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDevolucion, setSelectedDevolucion] = useState<Devolucion | null>(null);

    useEffect(() => {
        cargarDevoluciones();
    }, []);

    const cargarDevoluciones = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/devoluciones/vendedor`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDevoluciones(data);
            }
        } catch (error) {
            console.error("Error loading returns:", error);
        } finally {
            setLoading(false);
        }
    };

    const actualizarEstado = async (devolucionId: number, nuevoEstado: string) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${API_URL}/devoluciones/${devolucionId}/estado?estado=${nuevoEstado}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                alert(`Devolución ${nuevoEstado === "aprobada" ? "aprobada" : "rechazada"}`);
                cargarDevoluciones();
                setSelectedDevolucion(null);
            } else {
                alert("Error al actualizar el estado");
            }
        } catch (error) {
            console.error("Error updating return status:", error);
            alert("Error de conexión");
        }
    };

    const getEstadoBadge = (estado: string) => {
        const colors: Record<string, string> = {
            solicitada: "bg-yellow-500",
            en_revision: "bg-blue-500",
            aprobada: "bg-green-500",
            rechazada: "bg-red-500",
            reembolsada: "bg-purple-500"
        };

        return (
            <Badge className={`${colors[estado] || "bg-gray-500"} text-white`}>
                {estado.toUpperCase()}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
                <p>Cargando devoluciones...</p>
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
                    <PackageX className="w-8 h-8 text-orange-400" />
                    <h1 className="text-3xl font-bold">Gestión de Devoluciones</h1>
                </div>

                {devoluciones.length === 0 ? (
                    <Card className="p-12 text-center bg-slate-900 border-slate-800">
                        <PackageX className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                        <p className="text-slate-400">No hay solicitudes de devolución</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {devoluciones.map((devolucion) => (
                            <Card
                                key={devolucion.devolucionId}
                                className="p-6 bg-slate-900 border-slate-800"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">
                                            {devolucion.producto.nombreProducto}
                                        </h3>
                                        <p className="text-sm text-slate-400">
                                            Cliente: {devolucion.usuario.nombre} {devolucion.usuario.apellido}
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            Pedido #{devolucion.orden.pedidoId}
                                        </p>
                                    </div>
                                    {getEstadoBadge(devolucion.estado)}
                                </div>

                                <div className="space-y-2 mb-4">
                                    <p className="text-sm">
                                        <span className="text-slate-400">Cantidad:</span>{" "}
                                        {devolucion.cantidad}
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-slate-400">Motivo:</span>{" "}
                                        {devolucion.motivo}
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Solicitada: {new Date(devolucion.fechaSolicitud).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {devolucion.imagenEvidencia && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedDevolucion(devolucion)}
                                            className="border-slate-700 text-slate-200"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            Ver Evidencia
                                        </Button>
                                    )}
                                    {devolucion.estado === "solicitada" && (
                                        <>
                                            <Button
                                                size="sm"
                                                onClick={() => actualizarEstado(devolucion.devolucionId, "aprobada")}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Aprobar
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => actualizarEstado(devolucion.devolucionId, "rechazada")}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Rechazar
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Modal para ver evidencia */}
                {selectedDevolucion && (
                    <div
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedDevolucion(null)}
                    >
                        <Card
                            className="max-w-2xl w-full bg-slate-900 border-slate-800 p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold mb-4">Evidencia de Devolución</h3>
                            {selectedDevolucion.imagenEvidencia ? (
                                <img
                                    src={selectedDevolucion.imagenEvidencia}
                                    alt="Evidencia"
                                    className="w-full rounded-lg mb-4"
                                />
                            ) : (
                                <p className="text-slate-400">No hay evidencia fotográfica</p>
                            )}
                            <Button
                                onClick={() => setSelectedDevolucion(null)}
                                className="w-full"
                            >
                                Cerrar
                            </Button>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
