import { Hono } from "hono";
import { validator } from "hono/validator";
import { HTTPException } from "hono/http-exception";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/ws/:room", async (c) => {
  if (c.req.header("upgrade") !== "websocket") {
    return c.text("Expected Upgrade: websocket", 426);
  }

  const room = c.env.MY_DURABLE_OBJECT.idFromName(c.req.param("room"));
  const stub = c.env.MY_DURABLE_OBJECT.get(room);
  return stub.fetch(c.req.raw);
});

export { MyDurableObject } from "./ws";
export default app;
