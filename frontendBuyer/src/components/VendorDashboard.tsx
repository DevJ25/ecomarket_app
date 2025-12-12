import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Package,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Plus,
  Edit,
  Eye,
  Trash2,
  Upload,
  BarChart3,
  Leaf,
  CheckCircle,
  AlertCircle,
  Clock,
  Truck,
  Download,
  Filter,
  Search,
  MoreVertical,
  Sparkles,
  Recycle,
  Sun,
  Droplets,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

interface VendorDashboardProps {
  onNavigate: (page: string) => void;
}

const salesData = [
  { name: "Ene", ventas: 4000, meta: 3800 },
  { name: "Feb", ventas: 3000, meta: 3500 },
  { name: "Mar", ventas: 5000, meta: 4200 },
  { name: "Abr", ventas: 4500, meta: 4400 },
  { name: "May", ventas: 6000, meta: 5200 },
  { name: "Jun", ventas: 5500, meta: 5300 },
];

const categoryData = [
  { name: "Alimentación", value: 45, color: "#4ade80" },
  { name: "Cosmética", value: 25, color: "#60a5fa" },
  { name: "Hogar", value: 15, color: "#c084fc" },
  { name: "Textil", value: 15, color: "#fbbf24" },
];

const products = [
  {
    id: 1,
    name: "Aceite de Oliva Orgánico",
    category: "Alimentación",
    price: 12.99,
    stock: 45,
    sales: 127,
    rating: 4.9,
    status: "active",
    certification: "Certificado Orgánico",
    impact: "Ahorro de 120L de agua",
  },
  {
    id: 2,
    name: "Jabón Natural de Lavanda",
    category: "Cosmética",
    price: 6.5,
    stock: 89,
    sales: 234,
    rating: 4.7,
    status: "active",
    certification: "Cruelty Free",
    impact: "100% Biodegradable",
  },
  {
    id: 3,
    name: "Bolsa Reutilizable Algodón",
    category: "Hogar",
    price: 8.99,
    stock: 12,
    sales: 56,
    rating: 4.8,
    status: "low-stock",
    certification: "Zero Waste",
    impact: "Reemplaza 500 bolsas plásticas",
  },
  {
    id: 4,
    name: "Cepillo de Bambú",
    category: "Cuidado Personal",
    price: 3.99,
    stock: 67,
    sales: 189,
    rating: 4.6,
    status: "active",
    certification: "Biodegradable",
    impact: "Plástico cero",
  },
];

const orders = [
  {
    id: "ECO-1234",
    customer: "María González",
    product: "Aceite de Oliva Orgánico",
    total: 12.99,
    status: "preparing",
    date: "Hoy",
    items: 2,
  },
  {
    id: "ECO-1233",
    customer: "Carlos Ruiz",
    product: "Jabón Natural",
    total: 19.5,
    status: "shipping",
    date: "Ayer",
    items: 3,
  },
  {
    id: "ECO-1232",
    customer: "Ana Martínez",
    product: "Bolsa Reutilizable",
    total: 26.97,
    status: "delivered",
    date: "Hace 2 días",
    items: 3,
  },
  {
    id: "ECO-1231",
    customer: "David López",
    product: "Cepillo de Bambú",
    total: 11.97,
    status: "pending",
    date: "Hace 3 días",
    items: 3,
  },
];

