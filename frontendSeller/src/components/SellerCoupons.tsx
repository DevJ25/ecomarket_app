import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Ticket, Plus, Trash2, ChevronLeft, Save } from "lucide-react";
import { API_URL } from "../config";

interface Cupon {
    cuponId: number;
    codigo: string;
    descripcion: string;
    tipoDescuento: string;
    valorDescuento: number;
    minCompra?: number;
    maximoDescuento?: number;
    usosMaximos: number;
    usosActuales: number;
    fechaInicio: string;
    fechaFin: string;
    estaActivo: boolean;
}

interface SellerCouponsProps {
    onNavigate: (page: string) => void;
}

export function SellerCoupons({ onNavigate }: SellerCouponsProps) {
    const [cupones, setCupones] = useState<Cupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        codigo: "",
        descripcion: "",
        tipoDescuento: "porcentaje",
        valorDescuento: "",
        minCompra: "",
        maximoDescuento: "",
        usosMaximos: "",
        fechaInicio: "",
        fechaFin: ""
    });

    useEffect(() => {
        cargarCupones();
    }, []);

    const cargarCupones = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/cupones/activos`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setCupones(data);
            }
        } catch (error) {
            console.error("Error loading coupons:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSelectChange = (value: string) => {
        setFormData({ ...formData, tipoDescuento: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            // Convert strings to appropriate types
            const payload = {
                codigo: formData.codigo.toUpperCase(),
                descripcion: formData.descripcion,
                tipoDescuento: formData.tipoDescuento,
                valorDescuento: parseFloat(formData.valorDescuento),
                minCompra: formData.minCompra ? parseFloat(formData.minCompra) : null,
                maximoDescuento: formData.maximoDescuento ? parseFloat(formData.maximoDescuento) : null,
                usosMaximos: parseInt(formData.usosMaximos),
                // Use local string directly to avoid UTC conversion shifts
                // Input format is YYYY-MM-DDTHH:mm, we append :00 for seconds
                fechaInicio: formData.fechaInicio ? `${formData.fechaInicio}:00` : new Date().toISOString(),
                fechaFin: formData.fechaFin ? `${formData.fechaFin}:00` : new Date().toISOString(),
                estaActivo: true
            };

            const response = await fetch(`${API_URL}/cupones`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Cupón creado exitosamente");
                setShowForm(false);
                cargarCupones();
                // Reset form
                setFormData({
                    codigo: "",
                    descripcion: "",
                    tipoDescuento: "porcentaje",
                    valorDescuento: "",
                    minCompra: "",
                    maximoDescuento: "",
                    usosMaximos: "",
                    fechaInicio: "",
                    fechaFin: ""
                });
            } else {
                alert("Error al crear el cupón");
            }
        } catch (error) {
            console.error("Error creating coupon:", error);
            alert("Error de conexión");
        }
    };

    const eliminarCupon = async (id: number) => {
        if (!confirm("¿Estás seguro de desactivar este cupón?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/cupones/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                cargarCupones();
            } else {
                alert("Error al eliminar cupón");
            }
        } catch (error) {
            console.error("Error deleting coupon:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
                <p>Cargando cupones...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => onNavigate("dashboard")}>
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <Ticket className="w-8 h-8 text-green-400" />
                        <div>
                            <h1 className="text-3xl font-bold">Gestión de Cupones</h1>
                            <p className="text-slate-400">Crea y administra descuentos para tus clientes</p>
                        </div>
                    </div>
                    {!showForm && (
                        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Cupón
                        </Button>
                    )}
                </div>

                {showForm ? (
                    <Card className="max-w-2xl mx-auto p-6 bg-slate-900 border-slate-800">
                        <h2 className="text-xl font-bold mb-6">Crear Nuevo Cupón</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="codigo">Código</Label>
                                    <Input
                                        id="codigo"
                                        value={formData.codigo}
                                        onChange={handleInputChange}
                                        placeholder="EJ: VERANO2025"
                                        className="bg-slate-800 border-slate-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tipoDescuento">Tipo de Descuento</Label>
                                    <Select
                                        value={formData.tipoDescuento}
                                        onValueChange={handleSelectChange}
                                    >
                                        <SelectTrigger className="bg-slate-800 border-slate-700">
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700">
                                            <SelectItem value="porcentaje">Porcentaje (%)</SelectItem>
                                            <SelectItem value="fijo">Monto Fijo (€)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Input
                                    id="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    placeholder="Descripción del descuento"
                                    className="bg-slate-800 border-slate-700"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="valorDescuento">Valor del Descuento</Label>
                                    <Input
                                        id="valorDescuento"
                                        type="number"
                                        step="0.01"
                                        value={formData.valorDescuento}
                                        onChange={handleInputChange}
                                        placeholder="10.00"
                                        className="bg-slate-800 border-slate-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="usosMaximos">Usos Máximos</Label>
                                    <Input
                                        id="usosMaximos"
                                        type="number"
                                        value={formData.usosMaximos}
                                        onChange={handleInputChange}
                                        placeholder="100"
                                        className="bg-slate-800 border-slate-700"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="minCompra">Compra Mínima (Opcional)</Label>
                                    <Input
                                        id="minCompra"
                                        type="number"
                                        step="0.01"
                                        value={formData.minCompra}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        className="bg-slate-800 border-slate-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maximoDescuento">Tope de Descuento (Opcional)</Label>
                                    <Input
                                        id="maximoDescuento"
                                        type="number"
                                        step="0.01"
                                        value={formData.maximoDescuento}
                                        onChange={handleInputChange}
                                        placeholder="50.00"
                                        className="bg-slate-800 border-slate-700"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                                    <Input
                                        id="fechaInicio"
                                        type="datetime-local"
                                        value={formData.fechaInicio}
                                        onChange={handleInputChange}
                                        className="bg-slate-800 border-slate-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fechaFin">Fecha Fin</Label>
                                    <Input
                                        id="fechaFin"
                                        type="datetime-local"
                                        value={formData.fechaFin}
                                        onChange={handleInputChange}
                                        className="bg-slate-800 border-slate-700"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar Cupón
                                </Button>
                            </div>
                        </form>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cupones.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-slate-500">
                                No tienes cupones activos. ¡Crea uno para impulsar tus ventas!
                            </div>
                        ) : (
                            cupones.map((cupon) => (
                                <Card key={cupon.cuponId} className="p-6 bg-slate-900 border-slate-800 relative group">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge variant="outline" className="text-green-400 border-green-400">
                                            {cupon.codigo}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-500 hover:text-red-500"
                                            onClick={() => eliminarCupon(cupon.cuponId)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{cupon.descripcion}</h3>
                                    <div className="space-y-2 text-sm text-slate-400">
                                        <p>
                                            Descuento: <span className="text-white font-medium">
                                                {cupon.tipoDescuento === 'porcentaje' ? `${cupon.valorDescuento}%` : `€${cupon.valorDescuento}`}
                                            </span>
                                        </p>
                                        <p>Usos: {cupon.usosActuales} / {cupon.usosMaximos}</p>
                                        <p>Vence: {new Date(cupon.fechaFin).toLocaleDateString()}</p>
                                    </div>
                                    {cupon.minCompra && (
                                        <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
                                            Mín. compra: €{cupon.minCompra}
                                        </div>
                                    )}
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
