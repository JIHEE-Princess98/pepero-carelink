import { createApp } from "./app";

async function bootstrap() {
  const app = await createApp();
  await app.listen(Number(process.env.PORT) || 8080);
}
bootstrap();
