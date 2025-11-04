import { Request, Response, NextFunction } from "express";
import { ResponseModel } from "../backend-resources/models/ResponseModel";
import { validateMethod } from "../backend-resources/utils";

export function validateConsultaMercado(req: Request, res: Response, next: NextFunction) {
  if (!validateMethod(req, res, "GET")) return;

  const { empresa } = req.params;

  if (!empresa) {
    const response = ResponseModel.create("error", 400, "Falta Empresa");
    res.status(400).json(response);
    return;
  }

  return next();
}

export function validateGetRefreshToken(req: Request, res: Response, next: NextFunction) {
  if (!validateMethod(req, res, "GET")) return;

  const { empresa, idapp, idusuario } = req.params;

  if (!empresa || !idapp || !idusuario) {
    const response = ResponseModel.create("error", 400, "Faltan parámetros requeridos");
    res.status(400).json(response);
    return;
  }

  return next();
}

export function validateUserId(req: Request, res: Response, next: NextFunction) {
  if (!validateMethod(req, res, "GET")) return;

  const { user_id } = req.params;

  if (!user_id) {
    const response = ResponseModel.create("error", 400, "Falta user_id");
    res.status(400).json(response);
    return;
  }

  return next();
}

export function validateDevice(req: Request, res: Response, next: NextFunction) {
  if (!validateMethod(req, res, "POST")) return;

  const { device_id, mode } = req.body;

  if (!device_id || !mode) {
    const response = ResponseModel.create("error", 400, "Faltan datos");
    res.status(400).json(response);
    return;
  }

  return next();
}

export function validateStoreId(req: Request, res: Response, next: NextFunction) {
  if (!validateMethod(req, res, "GET")) return;

  const { userId, storeId, externalId } = req.params;

  if (!userId || !storeId || !externalId) {
    const response = ResponseModel.create("error", 400, "Faltan datos");
    res.status(400).json(response);
    return;
  }

  return next();
}

export function validatePosId(req: Request, res: Response, next: NextFunction) {
  if (!validateMethod(req, res, "GET")) return;

  const { posId, externalId } = req.params;

  if (!posId || !externalId) {
    const response = ResponseModel.create("error", 400, "Faltan datos");
    res.status(400).json(response);
    return;
  }

  return next();
}

export function validatePointOrder(req: Request, res: Response, next: NextFunction) {
  if (!validateMethod(req, res, "POST")) return;

  const { device_id, description, print, amount } = req.body;

  if (!device_id || !description || !print || !amount) {
    const response = ResponseModel.create("error", 400, "Faltan datos");
    res.status(400).json(response);
    return;
  }

  return next();
}
