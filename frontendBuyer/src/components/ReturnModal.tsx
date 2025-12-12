import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { API_URL } from "../config";
import { toast } from "sonner";

interface ReturnModalProps {
    isOpen: boolean;
    onClose: () => void;
    productoId: number;
    pedidoId: number;
    productName: string;
    maxQuantity: number;
    onReturnSubmit: () => void;
}

export function ReturnModal({ isOpen, onClose, productoId, pedidoId, productName, maxQuantity, onReturnSubmit }: ReturnModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [reason, setReason] = useState("");
    const [explanation, setExplanation] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!reason) return;
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/devoluciones`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    pedidoId,
                    productoId,
                    cantidad: quantity,
                    motivo: `${reason}: ${explanation}`,
                    imagenEvidencia: "" // Optional: implement image upload if needed
                })
            });

            if (response.ok) {
                toast.success("Solicitud de devolución enviada con éxito");
                onReturnSubmit();
                onClose();
            } else {
                const errorData = await response.text();
                toast.error(`Error al solicitar devolución: ${errorData}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Devolver {productName}</DialogTitle>
                    <DialogDescription>
                        Complete el formulario para solicitar la devolución.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Motivo de la devolución</Label>
                        <Select onValueChange={setReason} value={reason}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un motivo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="defective">Producto defectuoso</SelectItem>
                                <SelectItem value="wrong_item">Producto incorrecto</SelectItem>
                                <SelectItem value="expired">Producto vencido</SelectItem>
                                <SelectItem value="not_satisfied">No satisfecho con la calidad</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Cantidad (Máx: {maxQuantity})</Label>
                        <Input
                            type="number"
                            min={1}
                            max={maxQuantity}
                            value={quantity}
                            onChange={(e) => setQuantity(Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Detalles adicionales</Label>
                        <Textarea
                            placeholder="Explica el problema en detalle..."
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={loading || !reason}>
                        {loading ? "Enviando..." : "Solicitar Devolución"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
