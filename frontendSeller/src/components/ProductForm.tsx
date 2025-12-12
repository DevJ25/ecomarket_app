import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ChevronLeft } from "lucide-react";
import { API_URL } from "../config";

interface ProductFormProps {
    onNavigate: (page: string) => void;
    // The component receives the whole params object, so we expect an id property inside
    params?: { id?: number };
}

export function ProductForm({ onNavigate, params }: ProductFormProps) {
    const productId = params?.id;

    const [formData, setFormData] = useState({
        nombre_producto: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagen_principal: "",
        es_organico: false,
    });

    useEffect(() => {
        if (productId) {
            fetchProduct(productId);
        }
    }, [productId]);

    const fetchProduct = async (id: number) => {
        try {
            // No token needed for public GET endpoint
            const response = await fetch(`${API_URL}/productos/${id}`);
            if (response.ok) {
                const data = await response.json();
                // Map backend data to form state
                setFormData({
                    nombre_producto: data.nombreProducto,
                    descripcion: data.descripcion,
                    precio: data.precio.toString(),
                    stock: data.stock.toString(),
                    imagen_principal: data.imagenPrincipal || "",
                    es_organico: data.esOrganico,
                });
            } else {
                alert("Error al cargar el producto para editar.");
            }
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, es_organico: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const url = productId
                ? `${API_URL}/productos/${productId}`
                : `${API_URL}/productos`;

            const method = productId ? "PUT" : "POST";

            const payload = {
                nombreProducto: formData.nombre_producto,
                descripcion: formData.descripcion,
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock),
                imagenPrincipal: formData.imagen_principal,
                esOrganico: formData.es_organico,
                categoriaId: 1, // Default category, you may want to add category selection
            };

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert(productId ? "Producto actualizado" : "Producto creado");
                onNavigate("products");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "No se pudo guardar el producto."}`);
            }
        } catch (error) {
            console.error("Error saving product:", error);
            alert("Error de conexión");
        }
    };

    return (
        <div className="p-8 bg-slate-950 min-h-screen text-slate-100">
            <div className="max-w-3xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => onNavigate("products")}
                    className="mb-6 text-slate-400 hover:text-white"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Volver a Productos
                </Button>

                <Card className="bg-slate-900 border-slate-800 p-6">
                    <h2 className="text-2xl font-bold mb-6">
                        {productId ? "Editar Producto" : "Nuevo Producto"}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Nombre del Producto</Label>
                            <Input
                                name="nombre_producto"
                                value={formData.nombre_producto}
                                onChange={handleChange}
                                className="bg-slate-950 border-slate-800"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Descripción</Label>
                            <Textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={(e: any) => handleChange(e)}
                                className="bg-slate-950 border-slate-800"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Precio (€)</Label>
                                <Input
                                    type="number"
                                    name="precio"
                                    step="0.01"
                                    value={formData.precio}
                                    onChange={handleChange}
                                    className="bg-slate-950 border-slate-800"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Stock</Label>
                                <Input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    className="bg-slate-950 border-slate-800"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>URL de Imagen</Label>
                            <Input
                                name="imagen_principal"
                                value={formData.imagen_principal}
                                onChange={handleChange}
                                className="bg-slate-950 border-slate-800"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="es_organico"
                                checked={formData.es_organico}
                                onCheckedChange={handleCheckboxChange}
                            />
                            <label
                                htmlFor="es_organico"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                ¿Es Orgánico?
                            </label>
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                            {productId ? "Guardar Cambios" : "Crear Producto"}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
