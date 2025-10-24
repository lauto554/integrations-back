import { Request, Response } from "express";
import apiSupabase from "../backend-resources/lib/apiSupabase";
import { ResponseModel } from "../backend-resources/models/ResponseModel";

export class AuthController {
  static async signIn(req: Request, res: Response) {
    try {
      const { company, username, password } = req.body;

      const url = `/rest/v1/rpc/valida_signin`;
      const payload = {
        p_usuario: username,
        p_password: password,
        p_nfantasia: company,
      };

      const request = await apiSupabase.post(url, payload);

      const response = request.data;

      if (response === -1) {
        const response = ResponseModel.create("error", 400, "Credenciales Incorrectas");
        res.status(400).json(response);
        return;
      }

      res.json(ResponseModel.create("success", 200, "Inicio de sesión exitoso"));
      return;
    } catch (error) {
      console.error("Error during sign-in:", error);
      const response = ResponseModel.create("error", 400, "Error during sign-in: " + error);
      res.status(400).json(response);
      return;
    }
  }
}
