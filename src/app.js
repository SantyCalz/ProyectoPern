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

const allowedOrigins = [
  process.env.VITE_FRONTEND || "http://localhost:5173",
  "http://localhost:5175",
  "https://proyectopern-1-frontend.onrender.com"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log("Origin recibido:", origin); // <-- esto ayuda a depurar
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});


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
