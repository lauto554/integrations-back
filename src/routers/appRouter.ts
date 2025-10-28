import { Router } from "express";
import { validateConsultaMercado, validateGetRefreshToken } from "../middleware/appMiddleware";
import { validateToken } from "../middleware/authMiddleware";
import { AppController } from "../controllers/AppController";
import "colors";

const appRouter = Router();

// Ruta principal
appRouter.all(
  "/mercado/consultaMercado/:empresa",
  validateConsultaMercado,
  validateToken,
  AppController.getMpIntegrations,
);

appRouter.all("/mercado/obtener_datosapp", validateToken, AppController.getDataAppMp);
appRouter.all("/mercado/obtener_primertoken", validateToken, AppController.getDataAppMp);
appRouter.all("/mercado/grabar_primertoken", validateToken, AppController.saveFirstToken);
appRouter.all("/mercado/obtener_datoscuenta", validateToken, AppController.getDataMpUser);
appRouter.all(
  "/mercado/obtener_refreshtoken/:empresa/:idapp/:idusuario",
  validateGetRefreshToken,
  validateToken,
  AppController.getRefreshToken,
);

export default appRouter;
