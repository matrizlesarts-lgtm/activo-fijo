/**
 * Control de Activo Fijo — Servidor Express
 * Compatible con Railway (Volume persistente en /volume/data)
 * También funciona en local (guarda en ./data)
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');

// ── Ruta de datos: Railway monta el volume en /volume, localmente usa ./data ──
const DATA_DIR  = process.env.RAILWAY_VOLUME_MOUNT_PATH
  ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'data')
  : path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

console.log('📁 Directorio de datos:', DATA_DIR);

// ── Base de datos JSON ────────────────────────────────────────────────────────
function loadDB() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error leyendo db.json:', e.message);
  }
  return initDB();
}

function saveDB(db) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error('Error guardando db.json:', e.message);
  }
}

function initDB() {
  return {
    empresas: [
      { id: 1, nombre: 'Empresa Principal S.A.', ruc: '0614-180503-001-5', contacto: 'Carlos Méndez', tel: '2222-0001', direccion: 'San Salvador' },
      { id: 2, nombre: 'Subsidiaria Norte Ltda.', ruc: '0614-200112-003-2', contacto: 'Ana López', tel: '2222-0002', direccion: 'Santa Ana' }
    ],
    categorias: [
      { id: 1, nombre: 'Computadora de escritorio', tipo: 'tecnologico', vidaUtil: 5, depreciacion: 20, descripcion: '' },
      { id: 2, nombre: 'Laptop', tipo: 'tecnologico', vidaUtil: 4, depreciacion: 25, descripcion: '' },
      { id: 3, nombre: 'Periféricos (mouse/teclado)', tipo: 'tecnologico', vidaUtil: 3, depreciacion: 33, descripcion: '' },
      { id: 4, nombre: 'Almacenamiento (USB/disco)', tipo: 'tecnologico', vidaUtil: 3, depreciacion: 33, descripcion: '' },
      { id: 5, nombre: 'Equipo fotográfico', tipo: 'tecnologico', vidaUtil: 5, depreciacion: 20, descripcion: '' },
      { id: 6, nombre: 'Impresora', tipo: 'tecnologico', vidaUtil: 4, depreciacion: 25, descripcion: '' },
      { id: 7, nombre: 'Cámara de seguridad', tipo: 'tecnologico', vidaUtil: 5, depreciacion: 20, descripcion: '' },
      { id: 8, nombre: 'Mobiliario', tipo: 'mobiliario', vidaUtil: 10, depreciacion: 10, descripcion: '' },
      { id: 9, nombre: 'Equipo gastronómico', tipo: 'gastronomico', vidaUtil: 8, depreciacion: 12.5, descripcion: '' },
      { id: 10, nombre: 'Refrigeración', tipo: 'gastronomico', vidaUtil: 10, depreciacion: 10, descripcion: '' }
    ],
    areas: [
      { id: 1, nombre: 'Tecnología', empresaId: 1, responsable: '', descripcion: '' },
      { id: 2, nombre: 'Administración', empresaId: 1, responsable: '', descripcion: '' },
      { id: 3, nombre: 'Cocina', empresaId: 2, responsable: '', descripcion: '' }
    ],
    empleados: [
      { id: 1, nombre: 'Juan Carlos Ramos', dui: '01234567-8', cargo: 'Coordinador TI', areaId: 1, empresaId: 1, correo: 'jramos@empresa.com', telefono: '7777-1111', estado: 'activo' },
      { id: 2, nombre: 'María Fernanda López', dui: '02345678-9', cargo: 'Asistente Administrativa', areaId: 2, empresaId: 1, correo: 'mlopez@empresa.com', telefono: '7777-2222', estado: 'activo' },
      { id: 3, nombre: 'Roberto Fuentes', dui: '03456789-0', cargo: 'Chef Principal', areaId: 3, empresaId: 2, correo: 'rfuentes@norte.com', telefono: '7777-3333', estado: 'activo' }
    ],
    activos: [
      { id: 1, codigo: 'AF-001', descripcion: 'Laptop HP ProBook 450', categoriaId: 2, empresaId: 1, areaId: 1, marca: 'HP', modelo: 'ProBook 450', serie: 'SN123456', color: 'Gris', costo: 850, condicion: 'bueno', notas: '', fechaCompra: '2023-01-15', proveedor: 'TecnoShop', factura: 'F-0001', montoFactura: 850, garantia: 12, vencGarantia: '2024-01-15', vidaUtil: 4, especificaciones: 'Intel i5, 8GB RAM, 256GB SSD', accesorios: ['Cargador', 'Funda'], estado: 'activo' },
      { id: 2, codigo: 'AF-002', descripcion: 'Mouse Logitech MX', categoriaId: 3, empresaId: 1, areaId: 1, marca: 'Logitech', modelo: 'MX Master 3', serie: 'SN789012', color: 'Negro', costo: 45, condicion: 'nuevo', notas: '', fechaCompra: '2024-03-01', proveedor: 'OfficeMax', factura: 'F-0022', montoFactura: 45, garantia: 12, vencGarantia: '2025-03-01', vidaUtil: 3, especificaciones: '', accesorios: [], estado: 'activo' },
      { id: 3, codigo: 'AF-003', descripcion: 'Refrigeradora Mabe 18 pies', categoriaId: 10, empresaId: 2, areaId: 3, marca: 'Mabe', modelo: 'RME518PYMRE0', serie: 'SN345678', color: 'Plateado', costo: 650, condicion: 'nuevo', notas: '', fechaCompra: '2024-06-01', proveedor: 'Almacenes Simán', factura: 'F-0055', montoFactura: 650, garantia: 24, vencGarantia: '2026-06-01', vidaUtil: 10, especificaciones: '18 pies, No Frost', accesorios: [], estado: 'activo' }
    ],
    asignaciones: [
      { id: 1, activoId: 1, empleadoId: 1, empresaUsoId: 1, fecha: '2024-01-20', condicionEntrega: 'bueno', entregadoPor: 'Admin', observaciones: 'Entregado en buenas condiciones', estado: 'activo' },
      { id: 2, activoId: 2, empleadoId: 1, empresaUsoId: 1, fecha: '2024-03-05', condicionEntrega: 'nuevo', entregadoPor: 'Admin', observaciones: '', estado: 'activo' },
      { id: 3, activoId: 3, empleadoId: 3, empresaUsoId: 2, fecha: '2024-06-10', condicionEntrega: 'nuevo', entregadoPor: 'Admin', observaciones: '', estado: 'activo' }
    ],
    traslados: [],
    bajas: [],
    historial: [
      { id: 1, tipo: 'alta', activoId: 1, empleadoId: null, fecha: '2024-01-15', descripcion: 'Activo registrado en el sistema', empresaId: 1 },
      { id: 2, tipo: 'asignacion', activoId: 1, empleadoId: 1, fecha: '2024-01-20', descripcion: 'Asignado a Juan Carlos Ramos', empresaId: 1 },
      { id: 3, tipo: 'alta', activoId: 2, empleadoId: null, fecha: '2024-03-01', descripcion: 'Activo registrado en el sistema', empresaId: 1 },
      { id: 4, tipo: 'asignacion', activoId: 2, empleadoId: 1, fecha: '2024-03-05', descripcion: 'Asignado a Juan Carlos Ramos', empresaId: 1 },
      { id: 5, tipo: 'alta', activoId: 3, empleadoId: null, fecha: '2024-06-01', descripcion: 'Activo registrado en el sistema', empresaId: 2 },
      { id: 6, tipo: 'asignacion', activoId: 3, empleadoId: 3, fecha: '2024-06-10', descripcion: 'Asignado a Roberto Fuentes', empresaId: 2 }
    ],
    usuarios: [
      { id: 1, usuario: 'admin', password: 'admin123', nombre: 'Administrador', rol: 'admin', empresaId: '', estado: 'activo' }
    ],
    sesiones: {}
  };
}

let db = loadDB();

// ── Helpers ───────────────────────────────────────────────────────────────────
function nextId(arr) {
  return (arr.length === 0 ? 0 : Math.max(...arr.map(x => x.id))) + 1;
}
function today() {
  return new Date().toISOString().split('T')[0];
}
function jsonRes(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data));
}
function parseBody(req) {
  return new Promise(resolve => {
    let b = '';
    req.on('data', c => b += c);
    req.on('end', () => { try { resolve(JSON.parse(b)); } catch { resolve({}); } });
  });
}
function getSession(req) {
  const cookie = req.headers.cookie || '';
  const m = cookie.match(/session=([^;]+)/);
  if (!m) return null;
  return db.sesiones[m[1]] || null;
}
function requireAuth(req, res) {
  const s = getSession(req);
  if (!s) { jsonRes(res, 401, { error: 'No autenticado' }); return false; }
  return s;
}

// ── CRUD genérico ─────────────────────────────────────────────────────────────
function crudHandler(tabla, req, res, parts) {
  const id = parts[2] ? parseInt(parts[2]) : null;

  if (req.method === 'GET') {
    if (id) {
      const item = db[tabla].find(x => x.id === id);
      return item ? jsonRes(res, 200, item) : jsonRes(res, 404, { error: 'No encontrado' });
    }
    return jsonRes(res, 200, db[tabla]);
  }
  if (req.method === 'POST') {
    return parseBody(req).then(body => {
      body.id = nextId(db[tabla]);
      db[tabla].push(body);
      saveDB(db);
      jsonRes(res, 201, body);
    });
  }
  if (req.method === 'PUT' && id) {
    return parseBody(req).then(body => {
      const i = db[tabla].findIndex(x => x.id === id);
      if (i < 0) return jsonRes(res, 404, { error: 'No encontrado' });
      db[tabla][i] = { ...db[tabla][i], ...body, id };
      saveDB(db);
      jsonRes(res, 200, db[tabla][i]);
    });
  }
  if (req.method === 'DELETE' && id) {
    const i = db[tabla].findIndex(x => x.id === id);
    if (i < 0) return jsonRes(res, 404, { error: 'No encontrado' });
    db[tabla].splice(i, 1);
    saveDB(db);
    return jsonRes(res, 200, { ok: true });
  }
  jsonRes(res, 405, { error: 'Método no permitido' });
}

// ── Tipos MIME ────────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.ico':  'image/x-icon',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
};

// ── Servidor HTTP ─────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  const parsed  = url.parse(req.url, true);
  const pathname = parsed.pathname;
  const parts   = pathname.split('/').filter(Boolean);

  // ── API ───────────────────────────────────────────────────────────────────
  if (parts[0] === 'api') {

    // Login
    if (parts[1] === 'login' && req.method === 'POST') {
      const body = await parseBody(req);
      const user = db.usuarios.find(u =>
        u.usuario === body.usuario &&
        u.password === body.password &&
        u.estado === 'activo'
      );
      if (!user) return jsonRes(res, 401, { error: 'Credenciales incorrectas' });
      const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
      db.sesiones[token] = { userId: user.id, rol: user.rol, empresaId: user.empresaId };
      saveDB(db);
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': `session=${token}; HttpOnly; Path=/; SameSite=Lax`,
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(JSON.stringify({
        ok: true,
        user: { id: user.id, nombre: user.nombre, rol: user.rol, empresaId: user.empresaId }
      }));
    }

    // Logout
    if (parts[1] === 'logout' && req.method === 'POST') {
      const cookie = req.headers.cookie || '';
      const m = cookie.match(/session=([^;]+)/);
      if (m) { delete db.sesiones[m[1]]; saveDB(db); }
      res.writeHead(200, { 'Set-Cookie': 'session=; Max-Age=0; Path=/', 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true }));
    }

    // Whoami
    if (parts[1] === 'me' && req.method === 'GET') {
      const sess = getSession(req);
      if (!sess) return jsonRes(res, 401, { error: 'No autenticado' });
      const user = db.usuarios.find(u => u.id === sess.userId);
      return jsonRes(res, 200, user
        ? { id: user.id, nombre: user.nombre, rol: user.rol, empresaId: user.empresaId }
        : { error: 'No encontrado' }
      );
    }

    // Health check para Railway
    if (parts[1] === 'health' && req.method === 'GET') {
      return jsonRes(res, 200, { status: 'ok', dataFile: DATA_FILE, exists: fs.existsSync(DATA_FILE) });
    }

    // Auth guard
    if (!requireAuth(req, res)) return;

    // Tablas CRUD
    const TABLAS = ['empresas','categorias','areas','empleados','activos','asignaciones','traslados','bajas','historial','usuarios'];
    if (TABLAS.includes(parts[1])) {
      return crudHandler(parts[1], req, res, parts);
    }

    // Traslado de responsable
    if (parts[1] === 'traslado-responsable' && req.method === 'POST') {
      const { activoId, aEmpleadoId, empresaDestinoId, condicionRecibe, motivo, observaciones, fecha } = await parseBody(req);
      const asigActual = db.asignaciones.filter(a => a.activoId === activoId && a.estado === 'activo').slice(-1)[0];
      const deEmpleadoId = asigActual ? asigActual.empleadoId : null;
      if (asigActual) {
        const i = db.asignaciones.findIndex(x => x.id === asigActual.id);
        db.asignaciones[i].estado = 'trasladado';
        db.asignaciones[i].fechaDevolucion = fecha;
      }
      const nuevaAsig = {
        id: nextId(db.asignaciones), activoId, empleadoId: aEmpleadoId,
        empresaUsoId: empresaDestinoId, fecha, condicionEntrega: condicionRecibe,
        entregadoPor: deEmpleadoId ? (db.empleados.find(e => e.id === deEmpleadoId) || {}).nombre || '' : '',
        observaciones: observaciones || '', estado: 'activo'
      };
      db.asignaciones.push(nuevaAsig);
      const traslado = {
        id: nextId(db.traslados), activoId, deEmpleadoId, aEmpleadoId,
        empresaDestinoId, fecha, condicionRecibe, motivo: motivo || '', observaciones: observaciones || ''
      };
      db.traslados.push(traslado);
      const empDe = db.empleados.find(e => e.id === deEmpleadoId);
      const empA  = db.empleados.find(e => e.id === aEmpleadoId);
      const empEm = db.empresas.find(e => e.id === empresaDestinoId);
      db.historial.push({
        id: nextId(db.historial), tipo: 'traslado', activoId, empleadoId: aEmpleadoId, fecha,
        descripcion: `Trasladado de ${empDe ? empDe.nombre : 'sin asignar'} a ${empA ? empA.nombre : '?'} (${empEm ? empEm.nombre : ''}) — Condición: ${condicionRecibe}`,
        empresaId: empresaDestinoId
      });
      saveDB(db);
      return jsonRes(res, 200, { ok: true, traslado, asignacion: nuevaAsig });
    }

    // Dar de baja
    if (parts[1] === 'dar-baja' && req.method === 'POST') {
      const { activoId, fecha, tipo, motivo, autorizado, reporte } = await parseBody(req);
      const baja = { id: nextId(db.bajas), activoId, fecha, tipo, motivo: motivo || '', autorizado: autorizado || '', reporte: reporte || '' };
      db.bajas.push(baja);
      const ai = db.activos.findIndex(x => x.id === activoId);
      if (ai >= 0) db.activos[ai].estado = 'baja';
      const asigActual = db.asignaciones.filter(a => a.activoId === activoId && a.estado === 'activo').slice(-1)[0];
      if (asigActual) {
        const i = db.asignaciones.findIndex(x => x.id === asigActual.id);
        db.asignaciones[i].estado = 'baja';
      }
      db.historial.push({
        id: nextId(db.historial), tipo: 'baja', activoId, empleadoId: null, fecha,
        descripcion: `Baja: ${tipo} — ${motivo || 'Sin descripción'}`,
        empresaId: db.activos[ai]?.empresaId || 0
      });
      saveDB(db);
      return jsonRes(res, 200, { ok: true, baja });
    }

    // Devolver activo
    if (parts[1] === 'devolver' && req.method === 'POST') {
      const { asigId, condicion } = await parseBody(req);
      const i = db.asignaciones.findIndex(x => x.id === asigId);
      if (i < 0) return jsonRes(res, 404, { error: 'No encontrada' });
      const a = db.asignaciones[i];
      db.asignaciones[i] = { ...a, estado: 'devuelto', condicionDevolucion: condicion, fechaDevolucion: today() };
      db.historial.push({
        id: nextId(db.historial), tipo: 'devolucion', activoId: a.activoId, empleadoId: a.empleadoId, fecha: today(),
        descripcion: `Devuelto por ${(db.empleados.find(e => e.id === a.empleadoId) || {}).nombre || '?'} — Condición: ${condicion}`,
        empresaId: a.empresaUsoId
      });
      saveDB(db);
      return jsonRes(res, 200, { ok: true });
    }

    // Stats dashboard
    if (parts[1] === 'stats' && req.method === 'GET') {
      const total    = db.activos.length;
      const activos  = db.activos.filter(a => a.estado === 'activo');
      const asignados = activos.filter(a => db.asignaciones.some(x => x.activoId === a.id && x.estado === 'activo')).length;
      const bodega   = activos.length - asignados;
      const bajas    = db.activos.filter(a => a.estado === 'baja').length;
      return jsonRes(res, 200, { total, asignados, bodega, bajas });
    }

    return jsonRes(res, 404, { error: 'Ruta no encontrada' });
  }

  // ── Archivos estáticos ─────────────────────────────────────────────────────
  let filePath = pathname === '/' ? '/index.html' : pathname;
  filePath = path.join(__dirname, 'public', filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(__dirname, 'public', 'index.html'), (e2, html) => {
        if (e2) { res.writeHead(404); return res.end('Not found'); }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
      });
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Control de Activo Fijo corriendo en http://0.0.0.0:${PORT}`);
  console.log(`   Datos en: ${DATA_FILE}`);
  console.log(`   Usuario: admin  |  Contraseña: admin123\n`);
});
