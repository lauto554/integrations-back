import { Router, Request, Response } from "express";
import "colors";
import { ResponseModel } from "../backend-resources/models/ResponseModel";
import { DatabasePg } from "../backend-resources/models/DatabasePg";

const router = Router();

// Ruta principal
router.get("/", (req: Request, res: Response) => {
  const response = ResponseModel.create("success", 200, "working!", {
    timestamp: new Date().toISOString(),
  });

  res.json(response);
});

// Health check
router.get("/health", (req: Request, res: Response) => {
  const response = ResponseModel.create("success", 200, "OK", {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });

  res.json(response);
});

// Test de base de datos
router.get("/db-test", async (req: Request, res: Response) => {
  try {
    const result = await DatabasePg.query("SELECT version() as version, current_timestamp as now");

    const response = ResponseModel.create("success", 200, "db-test OK", {
      result: result.rows[0],
    });

    res.json(response);
  } catch (error) {
    console.log(`Error en test de DB: ${error}`.red);

    const response = ResponseModel.create("error", 500, "Error de conexión a base de datos", {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });

    res.status(500).json(response);
  }
});

export default router;
