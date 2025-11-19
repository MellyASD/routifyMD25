<p align="center">
  <img src="src/assets/logo.png" alt="Logo" width="120"/>
</p
# Routify

Una aplicación web para comparar todos los modos de transporte en un solo lugar. RoutifyMD25 es una API backend modular construida con NestJS, diseñada para respaldar sistemas de transporte inteligente. Ofrece autenticación segura, gestión de usuarios y rutas, comparación de trayectos y registro persistente de logs, todo estructurado para ser escalable y mantenible.

# Descripción general
Este proyecto es una API RESTful desarrollada con NestJS y TypeORM, diseñada para crear comparaciones entre múltiples modos de transporte —como automóvil, bicicleta, transporte público y caminata— basándose en datos específicos de cada ruta. Esta API ayuda a los usuarios a tomar decisiones de viaje informadas al evaluar tiempo, costo y confiabilidad entre las distintas opciones.

# Propósito
Las decisiones de movilidad modernas están fragmentadas. Los usuarios deben alternar entre múltiples aplicaciones y fuentes para comparar modos de transporte, lo que a menudo lleva a elecciones lentas y subóptimas. Routify resuelve esto al ofrecer una solución unificada para la comparación multimodal de rutas, respaldada por un backend robusto y modular.
# Funcionalidades
- Autenticación con JWT y control de acceso basado en roles
- Registro de usuarios, inicio de sesión y gestión de perfiles
- Creación, actualización y consulta de rutas de transporte
- Comparación de rutas y seguimiento del historial
- Sistema de logs persistente en base de datos
- Pruebas unitarias e integradas con Jest + Supertest
- Arquitectura modular basada en NestJS

# Tecnologías utilizadas

Layer               Technology
Backend             Nest JS
Database            TypeORM + MySQL
Auth                Passport + LWT  
Testing             Jest + Supertest
Documentation       Swagger

# Requisitos
- Node.js
- MySQL
- npm

# Instalación
- Clona el repositorio:
git clone <repositorio>
cd Routify
- Instala las dependencias:
npm install
- Configura las variables de entorno:
- Crea un archivo .env en la raíz del proyecto
- Copia el contenido de .env.example y ajusta los valores según sea necesario
- Configura la base de datos:
npm run typeorm migration:run



# Ejecutar la aplicación
- Modo desarrollo:
npm run start:dev
- Compilación para producción:
npm run build
npm run start:prod


# Estructura del proyecto
Routify/
├── src/
│   ├── assets/                 # Archivos adicionales como logos
│   ├── common/                 # Pipes y utilidades compartidas
│   ├── dto/                    # Objetos de transferencia de datos
│   ├── entities/               # Entidades de base de datos
│   ├── interfaces/             # Interfaces TypeScript
│   ├── migrations/             # Migraciones de base de datos
│   └── modules/                # Módulos de la aplicación
│       ├── auth/               # Módulo de autenticación (JWT, Passport)
│       ├── comparisons/        # Lógica de comparación de modos de transporte
│       ├── logs/               # Interceptor y persistencia de logs
│       ├── services/           # Servicios para simulaciones
│       ├── transport/          # Motor de simulación de rutas
│       └── users/              # Gestión de usuarios
└── test/                       # Pruebas unitarias e integradas
.env.example                    # Plantilla de variables de entorno



# Endpoints de la API
Autenticación
POST   /auth/register         → Registrar nuevo usuario
POST   /auth/login            → Autenticar y obtener token JWT


Usuarios
GET    /users                 → Obtener todos los usuarios (solo admin)
GET    /users/:id             → Obtener usuario por ID
PATCH  /users/:id             → Actualizar información del usuario
DELETE /users/:id             → Eliminar usuario


Transporte
GET    /transport             → Obtener todas las rutas de transporte
POST   /transport             → Crear nueva ruta
GET    /transport/:id         → Obtener ruta por ID
PATCH  /transport/:id         → Actualizar ruta
DELETE /transport/:id         → Eliminar ruta


Comparaciones
POST   /comparisons           → Comparar dos o más rutas de transporte
GET    /comparisons/history   → Obtener historial de comparaciones previas

Registro de logs 

![Logs en base de datos](src/assets/image.png)

Pruebas
npm run test
npm run test:cov


![Testings](src/assets/test.png)
