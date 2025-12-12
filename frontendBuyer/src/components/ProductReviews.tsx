import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Star, Flag, ThumbsUp } from "lucide-react";
import { API_URL } from "../config";

interface Review {
    resenaId: number;
    usuario: { nombre: string; apellido: string };
    calificacion: number;
    comentario: string;
    fechaCreacion: string;
    esVerificado: boolean;
}

interface ProductReviewsProps {
    productoId: number;
    userHasPurchased?: boolean;
    pedidoId?: number;
}

export function ProductReviews({ productoId, userHasPurchased, pedidoId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [calificacion, setCalificacion] = useState(5);
    const [comentario, setComentario] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        cargarResenas();
    }, [productoId]);

    const cargarResenas = async () => {
        try {
            const response = await fetch(`${API_URL}/resenas/producto/${productoId}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Error loading reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const crearResena = async () => {
        if (!pedidoId) {
            alert("Debes haber comprado este producto para reseñarlo");
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/resenas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    productoId,
                    pedidoId,
                    calificacion,
                    comentario
                })
            });

            if (response.ok) {
                alert("¡Reseña publicada exitosamente!");
                setShowForm(false);
                setComentario("");
                setCalificacion(5);
                cargarResenas();
            } else {
                const error = await response.text();
                alert(error);
            }
        } catch (error) {
            console.error("Error creating review:", error);
            alert("Error al publicar la reseña");
        } finally {
            setSubmitting(false);
        }
    };

    const reportarResena = async (resenaId: number) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/resenas/${resenaId}/reportar`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("Reseña reportada. Será revisada por nuestro equipo.");
            }
        } catch (error) {
            console.error("Error reporting review:", error);
        }
    };

    const renderStars = (rating: number, interactive: boolean = false) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-5 h-5 ${star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
                        onClick={() => interactive && setCalificacion(star)}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return <div className="text-center py-8">Cargando reseñas...</div>;
    }

    const promedioCalificacion = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.calificacion, 0) / reviews.length
        : 0;

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Reseñas de Clientes</h3>
                        <div className="flex items-center gap-3">
                            {renderStars(Math.round(promedioCalificacion))}
                            <span className="text-lg font-semibold">
                                {promedioCalificacion.toFixed(1)} de 5
                            </span>
                            <span className="text-muted-foreground">
                                ({reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"})
                            </span>
                        </div>
                    </div>
                    {userHasPurchased && !showForm && (
                        <Button onClick={() => setShowForm(true)}>
                            Escribir Reseña
                        </Button>
                    )}
                </div>

                {showForm && (
                    <Card className="p-4 mb-6 bg-muted/50">
                        <h4 className="font-semibold mb-3">Tu Reseña</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Calificación
                                </label>
                                {renderStars(calificacion, true)}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Comentario (opcional)
                                </label>
                                <Textarea
                                    value={comentario}
                                    onChange={(e) => setComentario(e.target.value)}
                                    placeholder="Comparte tu experiencia con este producto..."
                                    rows={4}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={crearResena} disabled={submitting}>
                                    {submitting ? "Publicando..." : "Publicar Reseña"}
                                </Button>
                                <Button variant="outline" onClick={() => setShowForm(false)}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            Aún no hay reseñas para este producto. ¡Sé el primero en opinar!
                        </p>
                    ) : (
                        reviews.map((review) => (
                            <Card key={review.resenaId} className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold">
                                                {review.usuario.nombre} {review.usuario.apellido}
                                            </span>
                                            {review.esVerificado && (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                    Compra verificada
                                                </span>
                                            )}
                                        </div>
                                        {renderStars(review.calificacion)}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => reportarResena(review.resenaId)}
                                        title="Reportar reseña"
                                    >
                                        <Flag className="w-4 h-4" />
                                    </Button>
                                </div>
                                {review.comentario && (
                                    <p className="text-muted-foreground mt-2">{review.comentario}</p>
                                )}
                                <p className="text-xs text-muted-foreground mt-2">
                                    {new Date(review.fechaCreacion).toLocaleDateString()}
                                </p>
                            </Card>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
