import { Button } from "./ui/button";

interface DashboardProps {
    onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        onNavigate("auth");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Panel de Vendedor</h1>
                        {user.nombre && (
                            <p className="text-slate-400 mt-1">
                                Hola, {user.nombre} ({user.email})
                            </p>
                        )}
                    </div>
                    <Button onClick={handleLogout} variant="destructive">
                        Cerrar Sesión
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <h3 className="text-xl font-semibold mb-2">Productos</h3>
                        <p className="text-slate-400 mb-4">Gestiona tu inventario</p>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => onNavigate("products")}
                        >
                            Ver Productos
                        </Button>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <h3 className="text-xl font-semibold mb-2">Pedidos</h3>
                        <p className="text-slate-400 mb-4">Revisa tus ventas recientes</p>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => onNavigate("orders")}
                        >
                            Ver Pedidos
                        </Button>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <h3 className="text-xl font-semibold mb-2">Devoluciones</h3>
                        <p className="text-slate-400 mb-4">Gestiona solicitudes de devolución</p>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => onNavigate("returns")}
                        >
                            Ver Devoluciones
                        </Button>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <h3 className="text-xl font-semibold mb-2">Cupones</h3>
                        <p className="text-slate-400 mb-4">Crea descuentos y promociones</p>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => onNavigate("coupons")}
                        >
                            Ver Cupones
                        </Button>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <h3 className="text-xl font-semibold mb-2">Reseñas</h3>
                        <p className="text-slate-400 mb-4">Lo que dicen tus clientes</p>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => onNavigate("reviews")}
                        >
                            Ver Reseñas
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
