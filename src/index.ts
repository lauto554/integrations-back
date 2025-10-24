import { startServer } from "./server";
import { DatabasePg, DatabasePgConfig } from "./backend-resources/models/DatabasePg";
import "colors";
import dotenv from "dotenv";

dotenv.config();

async function startApplication(): Promise<void> {
  try {
    const PORT: number = parseInt(process.env.PORT!);

    const config: DatabasePgConfig = {
      host: process.env.DBHOST!,
      port: Number(process.env.DBPORT!),
      user: process.env.DBUSER!,
      password: process.env.DBPASS!,
      database: process.env.DBNAME!,
    };

    await DatabasePg.connect(config);

    await DatabasePg.testConnection();

    startServer(PORT);
  } catch (error) {
    console.error("Error al iniciar la aplicación:".red, error);
    process.exit(1);
  }
}

async function shutDownApplication(): Promise<void> {
  await DatabasePg.close();
  process.exit(0);
}

process.on("SIGINT", shutDownApplication);
process.on("SIGTERM", shutDownApplication);

startApplication();
