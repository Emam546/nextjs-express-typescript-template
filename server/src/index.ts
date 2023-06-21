import "./pre-start"; // Must be the first import
import logger from "@serv/logger";
import EnvVars from "@serv/declarations/major/EnvVars";
import server from "./server";
import next from "next";

const dev = EnvVars.nodeEnv == "development";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        server.get("*", (req, res) => {
            return handle(req, res);
        });

        const msg =
            "Express server started on port: " + EnvVars.port.toString();
        server.listen(EnvVars.port, () => logger.info(msg));
    })
    .catch((ex) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        logger.error(ex.stack);
    });
// **** Start server **** //
