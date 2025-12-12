import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Plus, Edit, Trash2, ChevronLeft } from "lucide-react";
import { API_URL } from "../config";

// Updated interface to match backend entity
interface Product {
    producto_id: number;
    nombre_producto: string;
    precio: number;
    stock: number;
    imagen_principal: string;
}

interface ProductListProps {
    onNavigate: (page: string, params?: any) => void;
}

export function ProductList({ onNavigate }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            // Corrected endpoint
            const response = await fetch(`${API_URL}/products/my-products`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                console.error("Failed to fetch products");
                alert("Error al cargar tus productos. Por favor, intenta iniciar sesión de nuevo.");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;

        try {
            const token = localStorage.getItem("token");
            // Corrected endpoint
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Filter using the correct property name
                setProducts(products.filter((p) => p.producto_id !== id));
            } else {
                alert("Error al eliminar producto");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    if (loading) return <div className="text-white p-8">Cargando productos...</div>;

    return (
        <div className="p-8 bg-slate-950 min-h-screen text-slate-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => onNavigate("dashboard")}>
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <h1 className="text-3xl font-bold">Mis Productos</h1>
                    </div>
                    <Button
                        onClick={() => onNavigate("product-form")}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Producto
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <Card key={product.producto_id} className="bg-slate-900 border-slate-800 overflow-hidden">
                            <div className="aspect-video relative">
                                <img
                                    src={product.imagen_principal || "https://via.placeholder.com/300"}
                                    alt={product.nombre_producto}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2">{product.nombre_producto}</h3>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xl font-bold text-blue-400">€{product.precio}</span>
                                    <span className="text-sm text-slate-400">Stock: {product.stock}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-slate-700 hover:bg-slate-800"
                                        onClick={() => onNavigate("product-form", { id: product.producto_id })}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(product.producto_id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
