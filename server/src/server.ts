import cookieParser from "cookie-parser";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";

import "express-async-errors";

import BaseRouter from "./routes";
import logger from "@serv/logger";
import EnvVars from "@serv/declarations/major/EnvVars";
import HttpStatusCodes from "@serv/declarations/major/HttpStatusCodes";
import { NodeEnvs } from "@serv/declarations/enums";
import { RouteError } from "@serv/declarations/classes";
import expressWinstom from "express-winston";

// **** Init express **** //

const app = express();

// **** Set basic express settings **** //

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.cookieProps.secret));
app.use(
    expressWinstom.logger({
        winstonInstance: logger,
        statusLevels: true,
    })
);

// Security
if (EnvVars.nodeEnv === NodeEnvs.Production) {
    app.use(helmet());
}

// **** Add API routes **** //

// Add APIs
app.use("/api", BaseRouter);

// Setup error handler
app.use(
    (
        err: Error,
        _: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: NextFunction
    ) => {
        logger.error(err);
        let status = HttpStatusCodes.BAD_REQUEST;
        if (err instanceof RouteError) {
            status = err.status;
        }
        return res.status(status).json({ error: err.message });
    }
);

// **** Export default **** //

export default app;
