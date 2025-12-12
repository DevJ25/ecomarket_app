import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Package, Truck } from "lucide-react";
import { API_URL } from "../config";

interface ShippingFormProps {
    pedidoId: number;
    onSuccess: () => void;
    onCancel: () => void;
}

export function ShippingForm({ pedidoId, onSuccess, onCancel }: ShippingFormProps) {
    const [codigoSeguimiento, setCodigoSeguimiento] = useState("");
    const [transportista, setTransportista] = useState("");
    const [fechaEstimada, setFechaEstimada] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/envios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    pedidoId,
                    codigoSeguimiento,
                    transportista,
                    estadoEnvio: "en_transito",
                    fechaEstimadaEntrega: fechaEstimada
                })
            });

            if (response.ok) {
                alert("Información de envío agregada correctamente");
                onSuccess();
            } else {
                const error = await response.text();
                alert("Error: " + error);
            }
        } catch (error) {
            console.error("Error creating shipping:", error);
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6 bg-slate-800 border-slate-700">
            <div className="flex items-center gap-2 mb-4">
                <Truck className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-slate-100">Información de Envío</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="transportista" className="text-slate-200">
                        Transportista
                    </Label>
                    <Select value={transportista} onValueChange={setTransportista}>
                        <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
                            <SelectValue placeholder="Selecciona transportista" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DHL">DHL</SelectItem>
                            <SelectItem value="FedEx">FedEx</SelectItem>
                            <SelectItem value="UPS">UPS</SelectItem>
                            <SelectItem value="Correos">Correos</SelectItem>
                            <SelectItem value="SEUR">SEUR</SelectItem>
                            <SelectItem value="MRW">MRW</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="codigoSeguimiento" className="text-slate-200">
                        Código de Seguimiento
                    </Label>
                    <Input
                        id="codigoSeguimiento"
                        value={codigoSeguimiento}
                        onChange={(e) => setCodigoSeguimiento(e.target.value)}
                        placeholder="Ej: 1234567890"
                        required
                        className="bg-slate-900 border-slate-700 text-slate-100"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fechaEstimada" className="text-slate-200">
                        Fecha Estimada de Entrega
                    </Label>
                    <Input
                        id="fechaEstimada"
                        type="date"
                        value={fechaEstimada}
                        onChange={(e) => setFechaEstimada(e.target.value)}
                        required
                        className="bg-slate-900 border-slate-700 text-slate-100"
                    />
                </div>

                <div className="flex gap-2 pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                        <Package className="w-4 h-4 mr-2" />
                        {loading ? "Guardando..." : "Guardar Información"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1 border-slate-700 text-slate-200 hover:bg-slate-700"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </Card>
    );
}
