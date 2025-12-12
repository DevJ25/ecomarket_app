import { useCart } from "../lib/CartContext";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Trash2, Plus, Minus, ChevronLeft } from "lucide-react";

interface CartPageProps {
    onNavigate: (page: string) => void;
}

export function CartPage({ onNavigate }: CartPageProps) {
    const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
                <p className="text-muted-foreground mb-8">¡Agrega algunos productos ecológicos!</p>
                <Button onClick={() => onNavigate("catalog")}>Ir al Catálogo</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                onClick={() => onNavigate("catalog")}
                className="mb-6"
            >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Seguir Comprando
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <Card key={item.id} className="p-4 flex gap-4 items-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-primary font-bold">€{item.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive/90"
                                onClick={() => removeFromCart(item.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </Card>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <Card className="p-6 sticky top-24">
                        <h3 className="text-xl font-bold mb-4">Resumen del Pedido</h3>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>€{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Envío</span>
                                <span>Gratis</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>€{cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button
                            className="w-full mb-2"
                            size="lg"
                            onClick={() => onNavigate("checkout")}
                        >
                            Proceder al Pago
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={clearCart}
                        >
                            Vaciar Carrito
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
