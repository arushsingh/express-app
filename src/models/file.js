import _ from 'lodash';
class File{
    constructor(app,object){
        this.app(app);
        this.model={
            name:null,
            originalName:null,
            mineType:null,
            size:null,
            created:Date.now()
        }
    }
    initWithObject = (object) =>{
        this.model.name =_.get(object,'name');
        this.model.originalName = _.get(object,'originalname');
        this.model.mineType =_.get(object,'minetype');
        this.modal.size = _.get(object,'size');
        this.modal.created = Date.now();
        return this;
    }
    toJSON = () =>{return this.model}
    save(callback){
        const db = this.app.get('db');
        db.collection('files').insertone(this.model,(err,result)=>{
            return callback(err,result);
        });
    }
}
export default File;