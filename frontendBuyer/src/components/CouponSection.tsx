import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Tag, Check, X } from "lucide-react";
import { API_URL } from "../config";

interface CouponSectionProps {
    onCouponApplied: (cupon: any) => void;
    subtotal: number;
}

export function CouponSection({ onCouponApplied, subtotal }: CouponSectionProps) {
    const [codigo, setCodigo] = useState("");
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [cuponAplicado, setCuponAplicado] = useState<any>(null);

    const validarCupon = async () => {
        if (!codigo.trim()) {
            setMensaje("Ingresa un código de cupón");
            return;
        }

        setLoading(true);
        setMensaje("");

        try {
            const response = await fetch(`${API_URL}/cupones/validar/${codigo}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.ok) {
                const cupon = await response.json();

                // Verificar compra mínima
                if (cupon.minCompra && subtotal < cupon.minCompra) {
                    setMensaje(`Compra mínima requerida: €${cupon.minCompra}`);
                    setLoading(false);
                    return;
                }

                setCuponAplicado(cupon);
                onCouponApplied(cupon);
                setMensaje("¡Cupón aplicado correctamente!");
            } else {
                const error = await response.text();
                setMensaje(error.replace("Error: ", ""));
            }
        } catch (error) {
            console.error("Error validating coupon:", error);
            setMensaje("Error al validar el cupón");
        } finally {
            setLoading(false);
        }
    };

    const removerCupon = () => {
        setCuponAplicado(null);
        setCodigo("");
        setMensaje("");
        onCouponApplied(null);
    };

    return (
        <Card className="p-4 border-border">
            <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-primary" />
                <Label className="text-foreground font-semibold">Cupón de Descuento</Label>
            </div>

            {!cuponAplicado ? (
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Código de cupón"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                            className="flex-1"
                            disabled={loading}
                        />
                        <Button
                            onClick={validarCupon}
                            disabled={loading}
                            variant="outline"
                        >
                            {loading ? "Validando..." : "Aplicar"}
                        </Button>
                    </div>
                    {mensaje && (
                        <p className={`text-sm ${mensaje.includes("correctamente") ? "text-green-600" : "text-red-600"}`}>
                            {mensaje}
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="font-semibold text-green-800 dark:text-green-200">
                                    {cuponAplicado.codigo}
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    {cuponAplicado.descripcion}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={removerCupon}
                            className="text-green-700 hover:text-green-900"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}
