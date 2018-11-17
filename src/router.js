import path from 'path';
import {version} from '../package.json';
import multer from 'multer';
import _ from 'lodash';
import File from './models/file';

class AppRouter{
    constructor(app){
        this.app = app;
        this.setupRouters();
    }
    setupRouters(){        
        const app = this.app;
        const db = app.get('db');
        const uploads = multer({dest:upload})
        //root router
        app.get('/',(req,res,next)=>{
            return res.status(200).json({
                version:version
            });
        });
        console.log("thhe app routing is init");

        const uploadDir = app.get('storageDir');

        const upload = app.get('upload');

       app.post('/api/upload',uploads.array('files'),(req,res,next)=>{

          console.log('File Uploaded',upload.array('file'),req.files);
          
          const file = _.get(req,'files',[]);
          let fileModels =[];

          _.each(file,(fileObject)=>{
              const newFile = new File(app).initWithObject(fileObject);
              fileModels.push(newFile)
          });
          if(fileModels.length){
              db.collection('files').insertMany(fileModels,(err,result)=>{
                  if(err){
                      return res.status(501).json({
                          error:{
                              messages:err.toString()
                          }
                      })
                  }else{
                      console.log("save file with result",err,result);
                      return res.json({
                          files:fileModels
                      })
                  }
              })
          }else{
              return res.status(503).json({
                  error:{"messages":"Unable saved your files"}
              })
          }
          return res.json({
              files:files
          })
       });

       //download routing

       app.get('/api/download/:id',(req,res,next)=>{
        const fileId = req.params.id;
        db.collection('files').find({_id:ObjectID(fileId)}).toArray((err,result)=>{

            console.log("Find file object from DB",err,result);

         const filename = _.get(result,'name');

        const filePath = path.join(uploadDir+filename);

        return res.download(filePath,filename,(err)=>{

            if(err){

                return res.status(404).json({

                    error:{
                        message: 'File not found'
                    }

                });

            }
            else{

                console.log("File is Donwloaded");

            }
        })

        });
        
        return res.json({
               hi:filename
           })
       });
    }
}

export default AppRouter;