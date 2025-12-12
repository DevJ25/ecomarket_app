import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { API_URL } from "../config";

export function VerifyAccount() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
            setStatus("error");
            setMessage("Token de verificación no encontrado.");
            return;
        }

        verifyToken(token);
    }, []);


    // ...
    const verifyToken = async (token: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/verify?token=${token}`);

            if (response.ok) {
                setStatus("success");
                setMessage("¡Tu cuenta ha sido verificada exitosamente!");
            } else {
                const errorText = await response.text();
                setStatus("error");
                setMessage(errorText || "Error al verificar la cuenta.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Error de conexión. Inténtalo más tarde.");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 text-center">
                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Verificando cuenta...</h2>
                        <p className="text-muted-foreground">Por favor espera un momento.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">¡Verificación Exitosa!</h2>
                        <p className="text-muted-foreground mb-6">{message}</p>
                        <Button onClick={() => window.location.href = "/"} className="w-full">
                            Iniciar Sesión
                        </Button>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Error de Verificación</h2>
                        <p className="text-muted-foreground mb-6">{message}</p>
                        <Button onClick={() => window.location.href = "/"} variant="outline" className="w-full">
                            Volver al Inicio
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
