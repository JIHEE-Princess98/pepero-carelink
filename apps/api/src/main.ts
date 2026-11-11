import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module";
async function bootstrap() {
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
  await app.listen(Number(process.env.PORT) || 8080);
}
bootstrap();
