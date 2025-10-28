import { Request, Response, NextFunction } from "express";
import { ResponseModel } from "../backend-resources/models/ResponseModel";
import { getJwtSecret, validateMethod } from "../backend-resources/utils";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function validateSignIn(req: Request, res: Response, next: NextFunction) {
  if (!validateMethod(req, res, "POST")) return;

  const { company, username, password } = req.body;

  if (!company || !username || !password) {
    const response = ResponseModel.create(
      "error",
      400,
      "Faltan campos requeridos: empresa, usuario o contrasenia.",
    );
    res.status(400).json(response);
    return;
  }
  return next();
}

export function validateSignUp(req: Request, res: Response, next: NextFunction) {
  if (!validateMethod(req, res, "POST")) return;
  const requiredFields = [
    "nombre",
    "cuit",
    "domicilio",
    "provincia",
    "localidad",
    "cpostal",
    "codarea",
    "telefono",
    "email",
    "usuario",
    "password",
  ];

  const missing = requiredFields.filter(
    (field) => !req.body[field] || req.body[field].toString().trim() === "",
  );

  if (missing.length > 0) {
    const response = ResponseModel.create("error", 400, `Faltan campos requeridos`);
    res.status(400).json(response);
    return;
  }
  return next();
}

export function validateToken(req: Request, res: Response, next: NextFunction) {
  // if (!validateMethod(req, res, "GET")) return;

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const response = ResponseModel.create("error", 401, "Falta Token");
    res.status(401).json(response);
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    const response = ResponseModel.create("error", 401, "Error de Token");
    res.status(401).json(response);
    return;
  }

  const jwtSecret = getJwtSecret();

  try {
    const payload = jwt.verify(token, jwtSecret) as { idEmpresa?: number; idUsuario?: number };

    (req as any).token = token;
    (req as any).idEmpresa = payload.idEmpresa;
    (req as any).idUsuario = payload.idUsuario;

    return next();
  } catch (error) {
    console.log(error);
    const response = ResponseModel.create("error", 401, "Token inválido o expirado");
    res.status(401).json(response);
    return;
  }
}

export function validateEmpresaModo(req: Request, res: Response, next: NextFunction): void {
  const { empresa, modo } = req.params;

  if (!empresa || empresa.trim() === "") {
    const response = ResponseModel.create("error", 400, "Falta empresa");
    res.status(400).json(response);
    return;
  }

  // Validar que modo esté presente y sea válido
  if (!modo || modo.trim() === "") {
    const response = ResponseModel.create("error", 400, "Falta modo");
    res.status(400).json(response);
    return;
  }

  const allowedModes = ["homo", "prod"];

  if (!allowedModes.includes(modo.toLowerCase())) {
    const response = ResponseModel.create("error", 400, "Modo no permitido");
    res.status(400).json(response);
    return;
  }

  // Validar que empresa sea numérica (opcional, depende de tu lógica de negocio)
  if (isNaN(Number(empresa))) {
    const response = ResponseModel.create("error", 400, "Error de empresa");
    res.status(400).json(response);
    return;
  }

  req.params.modo = modo.toLowerCase();

  next();
}
