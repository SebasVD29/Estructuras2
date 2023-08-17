// app.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
const helmet = require('helmet');
var Usuario, viajes;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://unpkg.com", "https://maps.googleapis.com", "https://code.iconify.design"],
      imgSrc: ["'self'", "data:", "https://maps.gstatic.com", "https://maps.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://unpkg.com", "https://maps.googleapis.com"],
    },
  },
}));




// Configurar conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: '%',
  user: 'admin',
  password: 'root',
  database: 'uvep'
});

/*// Configurar conexión a la base de datos MySQL Mauricio

const db = mysql.createConnection({

  host: 'localhost',

  user: 'root',

  password: 'admin',

  database: 'uvep'

}); */

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conexión a la base de datos establecida');
});

// Configurar body-parser para analizar datos en las solicitudes
app.use(express.static(path.join(__dirname)));

app.use(express.static('public'));

// Definir ruta para la página principal
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath);
});

// Configurar body-parser para analizar datos en las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath);
});
// Ruta para servir el archivo mapa.html
app.get('/mapa', (req, res) => {
  const filePath = path.join(__dirname, 'mapa.html');
  res.sendFile(filePath);
});
app.get('/', (req, res) => {
  // Simulando una respuesta JSON válida desde el servidor
  const data = { mensaje: 'Respuesta JSON válida' };
  res.json(data);
});



// Ruta para el inicio de sesión (POST)
app.post('/login', (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  console.log('1 Intento de inicio de sesión:', name, password);

  // Realizar la consulta a la base de datos para verificar el usuario y contraseña
  const sql = 'SELECT * FROM users WHERE name = ? AND password = ?';
  db.query(sql, [name, password], (err, result) => {
    if (err) {
      throw err;
    }
    // Si hay un resultado, el usuario y contraseña son válidos
    if (result.length === 0) {  
      // Mostrar un mensaje de error en la página de inicio de sesión
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Redirigir al mapa
    res.redirect('/mapa');
    Usuario = result;
    
    
  });
});

// Ruta para el registro de un nuevo usuario (POST)
app.post('/registro', (req, res) => {
  const { name, email, password, rol } = req.body;

  // Verificar si el nombre de usuario ya está registrado en la base de datos
  const checkUserQuery = 'SELECT * FROM users WHERE name = ?';
  db.query(checkUserQuery, [name], (err, result) => {
    if (err) {
      throw err;
    }

    // Si el nombre de usuario ya está registrado, mostrar un mensaje de error
    if (result.length > 0) {
      res.send('El nombre de usuario ya está registrado. Por favor, elige otro nombre de usuario.');
    } else {
      // Si el nombre de usuario no está registrado, insertar al nuevo usuario en la base de datos
      const insertUserQuery = 'INSERT INTO users (name, email, password, rol) VALUES (?, ?, ?, ?)';
      db.query(insertUserQuery, [name, email, password, rol], (err, result) => {
        if (err) {
          throw err;
        }

        // Redirigir al mapa una vez que se registra el nuevo usuario
        res.redirect('/mapa');
        Usuario = result;
      });
    }
  });
});

app.get('/datos', (req, res) => {
  // Supongamos que tienes una variable llamada "miVariable" con los datos que deseas enviar al cliente
  Usuario;
  //console.log(Usuario);
  // Envía la variable como respuesta en formato JSON
  res.json(Usuario);
});


app.post("/viajes", (req, res) => {
  const { nodoInicio, nodoDestino, distancia, tiempo } = req.body;

  // Guardar los datos del viaje en la base de datos
  db.query(
    "INSERT INTO viajes (nodoViajeInicio, nodoViajeDestino, ponderado, tiempo) VALUES (?, ?, ?, ?)",
    [nodoInicio, nodoDestino, distancia, tiempo],
    (err, result) => {
      if (err) throw err;

      db.query("SELECT * FROM Viajes", (err, viajesResult) => {
        if (err) throw err; 
        viajes = viajesResult;
        // Devolver los resultados al cliente
        //res.json(viajesResult);
      });  
    });
});

app.get('/datos-viajes', (req, res) => {
  viajes;
  console.log(viajes);
  // Envía la variable como respuesta en formato JSON
  res.json(viajes);
});



// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Echo escuchando en http://localhost:${port}`);
});





