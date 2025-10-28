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
