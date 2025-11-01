import cors from "cors";
import express, { urlencoded } from "express";
import connectToDatabase from "./config/db";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import catchError from "./utils/catchError";
import { OK } from "./constants/http";
import authRoutes from "./routes/auth.route";

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
    })
);

app.use(cookieParser());

//health check
app.get("/", (req, res, next) => {
  return res.status(OK).send("Server is healthy");
});

// authRoutes
app.use("/auth", authRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(
    `Server is running successfully on port: ${PORT} in ${NODE_ENV} environment`
  );
  await connectToDatabase();
});
