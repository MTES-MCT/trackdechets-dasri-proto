import { initSubscriptions } from "./events";
import { app } from "./server";

const port = process.env.BACK_PORT || 80;
const backHost = process.env.BACK_HOST || "127.0.0.1";
app.listen({ host: "0.0.0.0", port: 8080 }, () =>
  console.info(`Server is running on port ${port}`)
);

initSubscriptions();
