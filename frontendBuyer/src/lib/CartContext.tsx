import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../config";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any) => Promise<void>;
    removeFromCart: (id: number) => Promise<void>;
    updateQuantity: (id: number, quantity: number) => Promise<void>;
    clearCart: () => void; // For now, this will be a local clear
    cartCount: number;
    cartTotal: number;
    loading: boolean;
    checkout: (address: string, paymentMethod: string) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Error parsing cart from localStorage", e);
            }
        }
        setLoading(false);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addToCart = async (product: any) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, {
                id: product.id,
                name: product.nombreProducto || product.name,
                price: product.precio || product.price,
                image: product.imagenPrincipal || product.image,
                quantity: 1
            }];
        });
    };

    const removeFromCart = async (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = async (id: number, quantity: number) => {
        if (quantity < 1) {
            return removeFromCart(id);
        }
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem("cart");
    };

    const checkout = async (address: string, paymentMethod: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Debes iniciar sesión para comprar");
            return false;
        }

        const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const orderData = {
            direccionEnvio: address,
            metodoPago: paymentMethod,
            total: total,
            detalles: items.map(item => ({
                productoId: item.id,
                cantidad: item.quantity,
                precioUnitario: item.price
            }))
        };

        try {
            const response = await fetch(`${API_URL}/pedidos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                // Clear cart after successful order
                // Optionally call backend to clear cart if endpoint existed
                setItems([]);
                return true;
            } else {
                const error = await response.text();
                alert("Error al procesar el pedido: " + error);
                return false;
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Error de conexión");
            return false;
        }
    };

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
                loading,
                checkout,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
