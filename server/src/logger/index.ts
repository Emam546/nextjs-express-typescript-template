import { NodeEnvs } from "@serv/declarations/enums";
import EnvVars from "@serv/declarations/major/EnvVars";
import { transports, format, createLogger, Logger } from "winston";
let logger: Logger = createLogger({
    transports: [new transports.Console({})],
    format: format.combine(
        format.colorize(),
        format.simple(),
        format.errors({ stack: true })
    ),
});
if (EnvVars.nodeEnv == NodeEnvs.Production) {
    logger = createLogger({
        transports: [
            new transports.File({
                level: "error",
                filename:"production.log"
            }),
        ],
        format: format.combine(
            format.json(),
            format.timestamp(),
            format.errors({ stack: true })
        ),
    });
    
}
export default logger;
