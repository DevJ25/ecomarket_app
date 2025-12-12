import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Store, Mail, Lock, User, Phone } from "lucide-react";
import { API_URL } from "../config";
import VerificationModal from "./VerificationModal";

interface AuthPageProps {
    onNavigate: (page: string) => void;
}

export function AuthPage({ onNavigate }: AuthPageProps) {
    const [activeTab, setActiveTab] = useState("login");

    // State for Login form
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // State for Register form
    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPhone, setRegisterPhone] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerConfirm, setRegisterConfirm] = useState("");

    // Verification modal state
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Extraer token de la estructura: {mensaje: "...", usuario: {token, ...}}
                const token = data.usuario?.token || data.token;
                const usuario = data.usuario || data;

                if (token) {
                    localStorage.setItem("token", token);
                    // Guardar información del usuario para que el Header la detecte
                    localStorage.setItem("user", JSON.stringify({
                        id: usuario.usuarioId || usuario.id,
                        nombre: usuario.nombre,
                        email: usuario.email,
                        rol: usuario.rol || usuario.rolNombre
                    }));
                    alert("Inicio de sesión exitoso!");
                    onNavigate("dashboard");
                } else {
                    alert("Error: No se recibió token de autenticación");
                }
            } else {
                const error = await response.text();
                alert("Error al iniciar sesión: " + error);
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Error de conexión");
        }
    };

    const handleRegister = async () => {
        if (registerPassword !== registerConfirm) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            // Split name into first and last name roughly
            const [nombre, ...apellidoParts] = registerName.split(" ");
            const apellido = apellidoParts.join(" ") || ".";

            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombre,
                    apellido: apellido,
                    email: registerEmail,
                    password: registerPassword,
                    telefono: registerPhone,
                    rol: "VENDEDOR"
                }),
            });

            if (response.ok) {
                // No se recibe token en el registro, solo después de verificar
                setVerificationEmail(registerEmail);
                setShowVerificationModal(true);
                alert("Registro de vendedor exitoso! Por favor, verifica tu email con el código que te enviamos.");
            } else {
                const error = await response.text();
                alert("Error al registrarse: " + error);
            }
        } catch (error) {
            console.error("Register error:", error);
            alert("Error de conexión");
        }
    };

    const handleVerified = () => {
        setShowVerificationModal(false);
        alert("¡Email verificado! Ahora puedes iniciar sesión.");
        setActiveTab("login");
        // Pre-fill login email
        setLoginEmail(verificationEmail);
    };

    return (
        <>
            {showVerificationModal && (
                <VerificationModal
                    email={verificationEmail}
                    onVerified={handleVerified}
                    onClose={() => setShowVerificationModal(false)}
                />
            )}

            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <Card className="w-full max-w-md p-8 border-slate-800 bg-slate-900 text-slate-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Store className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Panel de Vendedor</h2>
                        <p className="text-slate-400">
                            Gestiona tu negocio en Ecomarket
                        </p>
                    </div>

                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-800">
                            <TabsTrigger value="login" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">Iniciar Sesión</TabsTrigger>
                            <TabsTrigger value="register" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">Registrarse</TabsTrigger>
                        </TabsList>

                        {/* Login Tab */}
                        <TabsContent value="login" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email" className="text-slate-200">Correo Electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="tu@negocio.com"
                                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password" className="text-slate-200">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <Input
                                        id="login-password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleLogin}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Acceder al Panel
                            </Button>
                        </TabsContent>

                        {/* Register Tab */}
                        <TabsContent value="register" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="register-name" className="text-slate-200">Nombre Completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <Input
                                        id="register-name"
                                        type="text"
                                        placeholder="Juan Pérez"
                                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                        value={registerName}
                                        onChange={(e) => setRegisterName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="register-email" className="text-slate-200">Correo Electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <Input
                                        id="register-email"
                                        type="email"
                                        placeholder="tu@negocio.com"
                                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="register-phone" className="text-slate-200">Teléfono</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <Input
                                        id="register-phone"
                                        type="tel"
                                        placeholder="+34 600 000 000"
                                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                        value={registerPhone}
                                        onChange={(e) => setRegisterPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="register-password" className="text-slate-200">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <Input
                                        id="register-password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="register-confirm" className="text-slate-200">Confirmar Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                                    <Input
                                        id="register-confirm"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                                        value={registerConfirm}
                                        onChange={(e) => setRegisterConfirm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleRegister}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Registrar Cuenta de Vendedor
                            </Button>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </>
    );
}
