# Sistema de Control de Activo Fijo

Aplicación web completa para gestión de activos fijos empresariales.

## Requisitos

- Node.js 18 o superior
- npm 8 o superior

## Instalación

```bash
# 1. Instala dependencias (solo primera vez)
npm install

# 2. Inicia el servidor
npm start
```

Luego abre tu navegador en: **http://localhost:3000**

## Credenciales por defecto

| Usuario | Contraseña |
|---------|------------|
| admin   | admin123   |

> ⚠️ Cambia la contraseña del administrador después del primer inicio de sesión.

## Uso en producción

Para correr en un servidor real (VPS, Linux):

```bash
# Con PM2 (recomendado)
npm install -g pm2
pm2 start server.js --name activo-fijo
pm2 save
pm2 startup

# O directamente con un puerto específico
PORT=8080 node server.js
```

## Despliegue en Railway / Render / Fly.io

Este proyecto es compatible con cualquier plataforma que soporte Node.js:

1. Sube la carpeta al repositorio Git
2. Conecta el repositorio en la plataforma
3. Comando de inicio: `npm start`
4. Puerto: usa la variable de entorno `PORT` (ya configurada)

## Estructura del proyecto

```
activo-fijo/
├── server.js          ← Servidor Express + API REST
├── package.json       ← Dependencias
├── data/
│   └── db.json        ← Base de datos (JSON, auto-creada)
└── public/
    └── index.html     ← Aplicación web completa (SPA)
```

## Base de datos

Los datos se guardan en `data/db.json`. Para hacer backup:
```bash
cp data/db.json data/db_backup_$(date +%Y%m%d).json
```

## Funcionalidades incluidas

- ✅ Múltiples empresas con activos compartidos
- ✅ Categorías con depreciación configurable por categoría
- ✅ Activos tecnológicos, mobiliario, equipo gastronómico, etc.
- ✅ Asignación de activos a empleados con hoja de entrega imprimible
- ✅ Traslados entre responsables y empresas
- ✅ Historial completo de movimientos
- ✅ Control de garantías con alertas de vencimiento
- ✅ Bajas (falla, robo, obsolescencia, pieza, venta, etc.)
- ✅ Bodega: vista de activos sin asignar
- ✅ Depreciación visual con valor residual
- ✅ Expediente por empleado (útil para liquidaciones)
- ✅ Informes para contabilidad (depreciación anual)
- ✅ Inventario por empresa
- ✅ Gestión de usuarios con roles y permisos
- ✅ Login con sesiones seguras
- ✅ Datos persistidos en disco (JSON)
