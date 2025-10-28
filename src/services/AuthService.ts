import { handleError } from "../backend-resources/utils";
import apiSupabase from "../backend-resources/lib/apiSupabase";
import { ResponseModel } from "../backend-resources/models/ResponseModel";

export class AuthService {
  static async getIdApp(appName: string) {
    try {
      const url = `/rest/v1/apps?select=id&nombre=eq.${appName}`;

      const request = await apiSupabase.get(url);

      return request.data[0].id;
    } catch (error) {
      throw error;
    }
  }

  static async validateSignIn(company: string, username: string, password: string) {
    try {
      const url = `/rest/v1/rpc/obtener_empresa`;
      const payload = {
        p_usuario: username,
        p_password: password,
        p_nfantasia: company,
      };

      const request = await apiSupabase.post(url, payload);
      const response = request.data[0];

      return response;
    } catch (error) {
      return -1;
    }
  }

  static async getTokenApps(idApp: number, idUser: number) {
    try {
      const url = `/rest/v1/rpc/obtener_tokenapps`;
      const payload = {
        p_idusuario: idUser,
        p_idapp: idApp,
      };

      const request = await apiSupabase.post(url, payload);

      return request.data[0];
    } catch (error) {
      throw error;
    }
  }

  static async saveTokenApps(
    idApp: number,
    idUser: number,
    accessToken: string,
    refreshToken: string,
  ) {
    try {
      const url = `/rest/v1/rpc/grabar_tokenapps`;

      const payload = {
        p_idusuario: idUser,
        p_idapp: idApp,
        p_access_token: accessToken,
        p_refresh_token: refreshToken,
      };

      const request = await apiSupabase.post(url, payload);

      return request.data[0];
    } catch (error) {
      throw error;
    }
  }

  static async validateAccessToken(token: string) {
    try {
      const url = `/rest/v1/rpc/valida_accesstoken`;
      const payload = {
        p_access_token: token,
      };
      const request = await apiSupabase.post(url, payload);
      return request.data[0];
    } catch (error) {
      throw error;
    }
  }

  static async refreshAccessToken(token: string) {
    try {
      const url = `/rest/v1/rpc/valida_accesstoken`;
      const payload = {
        p_refresh_token: token,
      };
      const request = await apiSupabase.post(url, payload);
      return request.data[0];
    } catch (error) {
      throw error;
    }
  }

  static async saveCompany(body: any) {
    try {
      const url = `/rest/v1/rpc/grabar_empresa`;

      const {
        nombre,
        cuit,
        domicilio,
        provincia,
        localidad,
        cpostal,
        codarea,
        telefono,
        email,
        usuario,
        password,
      } = body;

      const payload = {
        p_nempresa: nombre,
        p_cuit: cuit,
        p_domicilio: domicilio,
        p_provincia: provincia,
        p_localidad: localidad,
        p_cpostal: cpostal,
        p_codarea: codarea,
        p_telefono: telefono,
        p_email: email,
        p_usuario: usuario,
        p_password: password,
      };

      const request = await apiSupabase.post(url, payload);

      return request.data[0];
    } catch (error) {
      throw error;
    }
  }
}
