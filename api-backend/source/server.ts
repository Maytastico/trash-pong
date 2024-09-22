import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';    
import routes from './routes/index';
import { initializeWebSocketServer } from './gameclient/socket';

const router: Express = express();

router.use(morgan('dev'));
router.use(express.urlencoded({extended: false}));
router.use(express.json());

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

router.use('/', routes);

router.use((req: any, res:any) => {
    const error = new Error('Not Found');
    return res.status(404).json({
        message: error.message
    });
});

const httpServer: http.Server = http.createServer((router))

let port: number = 3000;
if(process.env.PORT != undefined && parseInt(process.env.PORT) > 0) {
    port = parseInt(process.env.PORT);
}

initializeWebSocketServer(httpServer);

httpServer.listen(port, () => console.log(`The server listening on port ${port}`));
