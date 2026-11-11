import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./module";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.WEB_ORIGIN || "http://localhost:8000" });
  await app.listen(Number(process.env.PORT) || 8080);
}
bootstrap();
