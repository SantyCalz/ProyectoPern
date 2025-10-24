import express from "express";
import morgan from "morgan";
import tareasRoutes from "./router/tareas.routes.js";
import authRoutes from "./router/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { pool as Pool } from "./db.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175",
  "https://proyectopern-1-frontend.onrender.com"
];

// Configuración CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // solicitudes sin origen (Postman, curl)
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log("Intento de acceso desde origen no permitido:", origin);
    return callback(new Error("CORS policy: Origin not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Manejo de preflight requests
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Rutas de prueba
app.get("/", (req, res) => res.json({ message: "Bienvenidos a mi proyecto" }));

app.get("/api/ping", async (req, res) => {
  try {
    const result = await Pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error en DB:", err);
    res.status(500).json({ error: "No se pudo conectar a la DB" });
  }
});

// Rutas principales
app.use("/api", tareasRoutes);
app.use("/api", authRoutes);

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error("Error global:", err.message);
  res.status(500).json({
    status: "error",
    message: err.message
  });
});

export default app;
