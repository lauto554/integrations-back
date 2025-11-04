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

  static async getDataMpStores(req: Request, res: Response) {
    try {
      const { idEmpresa, idUsuario } = req as any;
      const { user_id } = req.params;

      const appName = getAppName();
      const idApp = await AuthService.getIdApp(appName);

      const data = {
        empresa: idEmpresa,
        idapp: idApp,
        idusuario: idUsuario,
      };

      const datos = await AppService.getRefreshToken(data);

      const refreshTokenMercado = datos[0].refresh_token;

      const accessTokenMercado = await AppService.getAccessTokenMercado(refreshTokenMercado);

      const stores = await AppService.getStores(user_id, accessTokenMercado);

      res.json(ResponseModel.create("success", 200, "getMercadoStores OK", stores));
      return;
    } catch (error: any) {
      console.error("Error fetching MP user data:", error.response.data);
      res.status(500).json({ error: error.message || error.toString() });
      return;
    }
  }

  static async assignStoreId(req: Request, res: Response) {
    try {
      const { idEmpresa, idUsuario } = req as any;
      const { userId, storeId, externalId } = req.params;

      const appName = getAppName();
      const idApp = await AuthService.getIdApp(appName);

      const data = {
        empresa: idEmpresa,
        idusuario: idUsuario,
        idapp: idApp,
      };

      const datos = await AppService.getRefreshToken(data);

      const refreshTokenMercado = datos[0].refresh_token;

      const accessTokenMercado = await AppService.getAccessTokenMercado(refreshTokenMercado);

      await AppService.putStore(accessTokenMercado, userId, storeId, externalId);

      res.json(ResponseModel.create("success", 200, "patchStoreId OK"));
      return;
    } catch (error: any) {
      console.error("Error fetching MP user data:", error.response.data);
      res.status(500).json({ error: error.message || error.toString() });
      return;
    }
  }

  static async getDataMpPos(req: Request, res: Response) {
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

      const refreshTokenMercado = datos[0].refresh_token;

      const accessTokenMercado = await AppService.getAccessTokenMercado(refreshTokenMercado);

      const pos = await AppService.getPos(accessTokenMercado);

      res.json(ResponseModel.create("success", 200, "getMercadoPos OK", pos));
      return;
    } catch (error: any) {
      console.error("Error fetching MP user data:", error.response.data);
      res.status(500).json({ error: error.message || error.toString() });
      return;
    }
  }

  static async assignPosId(req: Request, res: Response) {
    try {
      const { idEmpresa, idUsuario } = req as any;
      const { posId, externalId } = req.params;

      const appName = getAppName();
      const idApp = await AuthService.getIdApp(appName);

      const data = {
        empresa: idEmpresa,
        idusuario: idUsuario,
        idapp: idApp,
      };

      const datos = await AppService.getRefreshToken(data);

      const refreshTokenMercado = datos[0].refresh_token;

      const accessTokenMercado = await AppService.getAccessTokenMercado(refreshTokenMercado);

      await AppService.putPos(accessTokenMercado, posId, externalId);

      res.json(ResponseModel.create("success", 200, "patchPosId OK"));
      return;
    } catch (error: any) {
      console.error("Error fetching MP user data:", error.response.data);
      res.status(500).json({ error: error.message || error.toString() });
      return;
    }
  }

  static async getDataMpDevices(req: Request, res: Response) {
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

      const refreshTokenMercado = datos[0].refresh_token;

      const accessTokenMercado = await AppService.getAccessTokenMercado(refreshTokenMercado);

      const devices = await AppService.getDevices(accessTokenMercado);

      res.json(ResponseModel.create("success", 200, "getMercadoDevices OK", devices));
      return;
    } catch (error: any) {
      console.error("Error fetching MP user data:", error.response.data);
      res.status(500).json({ error: error.message || error.toString() });
      return;
    }
  }

  static async patchDeviceMode(req: Request, res: Response) {
    try {
      const { idEmpresa, idUsuario } = req as any;

      const { device_id, mode } = req.body;

      const appName = getAppName();
      const idApp = await AuthService.getIdApp(appName);

      const data = {
        empresa: idEmpresa,
        idapp: idApp,
        idusuario: idUsuario,
      };

      const datos = await AppService.getRefreshToken(data);

      const refreshTokenMercado = datos[0].refresh_token;

      const accessTokenMercado = await AppService.getAccessTokenMercado(refreshTokenMercado);

      const devices = await AppService.changeDeviceOperatingMode(accessTokenMercado, device_id, mode);

      res.json(ResponseModel.create("success", 200, "getMercadoDevices OK", devices));
      return;
    } catch (error: any) {
      console.error("Error fetching MP user data:", error.response.data);
      res.status(500).json({ error: error.message || error.toString() });
      return;
    }
  }

  static async createPointOrder(req: Request, res: Response) {
    try {
      const { idEmpresa, idUsuario } = req as any;

      const { device_id, description, print, amount } = req.body;

      const appName = getAppName();
      const idApp = await AuthService.getIdApp(appName);

      const data = {
        empresa: idEmpresa,
        idapp: idApp,
        idusuario: idUsuario,
      };

      const datos = await AppService.getRefreshToken(data);

      const refreshTokenMercado = datos[0].refresh_token;

      const accessTokenMercado = await AppService.getAccessTokenMercado(refreshTokenMercado);

      const order = await AppService.createOrderPoint(accessTokenMercado, device_id, amount, description, print);

      res.json(ResponseModel.create("success", 200, "getMercadoDevices OK", order));
      return;
    } catch (error: any) {
      console.error("Error creating order MP:", error.response.data.errors[0].details);
      res.status(500).json({ error: error.message || error.toString() });
      return;
    }
  }
}
