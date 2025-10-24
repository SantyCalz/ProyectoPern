import express from "express";
import morgan from "morgan";
import tareasRoutes from "./router/tareas.routes.js";
import authRoutes from "./router/auth.routes.js";
import cookieParser from "cookie-parser"
import cors from "cors";
import { pool as Pool } from "./db.js";
import { ORIGIN } from "./db.js";

const app = express();

//Middlewares
app.use(morgan("dev"));
// Allow local frontend origins (Vite default 5173 or 5175) and allow tools without origin
const allowedOrigins = ["http://localhost:5173", "http://localhost:5175"];
app.use(cors({
    origin: (ORIGIN, callback) => {
        // allow requests with no origin (e.g., curl, Postman, server-to-server)
        if (!ORIGIN) return callback(null, true);
        if (allowedOrigins.includes(ORIGIN )) return callback(null, true);
        return callback(new Error('CORS policy: Origin not allowed'));
    },
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.json({message: "Bienvenidos a mi proyecto"}));
app.get("/api/ping", async (req, res) => {
    const result =  await Pool.query('SELECT NOW()');
    res.json(result.rows[0]);
});


app.use('/api',tareasRoutes);
app.use('/api',authRoutes);

//manejo de errores
app.use((err, req, res, next) => {
    res.status(500).json({
        status: "error",
        message: err.message
    });
});

export default app;