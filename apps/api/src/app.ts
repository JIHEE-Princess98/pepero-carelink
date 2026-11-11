import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module";

export async function createApp() {
  const app = await NestFactory.create(AppModule);
  const origins = (process.env.WEB_ORIGIN || "http://localhost:8000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  });
  await app.init();
  return app;
}
