import express, { Request, Response, Application, NextFunction } from "express";
import { ResponseModel } from "./backend-resources/models/ResponseModel";
import morgan from "morgan";
import appRouter from "./routers/appRouter";
import testRouter from "./routers/testRouter";
import "colors";
import authRouter from "./routers/authRouter";
import cors from "cors";
import dotenv from "dotenv";

export function startServer(port: number): Application {
  const app: Application = express();

  // Cargar variables de entorno (si hay .env)
  dotenv.config();

  app.use(express.json());
  // Habilitar CORS para todos los orígenes
  app.use(
    cors({
      origin: (origin, callback) => {
        // Permite cualquier origen que venga en la petición
        callback(null, origin || "*");
      },
      credentials: true,
    }),
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.use("/", appRouter);
  app.use("/tests", testRouter);
  app.use("/auth", authRouter);

  // Manejo de rutas no encontradas
  app.use("*", (req: Request, res: Response) => {
    const response = ResponseModel.create("error", 404, "Ruta no encontrada", {
      path: req.originalUrl,
      method: req.method,
    });

    res.json(response);
  });

  // Manejo de errores global
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const response = ResponseModel.create(
      "error",
      500,
      `Error interno del servidor ${err.message}`,
    );

    res.status(500).json(response);
  });

  // Iniciar el servidor
  app.listen(port, () => {
    console.log(`--------------------------------------`.red);
    console.log(`Servidor ejecutándose en puerto ${port}`.red);
    console.log(`--------------------------------------`.red);
    console.log(`Environment: ${process.env.NODE_ENV}`.blue);
  });

  return app;
}
