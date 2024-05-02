export class ErrorMessageService {
    private errorResponseMapping:any = [];
    private responseMessages:any;
    constructor(errorResponseMapping:any,responseMessages:any){
        this.errorResponseMapping = errorResponseMapping;
        this.responseMessages = responseMessages;
    }
    getErrorResponseMapping (channelName:string) {
        const result:any = {};
        let isFound = false;
        for(const item of this.errorResponseMapping) {
            if(item.channel.length>0){
                for(const channel of item.channel){
                    if(channel.toLowerCase() === channelName.toLowerCase()){
                        console.log('found!');
                        isFound = true;
                        result.channel = item.channel;                        
                        result.system = item.system? item.system : null;
                        result.form = item.form? item.form : null;
                        result.service = item.service? item.service : null;
                        result.communication = item.communication? item.communication : null;
                        break;
                    }                            
                }
            }
            if(isFound){
                break;
            }            
        }
        return result;
    }
    isString (obj:any):boolean {
        return typeof obj === 'string';
    }
    mergeErrors(channelObj:any,resultObj:any){ 
        if(channelObj){    
            if(this.isString(channelObj)){
                return;
            } else{
                for(const prop in channelObj){      
                    if(this.isString(channelObj[prop])){
                        resultObj[prop] = channelObj[prop];                        
                    }          
                    this.mergeErrors(channelObj[prop],resultObj[prop]);
                }
            }    
        } 
    }
    fillResponseErrorMessageMap(): Map<string,string>{
        const errorMap:Map<string,string> = new Map<string,string>();
        for(const obj in this.responseMessages){
            errorMap.set(obj,this.responseMessages[obj]);
        }
        return errorMap;
    }
}