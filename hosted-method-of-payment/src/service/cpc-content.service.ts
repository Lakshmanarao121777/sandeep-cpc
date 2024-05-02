export class CPCContentService {
    private cpcContentResponseMapping:any = [];
    constructor(cpcContentResponseMapping:any,){
        this.cpcContentResponseMapping = cpcContentResponseMapping;
    }
    getcpcContentResponseMapping (channelName:string) {
        const result:any = {};
        let isFound = false;
        for(const item of this.cpcContentResponseMapping) {
            if(item.channel.length>0){
                for(const channel of item.channel){
                    if(channel.toLowerCase() === channelName.toLowerCase()){
                        console.log('found!');
                        isFound = true;
                        result.channel = item.channel;                        
                        result['auto-pay-base-template'] = item['auto-pay-base-template']? item['auto-pay-base-template'] : null;
                        result['card-only-base-template'] = item['card-only-base-template']? item['card-only-base-template'] : null;
                        result['terms-conditions-base-template'] = item['terms-conditions-base-template']? item['terms-conditions-base-template'] : null;
                        result['wallet-mgmt-no-autopay-template'] = item['wallet-mgmt-no-autopay-template']? item['wallet-mgmt-no-autopay-template'] : null;
                        result['user-selection-base-title'] = item['user-selection-base-title']? item['user-selection-base-title'] : null;
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
    mergecpcContents(channelObj:any,resultObj:any){ 
        if(channelObj){    
            if(this.isString(channelObj)){
                return;
            } else{
                for(const prop in channelObj){      
                    if(this.isString(channelObj[prop])){
                        resultObj[prop] = channelObj[prop];                        
                    }          
                    this.mergecpcContents(channelObj[prop],resultObj[prop]);
                }
            }    
        } 
    }
}