import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import {connect} from './database';
import AppRouter from './router';
import multer from 'multer';
import path from 'path';

const PORT = 3000;
const app = express();
app.server = http.createServer(app);


app.use(morgan('dev'));


app.use(cors({
    exposedHeaders: "*"
}));

app.use(bodyParser.json({
    limit: '50mb'
}));
console.log('thi sis a test');
app.set('root', __dirname);
app.set('storageDir',storageDir);
app.set('upload',upload);

//file storage config

const storageDir = path.join(__dirname,'..','storage');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, storageDir)
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
  var upload = multer({ storage: storage })
//file storage config

//connect to database

connect((err,db)=>{
    if(err){
        console.log('there is a error connecting to the DB ',err);
        throw (err);
    }
    new AppRouter(app);

    app.server.listen(process.env.PORT || PORT, () => {
        console.log(`App is running on port ${app.server.address().port}`);
    });
});

export default app;