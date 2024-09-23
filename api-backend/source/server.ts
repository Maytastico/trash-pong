import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';    
import routes from './routes/index';
import { initializeWebSocketServer } from './gameclient/socket';

//Creates an instance of the express server
const router: Express = express();

//Middleware for logging
router.use(morgan('dev'));
//Forces the API to only accept URL encoded parameters
router.use(express.urlencoded({extended: false}));
//Forces the API to only accept JSON
router.use(express.json());

//Sends CORS Policy Headers
router.use((req: any, res: any, next: Function) => {
    // CORS Policy and headers
    // @ts-ignore
    res.header('Access-Control-Allow-Origin', '*');
    //res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With, Content-Type, Accept', 'Authorization');
    res.header('Access-Control-Allow-Headers', '*');


    if(req.method === 'OPTIONS') {
        // @ts-ignore
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        return res.status(200).send('OK');
    }
    next();
});

//Routes for the API
router.use('/', routes);

//Error handling 
router.use((req: any, res:any) => {
    const error = new Error('Not Found');
    return res.status(404).json({
        message: error.message
    });
});

//Creates an instance of the HTTP server and includes the routes.
const httpServer: http.Server = http.createServer((router))

// Specifies the port the server listens on
let port: number = 3000;
if(process.env.PORT != undefined && parseInt(process.env.PORT) > 0) {
    port = parseInt(process.env.PORT);
}

//Initializes the WebSocket server
initializeWebSocketServer(httpServer);

//Starts the server
httpServer.listen(port, () => console.log(`The server listening on port ${port}`));
