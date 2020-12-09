import { initSubscriptions } from "./events";
import { app } from "./server";

const port = process.env.BACK_PORT || 80;
const backHost = process.env.BACK_HOST || "121.0.0.1";
app.listen({ host: backHost, port: port }, () =>
  console.info(`Server is running on port ${port}`)
);

initSubscriptions();
