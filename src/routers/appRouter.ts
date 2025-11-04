import { Router } from "express";
import {
  validateConsultaMercado,
  validateDevice,
  validateGetRefreshToken,
  validatePointOrder,
  validatePosId,
  validateStoreId,
  validateUserId,
} from "../middleware/appMiddleware";
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
appRouter.all("/mercado/obtener_sucursales/:user_id?", validateUserId, validateToken, AppController.getDataMpStores);
appRouter.all(
  "/mercado/asignar_storeid/:userId?/:storeId?/:externalId?",
  validateStoreId,
  validateToken,
  AppController.assignStoreId,
);
appRouter.all("/mercado/obtener_cajas", validateToken, AppController.getDataMpPos);
appRouter.all("/mercado/asignar_posid/:posId?/:externalId?", validatePosId, validateToken, AppController.assignPosId);
appRouter.all("/mercado/obtener_terminales", validateToken, AppController.getDataMpDevices);
appRouter.all("/mercado/cambiar_modoterminal", validateToken, validateDevice, AppController.patchDeviceMode);

appRouter.all("/mercado/crear_pointorder", validatePointOrder, validateToken, AppController.createPointOrder);
appRouter.all(
  "/mercado/obtener_refreshtoken/:empresa/:idapp/:idusuario",
  validateGetRefreshToken,
  validateToken,
  AppController.getRefreshToken,
);

export default appRouter;
