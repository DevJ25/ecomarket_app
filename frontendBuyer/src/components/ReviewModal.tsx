import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";
import { API_URL } from "../config";
import { toast } from "sonner";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productoId: number;
    pedidoId: number;
    productName: string;
    onReviewSubmit: () => void;
}

export function ReviewModal({ isOpen, onClose, productoId, pedidoId, productName, onReviewSubmit }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setLoading(true);

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
                    calificacion: rating,
                    comentario: comment
                })
            });

            if (response.ok) {
                toast.success("¡Gracias por tu reseña!");
                onReviewSubmit();
                onClose();
            } else {
                toast.error("Error al enviar reseña");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Calificar {productName}</DialogTitle>
                    <DialogDescription>
                        Cuéntanos qué te pareció este producto. Tu opinión ayuda a otros compradores.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center gap-2 py-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                        </button>
                    ))}
                </div>
                <Textarea
                    placeholder="Escribe tu opinión sobre el producto..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px]"
                />
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={loading || rating === 0}>
                        {loading ? "Enviando..." : "Enviar Reseña"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