export function VendorDashboard({ onNavigate }: VendorDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [certification, setCertification] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [origin, setOrigin] = useState("");

  const handlePublishProduct = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Publishing product:", {
      productName,
      category,
      certification,
      description,
      price,
      stock,
      origin,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "shipping":
        return <Truck className="w-4 h-4" />;
      case "preparing":
        return <Package className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "shipping":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "preparing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "pending":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header Mejorado */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Leaf className="w-6 h-6 text-emerald-700" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Panel de Vendedor Ecológico
                </h1>
              </div>
              <p className="text-gray-600">
                Gestiona tus productos sostenibles y sigue tu impacto ambiental
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Reporte
              </Button>
              <Button className="bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Novedades
              </Button>
            </div>
          </div>
        </div>

        {/* Impacto Ecológico */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 mb-1">Tu impacto ecológico</p>
                <h3 className="text-2xl font-bold mb-2">+2.4T CO₂ evitadas</h3>
                <p className="text-emerald-100 text-sm">
                  Equivalente a 100 árboles plantados
                </p>
              </div>
              <Recycle className="w-12 h-12 opacity-80" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Droplets className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-600">Agua ahorrada</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">24,560L</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Sun className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-gray-600">Plástico evitado</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">890Kg</div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          {/* Tabs Mejorados */}
          <div className="bg-white rounded-2xl p-1.5 border border-emerald-100 shadow-sm">
            <TabsList className="bg-transparent h-auto p-0 gap-1">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-xl px-6 py-3"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Vista General
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-xl px-6 py-3"
              >
                <Package className="w-4 h-4 mr-2" />
                Mis Productos
              </TabsTrigger>
              <TabsTrigger
                value="add-product"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-xl px-6 py-3"
              >
                <Plus className="w-4 h-4 mr-2" />
                Añadir Producto
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-xl px-6 py-3"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Pedidos
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab - Mejorado */}
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards Mejoradas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  title: "Ventas Totales",
                  value: "€24,567",
                  change: "+12.5%",
                  icon: DollarSign,
                  color: "text-emerald-600",
                  bgColor: "bg-emerald-50",
                },
                {
                  title: "Pedidos",
                  value: "417",
                  change: "+8.2%",
                  icon: ShoppingBag,
                  color: "text-blue-600",
                  bgColor: "bg-blue-50",
                },
                {
                  title: "Productos Activos",
                  value: "23",
                  subtitle: "3 en tendencia",
                  icon: Package,
                  color: "text-purple-600",
                  bgColor: "bg-purple-50",
                },
                {
                  title: "Valoración",
                  value: "4.9 ⭐",
                  subtitle: "523 valoraciones",
                  icon: BarChart3,
                  color: "text-amber-600",
                  bgColor: "bg-amber-50",
                },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 mb-2">{stat.title}</div>
                    {stat.change ? (
                      <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                        <TrendingUp className="w-4 h-4" />
                        {stat.change} vs mes anterior
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {stat.subtitle}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Gráficos Mejorados */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-0 shadow-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Evolución de Ventas
                    </h3>
                    <p className="text-gray-600">Comparativa con metas mensuales</p>
                  </div>
                  <Select defaultValue="6m">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">Último mes</SelectItem>
                      <SelectItem value="3m">Últimos 3 meses</SelectItem>
                      <SelectItem value="6m">Últimos 6 meses</SelectItem>
                      <SelectItem value="1y">Último año</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f7f4" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) => `€${value}`}
                    />
                    <Tooltip
                      formatter={(value) => [`€${value}`, ""]}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #d1fae5',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ventas"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorVentas)"
                      name="Ventas Reales"
                    />
                    <Area
                      type="monotone"
                      dataKey="meta"
                      stroke="#6366f1"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      fillOpacity={1}
                      fill="url(#colorMeta)"
                      name="Meta Mensual"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Gráfico de Categorías */}
              <Card className="border-0 shadow-sm rounded-2xl p-6">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900">
                    Ventas por Categoría
                  </h3>
                  <p className="text-gray-600">Distribución de ingresos</p>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Porcentaje"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Productos y Pedidos Recientes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Productos Recientes Mejorado */}
              <Card className="border-0 shadow-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Productos Destacados
                    </h3>
                    <p className="text-gray-600">Los más vendidos este mes</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    onClick={() => setActiveTab("products")}
                  >
                    Ver Todos
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`text-xs ${product.status === "active"
                                ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                                : "border-amber-200 text-amber-700 bg-amber-50"
                              }`}
                          >
                            {product.status === "active" ? "Activo" : "Stock Bajo"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{product.category}</span>
                          <span>•</span>
                          <span>{product.sales} ventas</span>
                          <span>•</span>
                          <span className="flex items-center">
                            ⭐ {product.rating}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-emerald-700 flex items-center gap-1">
                          <Leaf className="w-3 h-3" />
                          {product.impact}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xl font-bold text-gray-900">
                          €{product.price}
                        </div>
                        <div className="text-sm text-gray-500">
                          Stock: {product.stock}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Pedidos Recientes Mejorado */}
              <Card className="border-0 shadow-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Pedidos Recientes
                    </h3>
                    <p className="text-gray-600">Últimas transacciones</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    onClick={() => setActiveTab("orders")}
                  >
                    Ver Todos
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${getStatusColor(order.status).split(' ')[0]}`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.customer}
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.product}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          €{order.total}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab - Mejorado */}
          <TabsContent value="products">
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Gestión de Productos
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Gestiona tu catálogo de productos ecológicos
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar productos..."
                        className="pl-9 w-64 border-gray-200 focus:border-emerald-300"
                      />
                    </div>
                    <Button variant="outline" className="border-gray-200">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrar
                    </Button>
                    <Button
                      onClick={() => setActiveTab("add-product")}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Producto
                    </Button>
                  </div>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead className="text-gray-600 font-medium">Producto</TableHead>
                    <TableHead className="text-gray-600 font-medium">Categoría</TableHead>
                    <TableHead className="text-gray-600 font-medium">Certificación</TableHead>
                    <TableHead className="text-gray-600 font-medium">Precio</TableHead>
                    <TableHead className="text-gray-600 font-medium">Stock</TableHead>
                    <TableHead className="text-gray-600 font-medium">Ventas</TableHead>
                    <TableHead className="text-gray-600 font-medium">Estado</TableHead>
                    <TableHead className="text-gray-600 font-medium text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="border-gray-100 hover:bg-emerald-50/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-emerald-700" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500" />
                              {product.rating}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-gray-200 text-gray-700">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-gray-700">{product.certification}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        €{product.price}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full ${product.stock > 50
                                  ? "bg-emerald-500"
                                  : product.stock > 20
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                              style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{product.stock}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-700 font-medium">{product.sales}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`
                            ${product.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                            }
                          `}
                        >
                          {product.status === "active" ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Activo
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Stock Bajo
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-emerald-100 text-gray-600 hover:text-emerald-700"
                            title="Vista previa"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-100 text-gray-600 hover:text-blue-700"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-red-100 text-gray-600 hover:text-red-700"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-gray-100 text-gray-600"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Add Product Tab - Mejorado */}
          <TabsContent value="add-product">
            <div className="max-w-4xl mx-auto">
              <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl mb-4">
                      <Leaf className="w-8 h-8 text-emerald-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Añadir Nuevo Producto Ecológico
                    </h3>
                    <p className="text-gray-600">
                      Completa la información de tu producto sostenible
                    </p>
                  </div>

                  <form onSubmit={handlePublishProduct} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="product-name" className="text-gray-700 mb-2 block">
                            <span className="font-medium">Nombre del Producto</span>
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input
                            id="product-name"
                            placeholder="Ej: Aceite de Oliva Orgánico Extra Virgen"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <Label htmlFor="category" className="text-gray-700 mb-2 block">
                            <span className="font-medium">Categoría</span>
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger id="category" className="border-gray-300 focus:border-emerald-500">
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="alimentacion" className="focus:bg-emerald-50">
                                🥕 Alimentación
                              </SelectItem>
                              <SelectItem value="cosmetica" className="focus:bg-emerald-50">
                                🧴 Cosmética Natural
                              </SelectItem>
                              <SelectItem value="textil" className="focus:bg-emerald-50">
                                👕 Textil Sostenible
                              </SelectItem>
                              <SelectItem value="hogar" className="focus:bg-emerald-50">
                                🏠 Hogar Ecológico
                              </SelectItem>
                              <SelectItem value="personal" className="focus:bg-emerald-50">
                                🧼 Cuidado Personal
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="certification" className="text-gray-700 mb-2 block">
                            <span className="font-medium">Certificación Ecológica</span>
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Select value={certification} onValueChange={setCertification}>
                            <SelectTrigger id="certification" className="border-gray-300 focus:border-emerald-500">
                              <SelectValue placeholder="Seleccionar certificación" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="organico" className="focus:bg-emerald-50">
                                🌱 Certificado Orgánico
                              </SelectItem>
                              <SelectItem value="biodegradable" className="focus:bg-emerald-50">
                                ♻️ 100% Biodegradable
                              </SelectItem>
                              <SelectItem value="zero-waste" className="focus:bg-emerald-50">
                                🚯 Zero Waste
                              </SelectItem>
                              <SelectItem value="cruelty-free" className="focus:bg-emerald-50">
                                🐰 Cruelty Free
                              </SelectItem>
                              <SelectItem value="gots" className="focus:bg-emerald-50">
                                🏷️ GOTS Certificado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="price" className="text-gray-700 mb-2 block">
                            <span className="font-medium">Precio (€)</span>
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <Label htmlFor="stock" className="text-gray-700 mb-2 block">
                            <span className="font-medium">Stock Inicial</span>
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input
                            id="stock"
                            type="number"
                            placeholder="0"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <Label htmlFor="origin" className="text-gray-700 mb-2 block">
                            <span className="font-medium">Origen Sostenible</span>
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input
                            id="origin"
                            placeholder="Ej: España (Producción Local)"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-gray-700 mb-2 block">
                        <span className="font-medium">Descripción Ecológica</span>
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe las características ecológicas de tu producto, origen sostenible, proceso de producción responsable, impacto ambiental positivo..."
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                      />
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <Info className="w-4 h-4" />
                        Incluye detalles sobre el impacto ambiental positivo de tu producto
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-700 mb-2 block">
                        <span className="font-medium">Imágenes del Producto</span>
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <div className="border-2 border-dashed border-emerald-200 rounded-2xl p-8 text-center bg-emerald-50/50 hover:border-emerald-300 hover:bg-emerald-50 transition-all cursor-pointer">
                        <Upload className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                        <p className="text-gray-900 font-medium mb-1">
                          Arrastra imágenes aquí o haz clic para seleccionar
                        </p>
                        <p className="text-sm text-gray-600">
                          Recomendado: imágenes de alta calidad (mín. 800x800px)
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-4">
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Formatos: JPG, PNG, WEBP
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Máx. 10MB por imagen
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 flex-1 py-3 text-base"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Publicar Producto Ecológico
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3 text-base"
                      >
                        Guardar como Borrador
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab - Mejorado */}
          <TabsContent value="orders">
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Gestión de Pedidos
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Administra y sigue tus pedidos ecológicos
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40 border-gray-300">
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="preparing">En preparación</SelectItem>
                        <SelectItem value="shipping">En envío</SelectItem>
                        <SelectItem value="delivered">Entregados</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Pedidos
                    </Button>
                  </div>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead className="text-gray-600 font-medium">Pedido</TableHead>
                    <TableHead className="text-gray-600 font-medium">Cliente</TableHead>
                    <TableHead className="text-gray-600 font-medium">Productos</TableHead>
                    <TableHead className="text-gray-600 font-medium">Total</TableHead>
                    <TableHead className="text-gray-600 font-medium">Estado</TableHead>
                    <TableHead className="text-gray-600 font-medium">Fecha</TableHead>
                    <TableHead className="text-gray-600 font-medium text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-gray-100 hover:bg-emerald-50/30">
                      <TableCell>
                        <div className="font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-600">{order.items} items</div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {order.customer}
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-700">{order.product}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">€{order.total}</div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status === "delivered" && "Entregado"}
                          {order.status === "shipping" && "En envío"}
                          {order.status === "preparing" && "En preparación"}
                          {order.status === "pending" && "Pendiente"}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{order.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                          >
                            <Truck className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Componente Star adicional para las valoraciones
const Star = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
      clipRule="evenodd"
    />
  </svg>
);

// Componente Info adicional
const Info = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);