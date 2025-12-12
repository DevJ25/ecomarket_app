import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { PackageX, Upload, AlertCircle } from "lucide-react";
import { API_URL } from "../config";

interface Devolucion {
  devolucionId: number;
  orden: { pedidoId: number };
  producto: { nombreProducto: string; imagenPrincipal: string };
  cantidad: number;
  motivo: string;
  estado: string;
  fechaSolicitud: string;
  fechaResolucion?: string;
  montoReembolso?: number;
}

interface ReturnFormData {
  pedidoId: string;
  productoId: string;
  cantidad: string;
  motivo: string;
}

interface ReturnsManagementProps {
  onNavigate: (page: string) => void;
}

export function ReturnsManagement({ onNavigate }: ReturnsManagementProps) {
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ReturnFormData>({
    pedidoId: "",
    productoId: "",
    cantidad: "1",
    motivo: ""
  });

  useEffect(() => {
    cargarDevoluciones();
  }, []);

  const cargarDevoluciones = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/devoluciones/comprador`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDevoluciones(data);
      }
    } catch (error) {
      console.error("Error loading returns:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/devoluciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          pedidoId: parseInt(formData.pedidoId),
          productoId: parseInt(formData.productoId),
          cantidad: parseInt(formData.cantidad),
          motivo: formData.motivo
        })
      });

      if (response.ok) {
        alert("Solicitud de devolución enviada correctamente");
        setShowForm(false);
        setFormData({ pedidoId: "", productoId: "", cantidad: "1", motivo: "" });
        cargarDevoluciones();
      } else {
        const error = await response.text();
        alert("Error: " + error);
      }
    } catch (error) {
      console.error("Error creating return:", error);
      alert("Error de conexión");
    }
  };

  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      solicitada: "bg-yellow-500",
      en_revision: "bg-blue-500",
      aprobada: "bg-green-500",
      rechazada: "bg-red-500",
      reembolsada: "bg-purple-500"
    };

    return (
      <Badge className={`${colors[estado] || "bg-gray-500"} text-white`}>
        {estado.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Cargando devoluciones...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <PackageX className="w-8 h-8 text-orange-600" />
          <h1 className="text-3xl font-bold">Mis Devoluciones</h1>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Solicitar Devolución"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8 border-orange-200 bg-orange-50">
          <h2 className="text-xl font-bold mb-4">Nueva Solicitud de Devolución</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pedidoId">ID del Pedido</Label>
                <Input
                  id="pedidoId"
                  type="number"
                  value={formData.pedidoId}
                  onChange={(e) => setFormData({ ...formData, pedidoId: e.target.value })}
                  placeholder="Ej: 123"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productoId">ID del Producto</Label>
                <Input
                  id="productoId"
                  type="number"
                  value={formData.productoId}
                  onChange={(e) => setFormData({ ...formData, productoId: e.target.value })}
                  placeholder="Ej: 456"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo de la Devolución</Label>
              <Textarea
                id="motivo"
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                placeholder="Describe el motivo de tu devolución..."
                rows={4}
                required
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Información importante:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Puedes encontrar los IDs en la sección "Mis Pedidos"</li>
                    <li>El vendedor revisará tu solicitud en 24-48 horas</li>
                    <li>Si es aprobada, recibirás instrucciones para el envío</li>
                  </ul>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Enviar Solicitud
            </Button>
          </form>
        </Card>
      )}

      {devoluciones.length === 0 ? (
        <Card className="p-12 text-center">
          <PackageX className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-muted-foreground">No tienes solicitudes de devolución</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devoluciones.map((devolucion) => (
            <Card key={devolucion.devolucionId} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold mb-1">
                    {devolucion.producto.nombreProducto}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Pedido #{devolucion.orden.pedidoId}
                  </p>
                </div>
                {getEstadoBadge(devolucion.estado)}
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Cantidad:</span>{" "}
                  {devolucion.cantidad}
                </p>
                <p>
                  <span className="text-muted-foreground">Motivo:</span>{" "}
                  {devolucion.motivo}
                </p>
                <p className="text-muted-foreground">
                  Solicitada: {new Date(devolucion.fechaSolicitud).toLocaleDateString()}
                </p>
                {devolucion.fechaResolucion && (
                  <p className="text-muted-foreground">
                    Resuelta: {new Date(devolucion.fechaResolucion).toLocaleDateString()}
                  </p>
                )}
                {devolucion.montoReembolso && (
                  <p className="font-semibold text-green-600">
                    Reembolso: €{devolucion.montoReembolso.toFixed(2)}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
