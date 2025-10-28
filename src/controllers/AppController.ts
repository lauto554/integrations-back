import { Request, Response } from "express";
import { ResponseModel } from "../backend-resources/models/ResponseModel";
import { AppService } from "../services/AppService";
import { getAppName } from "../backend-resources/utils";
import { AuthService } from "../services/AuthService";

export class AppController {
  static async signIn(req: Request, res: Response) {
    try {
      const { company, username, password } = req.body;

      const url = `/rest/v1/empresasusu?usuario=eq.${username}&password=eq.${password}&empresa=eq.${company}&select=usuario&limit=1`;
    } catch (error) {
      console.error("Error during sign-in:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }

  static async getMpIntegrations(req: Request, res: Response) {
    try {
      const { empresa } = req.params;

      const integrations = await AppService.getIntegrationsMp(Number(empresa));

      console.log(integrations);

      res.json(ResponseModel.create("success", 200, "getMpIntegrations OK", integrations));
      return;
    } catch (error) {
      console.error("Error fetching MP integrations:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }

  static async getDataAppMp(req: Request, res: Response) {
    try {
      const data = await AppService.getDataAppMp();

      console.log(data);

      res.json(ResponseModel.create("success", 200, "getDataAppMp OK", data[0]));
      return;
    } catch (error) {
      console.error("Error fetching MP integrations:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }

  static async saveFirstToken(req: Request, res: Response) {
    try {
      const { code, empresa, idapp, nombre, email } = req.body;
      const datosToken = await AppService.getFirstToken(code);

      const saveResponse = await AppService.saveFirstToken({
        empresa,
        idapp,
        user_id: datosToken.user_id,
        nombre,
        email,
        scope: datosToken.scope,
        refresh_token: datosToken.refresh_token,
        expiracion: datosToken.expires_in,
      });

      res.json(ResponseModel.create("success", 200, "getDataAppMp OK", saveResponse));
      return;
    } catch (error: any) {
      // console.error("Error fetching MP integrations:", error.response.data);
      res.status(500).json(ResponseModel.create("error", 500, error.response.data.message, null));
      return;
    }
  }

  static async getRefreshToken(req: Request, res: Response) {
    try {
      const { empresa, idapp, idusuario } = req.params;

      const datosToken = await AppService.getRefreshToken({ empresa, idapp, idusuario });

      res.json(ResponseModel.create("success", 200, "getRefreshToken OK", datosToken[0]));
      return;
    } catch (error: any) {
      // console.error("Error fetching MP integrations:", error.response.data);
      res.status(500).json(ResponseModel.create("error", 500, error.response.data.message, null));
      return;
    }
  }

  static async getDataMpUser(req: Request, res: Response) {
    try {
      const { idEmpresa, idUsuario } = req as any;

      const appName = getAppName();
      const idApp = await AuthService.getIdApp(appName);

      const data = {
        empresa: idEmpresa,
        idapp: idApp,
        idusuario: idUsuario,
      };

      const datos = await AppService.getRefreshToken(data);

      // console.log(datos);
      const refreshTokenMercado = datos[0].refresh_token;

      // const userData = await AppService.getDataMpUser(access_token);

      const datita = await AppService.getDataMpUser(refreshTokenMercado);

      res.json(ResponseModel.create("success", 200, "getDataMpUser OK", datita));
      return;
    } catch (error) {
      console.error("Error fetching MP user data:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }
}
