# 🌱 EcoMarket - Marketplace Sostenible

Una plataforma de comercio electrónico enfocada en productos ecológicos y sostenibles, desarrollada con arquitectura de microservicios.

## 📋 Descripción del Proyecto

EcoMarket es un marketplace que conecta vendedores de productos ecológicos con consumidores conscientes del medio ambiente. La plataforma incluye funcionalidades completas de e-commerce con un enfoque en la sostenibilidad.

## 🏗️ Arquitectura del Sistema

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.5.6
- **Java**: 17
- **Base de datos**: MySQL
- **Seguridad**: Spring Security + JWT
- **Arquitectura**: Modular por dominios

### Frontend (React + TypeScript)
- **Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 6.4.0
- **UI Library**: Radix UI + Tailwind CSS
- **Componentes**: Sistema de diseño personalizado

## 📁 Estructura del Proyecto

```
Ecomarket_app/
├── market/                    # Backend Spring Boot
│   ├── src/main/java/eco/market/
│   │   ├── config/           # Configuraciones (Security, JWT)
│   │   ├── controller/       # Controladores REST
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # Entidades JPA
│   │   ├── repository/      # Repositorios JPA
│   │   ├── service/         # Lógica de negocio
│   │   └── MarketApplication.java
│   └── pom.xml
├── ecofrotntend/             # Frontend React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   │   ├── ui/         # Componentes UI base
│   │   │   └── figma/      # Componentes de diseño
│   │   ├── styles/         # Estilos globales
│   │   └── App.tsx
│   └── package.json
└── docs/                     # Documentación
    ├── api.md
    ├── architecture.md
    └── onboarding.md
```

## 🚀 Tecnologías Utilizadas

### Backend
- **Spring Boot 3.5.6** - Framework principal
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - Persistencia de datos
- **JWT (JJWT 0.11.5)** - Tokens de autenticación
- **MySQL** - Base de datos principal
- **Spring Boot Mail** - Servicio de correos
- **Maven** - Gestión de dependencias

### Frontend
- **React 18.3.1** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Radix UI** - Componentes accesibles
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconografía
- **React Hook Form** - Manejo de formularios

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

### Backend (Spring Boot)

1. **Clonar el repositorio**
```bash
cd market
```

2. **Configurar base de datos**
```properties
# src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecomarket
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
```

3. **Ejecutar la aplicación**
```bash
./mvnw spring-boot:run
```

El backend estará disponible en `http://localhost:8080`

### Frontend (React)

1. **Instalar dependencias**
```bash
cd ecofrotntend
npm install
```

2. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión

### Productos
- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto
- `GET /api/productos/{id}` - Obtener producto por ID

### Categorías
- `GET /api/categorias` - Listar categorías
- `POST /api/categorias` - Crear categoría

### Notificaciones
- `GET /api/notificaciones` - Listar notificaciones del usuario

## 🎨 Componentes UI Disponibles

### Componentes Base
- **Button** - Botones con variantes
- **Card** - Tarjetas de contenido
- **Input** - Campos de entrada
- **Dialog** - Modales y diálogos
- **Dropdown Menu** - Menús desplegables
- **Avatar** - Avatares de usuario
- **Badge** - Etiquetas y badges

### Componentes de Negocio
- **HomePage** - Página principal
- **ProductCatalog** - Catálogo de productos
- **ProductDetail** - Detalle de producto
- **AuthPage** - Autenticación
- **Checkout** - Proceso de compra
- **AdminPanel** - Panel administrativo
- **VendorDashboard** - Dashboard de vendedores

## 🔐 Seguridad

- **JWT Authentication** - Tokens seguros para autenticación
- **Spring Security** - Configuración de seguridad robusta
- **Password Encoding** - Encriptación BCrypt
- **CORS Configuration** - Configuración de CORS
- **Method Security** - Seguridad a nivel de métodos

## 📊 Base de Datos

### Entidades Principales
- **Usuario** - Información de usuarios
- **Rol** - Roles del sistema
- **Producto** - Catálogo de productos
- **Categoria** - Categorías de productos
- **Notificacion** - Sistema de notificaciones

## 🧪 Testing

### Backend
```bash
./mvnw test
```

### Frontend
```bash
npm run test
```

## 📦 Build y Deployment

### Backend
```bash
./mvnw clean package
java -jar target/market-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
npm run build
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Documentación Adicional

- [API Documentation](docs/api.md)
- [Architecture Guide](docs/architecture.md)
- [Onboarding Guide](docs/onboarding.md)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo de Desarrollo

Desarrollado como proyecto académico para el curso de Desarrollo Web Integrado - CICLO VIII.

---

**EcoMarket** - Construyendo un futuro más sostenible, un producto a la vez. 🌱