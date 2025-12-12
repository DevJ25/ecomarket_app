import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { API_URL } from "../config";

interface ProductsProps {
    onNavigate: (page: string) => void;
}

export function Products({ onNavigate }: ProductsProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form state
    const [nombreProducto, setNombreProducto] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [categoriaId, setCategoriaId] = useState("");

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/productos/vendedor`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            // Preparar datos del producto
            const productData = {
                nombreProducto: nombreProducto.trim(),
                descripcion: descripcion.trim(),
                precio: parseFloat(precio),
                stock: parseInt(stock),
                categoriaId: parseInt(categoriaId),
                imagenPrincipal: null, // Sin imagen por ahora
                esOrganico: false,
                esVegano: false
            };

            console.log("Enviando producto:", productData);

            const response = await fetch(`${API_URL}/productos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Producto creado exitosamente:", data);
                alert("¡Producto creado exitosamente!");
                setIsAdding(false);
                // Reset form
                setNombreProducto("");
                setDescripcion("");
                setPrecio("");
                setStock("");
                setCategoriaId("");
                // Refresh products list
                fetchMyProducts();
            } else {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                alert("Error al crear producto: " + errorText);
            }
        } catch (error) {
            console.error("Error creating product:", error);
            alert("Error de conexión al crear producto");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("Producto eliminado exitosamente");
                fetchMyProducts();
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    if (isAdding) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
                <div className="max-w-3xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => setIsAdding(false)}
                        className="mb-6 text-slate-400 hover:text-slate-100"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver a Productos
                    </Button>

                    <Card className="p-8 bg-slate-900 border-slate-800">
                        <h2 className="text-2xl font-bold mb-6">Añadir Nuevo Producto</h2>
                        <form onSubmit={handleCreateProduct} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre del Producto *</Label>
                                <Input
                                    id="nombre"
                                    placeholder="Ej: Aceite de Oliva Orgánico"
                                    value={nombreProducto}
                                    onChange={(e) => setNombreProducto(e.target.value)}
                                    required
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción *</Label>
                                <Textarea
                                    id="descripcion"
                                    placeholder="Describe tu producto..."
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    required
                                    rows={4}
                                    className="bg-slate-800 border-slate-700 text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="precio">Precio (€) *</Label>
                                    <Input
                                        id="precio"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={precio}
                                        onChange={(e) => setPrecio(e.target.value)}
                                        required
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock *</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        placeholder="0"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        required
                                        className="bg-slate-800 border-slate-700 text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="categoria">Categoría *</Label>
                                <Select value={categoriaId} onValueChange={setCategoriaId} required>
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Seleccionar categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Alimentos Frescos</SelectItem>
                                        <SelectItem value="2">Cosméticos Naturales</SelectItem>
                                        <SelectItem value="3">Ropa Sostenible</SelectItem>
                                        <SelectItem value="4">Productos de Limpieza</SelectItem>
                                        <SelectItem value="5">Accesorios Eco</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {loading ? "Creando..." : "Crear Producto"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAdding(false)}
                                    className="border-slate-700 text-slate-300"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Mis Productos</h1>
                        <p className="text-slate-400 mt-1">
                            Gestiona tu catálogo de productos
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onNavigate("dashboard")}
                            className="border-slate-700 text-slate-300"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                        <Button
                            onClick={() => setIsAdding(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Producto
                        </Button>
                    </div>
                </div>

                <Card className="bg-slate-900 border-slate-800">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800">
                                <TableHead className="text-slate-400">Producto</TableHead>
                                <TableHead className="text-slate-400">Descripción</TableHead>
                                <TableHead className="text-slate-400">Precio</TableHead>
                                <TableHead className="text-slate-400">Stock</TableHead>
                                <TableHead className="text-slate-400">Estado</TableHead>
                                <TableHead className="text-slate-400">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                                        No tienes productos aún. ¡Crea tu primer producto!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.productoId} className="border-slate-800">
                                        <TableCell className="font-medium text-white">
                                            {product.nombreProducto}
                                        </TableCell>
                                        <TableCell className="text-slate-400">
                                            {product.descripcion?.substring(0, 50)}...
                                        </TableCell>
                                        <TableCell className="text-white">
                                            €{product.precio}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={product.stock > 10 ? "default" : "destructive"}
                                                className={product.stock > 10 ? "bg-green-600" : ""}
                                            >
                                                {product.stock}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-blue-600">Activo</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-blue-400 hover:text-blue-300 hover:bg-slate-800"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteProduct(product.productoId)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-slate-800"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}
