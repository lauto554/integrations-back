import { Request, Response } from "express";

export class MainController {
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
}
