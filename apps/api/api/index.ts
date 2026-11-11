import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp } from "../src/app";

let appPromise: ReturnType<typeof createApp> | undefined;

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  appPromise ??= createApp();
  const app = await appPromise;
  return app.getHttpAdapter().getInstance()(request, response);
}
