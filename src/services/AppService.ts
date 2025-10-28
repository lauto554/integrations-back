import apiSupabase from "../backend-resources/lib/apiSupabase";
import apiMercado from "../lib/apiMercado";

export class AppService {
  static async getIntegrationsMp(empresa: number) {
    try {
      const url = `/rest/v1/rpc/consulta_integracionmp`;

      const payload = {
        p_empresa: empresa,
      };

      const request = await apiSupabase.post(url, payload);
      const response = request.data;

      console.log(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getDataAppMp() {
    try {
      const url = `/rest/v1/mercadopagoapp?select=idapp,integra,client_id,redirect_uri&idapp=eq.1`;

      const request = await apiSupabase.get(url);
      const response = request.data;

      console.log(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getFirstToken(code: string) {
    try {
      const urlSupabase = `/rest/v1/mercadopagoapp?select=client_id,client_secret,redirect_uri&idapp=eq.1`;

      const requestSupabase = await apiSupabase.get(urlSupabase);
      const responseSupabase = requestSupabase.data;

      //   console.log(responseSupabase);

      const client_id = responseSupabase[0].client_id;
      const client_secret = responseSupabase[0].client_secret;
      const redirect_uri = responseSupabase[0].redirect_uri;

      const urlMercado = `/oauth/token`;

      const payload = {
        grant_type: "authorization_code",
        client_id: client_id,
        client_secret: client_secret,
        code: code,
        redirect_uri: redirect_uri,
      };

      const requestMercado = await apiMercado.post(urlMercado, payload);
      const responseMercado = requestMercado.data;

      console.log(responseMercado);

      return responseMercado;
    } catch (error) {
      throw error;
    }
  }

  static async saveFirstToken(data: any) {
    try {
      const { empresa, idapp, user_id, nombre, email, scope, refresh_token, expiracion } = data;

      console.log(data);

      const expirationSegundos = expiracion;
      const expiracionFormat = new Date(Date.now() + expirationSegundos * 1000).toISOString();

      const url = `/rest/v1/rpc/grabar_mercadoacceso`;

      const payload = {
        p_empresa: empresa,
        p_idapp: idapp,
        p_user_id: user_id,
        p_nombre: nombre,
        p_email: email,
        p_scope: scope,
        p_refresh_token: refresh_token,
        p_expiracion: expiracionFormat,
      };

      const request = await apiSupabase.post(url, payload);
      const response = request.data;

      console.log(response);

      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getRefreshToken(data: any) {
    try {
      const { empresa, idapp, idusuario } = data;

      const url = `/rest/v1/rpc/obtener_mercadotoken`;

      const payload = {
        p_empresa: empresa,
        p_idapp: idapp,
        p_idusuario: idusuario,
      };

      const request = await apiSupabase.post(url, payload);
      const response = request.data;

      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getDataMpUser(refreshToken: string) {
    try {
      const urlIdSecret = `/rest/v1/mercadopagoapp?select=client_id,client_secret&idapp=eq.1`;

      const requestIdSecret = await apiSupabase.get(urlIdSecret);

      const clientId = requestIdSecret.data[0].client_id;
      const clientSecret = requestIdSecret.data[0].client_secret;

      const urlToken = `/oauth/token`;

      const payload = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }).toString();

      const requestToken = await apiMercado.post(urlToken, payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const accessTokenMercado = requestToken.data.access_token;

      const urlUser = `/users/me`;
      const requestUser = await apiMercado.get(urlUser, {
        headers: {
          Authorization: `Bearer ${accessTokenMercado}`,
        },
      });

      const response = requestUser.data;

      return response;
    } catch (error) {
      throw error;
    }
  }
}
