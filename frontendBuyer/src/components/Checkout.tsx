import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { API_URL } from "../config";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  ShoppingCart,
  CreditCard,
  Truck,
  CheckCircle2,
  ChevronRight,
  Leaf
} from "lucide-react";
import { useCart } from "../lib/CartContext";

interface CheckoutProps {
  onNavigate: (page: string) => void;
}

export function Checkout({ onNavigate }: CheckoutProps) {
  const { items, cartTotal, checkout } = useCart();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [cuponAplicado, setCuponAplicado] = useState<any>(null);
  const [couponCode, setCouponCode] = useState("");
  const [cuponError, setCuponError] = useState("");

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCuponError("");

    try {
      const response = await fetch(`${API_URL}/cupones/validar/${couponCode}`);

      if (response.ok) {
        const cupon = await response.json();

        // Validate minimum purchase
        if (cupon.minCompra && cartTotal < cupon.minCompra) {
          setCuponError(`La compra mínima es de €${cupon.minCompra}`);
          return;
        }

        setCuponAplicado(cupon);
      } else {
        const errorData = await response.text();
        // Extract error message from response or check status
        if (response.status === 404) {
          setCuponError("Cupón no encontrado");
        } else {
          try {
            const jsonError = JSON.parse(errorData);
            setCuponError(jsonError.message || "Cupón no válido");
          } catch {
            setCuponError("Cupón no válido");
          }
        }
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      setCuponError("Error al validar el cupón");
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: ""
  });

  const shippingCost = shippingMethod === "express" ? 5.99 : 0;

  // Calculate discount
  let descuento = 0;
  if (cuponAplicado) {
    if (cuponAplicado.tipoDescuento === "porcentaje") {
      descuento = (cartTotal * cuponAplicado.valorDescuento) / 100;
      if (cuponAplicado.maximoDescuento && descuento > cuponAplicado.maximoDescuento) {
        descuento = cuponAplicado.maximoDescuento;
      }
    } else {
      descuento = cuponAplicado.valorDescuento;
    }
  }

  const total = cartTotal + shippingCost - descuento;

  useEffect(() => {
    if (items.length === 0 && step === 1) {
      // Redirect to catalog if cart is empty (optional, or show empty state)
    }
  }, [items, step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.postalCode}`;
      const success = await checkout(fullAddress, paymentMethod);

      if (success) {
        setStep(4);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Carrito", icon: ShoppingCart },
    { number: 2, title: "Envío", icon: Truck },
    { number: 3, title: "Pago", icon: CreditCard },
    { number: 4, title: "Confirmación", icon: CheckCircle2 },
  ];

  if (items.length === 0 && step === 1) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
          <Button onClick={() => onNavigate("catalog")}>Ir al Catálogo</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${step >= s.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                      }`}
                  >
                    <s.icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-sm ${step >= s.number ? "text-foreground" : "text-muted-foreground"
                      }`}
                  >
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight
                    className={`w-6 h-6 mx-2 ${step > s.number ? "text-primary" : "text-muted-foreground"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Cart */}
            {step === 1 && (
              <Card className="p-6 border-border">
                <h2 className="text-foreground mb-6">Tu Carrito</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-muted/30 rounded-lg"
                    >
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-foreground mb-1">{item.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Cantidad: {item.quantity}
                        </p>
                        <div className="text-primary">
                          €{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setStep(2)}
                  className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continuar al Envío
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Card>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <Card className="p-6 border-border">
                <h2 className="text-foreground mb-6">Dirección de Envío</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Juan" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos</Label>
                      <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Pérez" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="Calle Principal 123" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input id="city" value={formData.city} onChange={handleInputChange} placeholder="Madrid" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Código Postal</Label>
                      <Input id="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="28001" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+34 600 000 000" />
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <Label>Método de Envío</Label>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:border-primary">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-foreground">Envío Estándar</div>
                              <div className="text-sm text-muted-foreground">
                                Entrega en 3-5 días laborables
                              </div>
                            </div>
                            <div className="text-primary">Gratis</div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:border-primary">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-foreground">Envío Express</div>
                              <div className="text-sm text-muted-foreground">
                                Entrega en 24-48 horas
                              </div>
                            </div>
                            <div className="text-primary">€5.99</div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Volver
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Continuar al Pago
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <Card className="p-6 border-border">
                <h2 className="text-foreground mb-6">Información de Pago</h2>
                <div className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:border-primary">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="text-foreground">Tarjeta de Crédito/Débito</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:border-primary">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                        <div className="text-foreground">PayPal</div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Fecha de Expiración</Label>
                          <Input id="expiry" placeholder="MM/AA" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                        <Input id="cardName" placeholder="Juan Pérez" />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1"
                    >
                      Volver
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {loading ? "Procesando Pago..." : "Confirmar Pedido"}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <Card className="p-8 border-border text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-foreground mb-2">¡Pedido Confirmado!</h2>
                <p className="text-muted-foreground mb-6">
                  Gracias por tu compra. Recibirás un correo con los detalles de tu pedido.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onNavigate("orders")}
                    className="flex-1"
                  >
                    Ver Pedido
                  </Button>
                  <Button
                    onClick={() => onNavigate("home")}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Volver al Inicio
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-border sticky top-24">
              <h3 className="text-foreground mb-4">Resumen del Pedido</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Envío</span>
                  <span>{shippingCost === 0 ? "Gratis" : `€${shippingCost.toFixed(2)}`}</span>
                </div>
                <Separator />

                {/* Coupon Section */}
                <div className="space-y-2">
                  <Label htmlFor="coupon">Cupón de descuento</Label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      placeholder="Código"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!!cuponAplicado}
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode || !!cuponAplicado}
                    >
                      {cuponAplicado ? "Aplicado" : "Aplicar"}
                    </Button>
                  </div>
                  {cuponError && (
                    <p className="text-red-500 text-xs">{cuponError}</p>
                  )}
                  {cuponAplicado && (
                    <p className="text-green-500 text-xs">
                      Cupón {cuponAplicado.codigo} aplicado correctamente
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between text-foreground">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex items-center justify-between text-green-500 text-sm">
                    <span>Descuento aplicado</span>
                    <span>-€{descuento.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-2">
                  <Leaf className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-foreground text-sm mb-1">Compra Sostenible</h4>
                    <p className="text-xs text-muted-foreground">
                      Este pedido compensa 2.5kg de CO₂ y apoya a productores locales
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
