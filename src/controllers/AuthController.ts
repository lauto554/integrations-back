import { Request, Response } from "express";
import { ResponseModel } from "../backend-resources/models/ResponseModel";
import { AuthService } from "../services/AuthService";
import { createJwtToken, formatDate, getAppName, getJwtSecret } from "../backend-resources/utils";
import { handleError } from "../backend-resources/utils";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class AuthController {
  static async signIn(req: Request, res: Response) {
    try {
      const { company, username, password } = req.body;

      const data = await AuthService.validateSignIn(company, username, password);

      if (data.idempresa === null || data.idusuario === null) {
        // console.log(res);
        handleError(new Error("Credenciales Incorrectas"), res);
        return;
      }

      const idUsuario = data.idusuario;
      const idEmpresa = data.idempresa;

      const appName = getAppName();

      const idApp = await AuthService.getIdApp(appName);
      const tokenApps = await AuthService.getTokenApps(idApp, idUsuario);

      let response;
      let accessTokenToSave = tokenApps.access_token;
      let refreshTokenToSave = tokenApps.refresh_token;

      if (tokenApps.status === "valid") {
        response = {
          access_token: tokenApps.access_token,
          expira_access: tokenApps.expira_access,
          refresh_token: tokenApps.refresh_token,
          expira_refresh: tokenApps.expira_refresh,
        };
      } else {
        const payload = { idEmpresa, idUsuario };

        if (tokenApps.status === "not_found" || tokenApps.status === "all_expired") {
          accessTokenToSave = createJwtToken(payload, "access");
          refreshTokenToSave = createJwtToken(payload, "refresh");
        } else if (tokenApps.status === "expired_access") {
          accessTokenToSave = createJwtToken(payload, "access");
        } else if (tokenApps.status === "expired_refresh") {
          refreshTokenToSave = createJwtToken(payload, "refresh");
        }

        // Decodificar expiraciones
        const decodedAccess = jwt.decode(accessTokenToSave) as any;
        const decodedRefresh = jwt.decode(refreshTokenToSave) as any;

        response = {
          access_token: accessTokenToSave,
          expira_access: decodedAccess?.exp
            ? formatDate(decodedAccess.exp)
            : tokenApps.expira_access,
          refresh_token: refreshTokenToSave,
          expira_refresh: decodedRefresh?.exp
            ? formatDate(decodedRefresh.exp)
            : tokenApps.expira_refresh,
        };

        await AuthService.saveTokenApps(idApp, idUsuario, accessTokenToSave, refreshTokenToSave);
      }

      res.json(
        ResponseModel.create("success", 200, "signIn OK", {
          idUsuario,
          idEmpresa,
          ...response,
        }),
      );
      return;
    } catch (error: any) {
      handleError(error, res);
    }
  }

  static async signUp(req: Request, res: Response) {
    try {
      const body = req.body;
      const saveCompany = await AuthService.saveCompany(body);

      res.json(ResponseModel.create("success", 201, "Empresa registrada con éxito", saveCompany));
    } catch (error) {
      handleError(error, res);
    }
  }

  static async validateToken(req: Request, res: Response) {
    try {
      const token = (req as any).token;
      const jwtSecret = getJwtSecret();

      jwt.verify(token, jwtSecret);

      res.json(ResponseModel.create("success", 200, "Token válido"));
    } catch (error: any) {
      res.status(401).json(ResponseModel.create("error", 401, "Token inválido o expirado"));
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = (req as any).token;
      const appName = getAppName();
      const idApp = await AuthService.getIdApp(appName);

      const jwtSecret = getJwtSecret();
      const payload = jwt.verify(refreshToken, jwtSecret) as {
        idEmpresa: number;
        idUsuario: number;
      };

      if (!payload?.idEmpresa || !payload?.idUsuario) {
        return res.status(400).json(ResponseModel.create("error", 400, "Refresh token inválido"));
      }

      const newAccessToken = createJwtToken(
        { idEmpresa: payload.idEmpresa, idUsuario: payload.idUsuario },
        "access",
      );

      await AuthService.saveTokenApps(idApp, payload.idUsuario, newAccessToken, refreshToken);

      res.json(
        ResponseModel.create("success", 200, "Refresh OK", { access_token: newAccessToken }),
      );
      return;
    } catch (error: any) {
      res.status(401).json(ResponseModel.create("error", 401, "Token inválido o expirado"));
      return;
    }
  }
}
