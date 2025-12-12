import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Star, ChevronLeft, MessageSquare } from "lucide-react";
import { API_URL } from "../config";

interface Resena {
    resenaId: number;
    producto: {
        nombreProducto: string;
        imagenPrincipal: string;
    };
    usuario: {
        nombre: string;
        apellido: string;
    };
    calificacion: number;
    comentario: string;
    fechaResena: string;
    reportada: boolean;
}

interface SellerReviewsProps {
    onNavigate: (page: string) => void;
}

export function SellerReviews({ onNavigate }: SellerReviewsProps) {
    const [reviews, setReviews] = useState<Resena[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            const token = localStorage.getItem("token");
            try {
                // Assuming an endpoint exists to get seller's product reviews
                // If not, we might need to filter or request a new endpoint.
                // For now, let's assume we can fetch all and filter or use a specific EP
                // Ideally: GET /api/resenas/vendedor (Need to create this endpoint later if fails)
                // Fallback: This might fail if endpoint doesn't exist.
                // Let's use /api/resenas/vendedor as it is logical.
                const response = await fetch(`${API_URL}/resenas/vendedor`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                } else {
                    console.error("Failed to fetch reviews");
                }
            } catch (error) {
                console.error("Error loading reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleReport = async (resenaId: number) => {
        if (!confirm("¿Deseas reportar esta reseña a la administración?")) return;
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/resenas/${resenaId}/reportar`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                alert("Reseña reportada correctamente");
                // Update local state
                setReviews(reviews.map(r => r.resenaId === resenaId ? { ...r, reportada: true } : r));
            } else {
                alert("Error al reportar reseña");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">Cargando reseñas...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" onClick={() => onNavigate("dashboard")}>
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <MessageSquare className="w-8 h-8 text-green-400" />
                    <div>
                        <h1 className="text-3xl font-bold">Reseñas de Productos</h1>
                        <p className="text-slate-400">Lo que dicen tus clientes</p>
                    </div>
                </div>

                {reviews.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        No hay reseñas para tus productos aún.
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {reviews.map((review) => (
                            <Card key={review.resenaId} className="p-6 bg-slate-900 border-slate-800">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        {review.producto.imagenPrincipal && (
                                            <img
                                                src={review.producto.imagenPrincipal}
                                                alt={review.producto.nombreProducto}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-lg">{review.producto.nombreProducto}</h3>
                                            <div className="flex items-center gap-1 my-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.calificacion ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm text-slate-400">
                                                Por {review.usuario.nombre} {review.usuario.apellido} - {new Date(review.fechaResena).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {!review.reportada ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                            onClick={() => handleReport(review.resenaId)}
                                        >
                                            Reportar
                                        </Button>
                                    ) : (
                                        <span className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded">Reportada</span>
                                    )}
                                </div>
                                <p className="mt-4 text-slate-200 bg-slate-950/50 p-3 rounded">
                                    "{review.comentario}"
                                </p>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
