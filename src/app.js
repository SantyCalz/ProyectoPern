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

// CORS: permitir localhost y frontend desplegado en Render
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175",
  "https://mi-frontend.onrender.com",
  "https://proyectopern-1-frontend.onrender.com"
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (ej: Postman, curl)
    if (!origin) return callback(null, true);

    // Permitir solo los orígenes listados
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // Denegar los demás
    return callback(new Error("CORS no permitido"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200 // para que la preflight devuelva 200
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

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("Error global:", err.message);
  res.status(500).json({
    status: "error",
    message: err.message
  });
});

export default app;
