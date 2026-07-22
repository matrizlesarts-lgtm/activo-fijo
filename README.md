# Control de Activo Fijo — Railway

## Despliegue en Railway (paso a paso)

### 1. Subir código a GitHub
- Crea un repositorio nuevo en github.com (puede ser privado)
- Sube todos estos archivos

### 2. Crear servicio en Railway
- En tu proyecto de Railway, haz clic en **+ New** → **GitHub Repo**
- Selecciona el repositorio que acabas de crear
- Railway detecta Node.js automáticamente y despliega

### 3. Agregar Volume persistente (MUY IMPORTANTE)
Sin este paso los datos se pierden al reiniciar:
- En el servicio desplegado, haz clic en **+ Add Volume**
- Mount Path: `/volume`
- Haz clic en **Add**
- Railway reinicia el servicio automáticamente

### 4. Listo
Tu app estará disponible en la URL que Railway te asigna:
`https://tu-proyecto.up.railway.app`

Usuario: `admin`  
Contraseña: `admin123`

---

## Cómo funciona el almacenamiento

- En Railway: los datos se guardan en `/volume/data/db.json` (persistente)
- En local: los datos se guardan en `./data/db.json`
- La app detecta automáticamente dónde está corriendo

## Correr en local

```bash
npm install
npm start
# Abrir http://localhost:3000
```
