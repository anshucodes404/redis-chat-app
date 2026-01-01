// import './dotEnvConfig';
import http from "http";
import SocketService from "./services/socket";

async function init(){

    const socketService = new SocketService();

    const httpServer = http.createServer();
    const PORT = process.env.PORT || 8000;

    socketService.io.attach(httpServer);

    socketService.initListeners();


    // Health check endpoint
    httpServer.on("request", (req, res) => {
        if (req.url === "/health") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "ok" }));
        }
    });



    httpServer.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

init();