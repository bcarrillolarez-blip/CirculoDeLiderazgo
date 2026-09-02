const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Estructura inicial de Base de Datos
const defaultDB = {
  circles: [
    "PRESENCIAL -- LIMA",
    "PRESENCIAL -- CUSCO",
    "PRESENCIAL -- AREQUIPA",
    "VIRTUAL 1",
    "VIRTUAL 2",
    "VIRTUAL 3",
    "VIRTUAL 4"
  ],
  users: [],
  admins: [
    {
      id: "ADM-001",
      doc: "00000000",
      name: "Superadministrador Principal",
      email: "admin@empresa.com",
      pin: "2026",
      role: "Superadministrador",
      circleScope: "Todos los Círculos",
      createdAt: new Date().toISOString()
    }
  ],
  meetings: [],
  audit: [
    {
      id: 1,
      author: "Sistema",
      action: "Base de Datos Inicializada",
      details: "Estructura configurada y lista.",
      time: "Hoy",
      timestamp: Date.now()
    }
  ]
};

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDB, null, 2), 'utf8');
      return defaultDB;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error leyendo BD:", err);
    return defaultDB;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Error guardando BD:", err);
    return false;
  }
}

// Rutas de la API
app.get('/api/data', (req, res) => {
  res.json(readDB());
});

app.post('/api/data', (req, res) => {
  const incoming = req.body;
  const current = readDB();
  const updated = {
    circles: incoming.circles || current.circles,
    users: incoming.users || current.users,
    admins: incoming.admins || current.admins,
    meetings: incoming.meetings || current.meetings,
    audit: incoming.audit || current.audit
  };
  writeDB(updated);
  res.json({ success: true, message: "Datos guardados correctamente." });
});

// Sirve el archivo index.html o una interfaz directa
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <html>
        <head><title>Círculos Connect - Servidor Activo</title><meta charset="utf-8"></head>
        <body style="font-family: sans-serif; padding: 40px; text-align: center; background: #f8fafc;">
          <h2 style="color: #4f46e5;">🚀 Servidor Node.js Activo y Conectado</h2>
          <p style="color: #64748b;">La API responde correctamente en <code>/api/data</code>.</p>
          <p style="color: #334155;">Coloca tu archivo <code>index.html</code> en esta misma carpeta para ver el panel web completo.</p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  readDB(); // Inicializa database.json
  console.log(`\n==================================================`);
  console.log(`🚀 Servidor ejecutándose en: http://localhost:${PORT}`);
  console.log(`📁 Base de datos local: ${DB_FILE}`);
  console.log(`==================================================\n`);
});