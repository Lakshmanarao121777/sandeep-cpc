import { ENV_VARIABLES, IConfig } from '../model/view.model';
import { Globals } from '../utils/globals';

export class ConfigValidation {
    public isValidConfig(configData:IConfig):boolean {
        let flag = true;
        if(configData){
            if(configData.cpcEnv.toLowerCase() === ENV_VARIABLES.local) {
                flag = true;
            } else if(configData.cpcEnv.toLowerCase() === ENV_VARIABLES.preproduction) {
                flag = true;
            } else if(configData.cpcEnv.toLowerCase() === ENV_VARIABLES.production) {
                flag = true;
            } else if(configData.cpcEnv.toLowerCase() === ENV_VARIABLES.integration) {
                flag = true;
            } else if(configData.cpcEnv.toLowerCase() === ENV_VARIABLES.development) {
                flag = true;
            } else {
                flag = false;
            }
        }else{
            flag = false;
        }
        return flag;
    }

    public isValidTemplate(cpcPageType:string):boolean {
        let flag = false;
        const template = Globals.getInstance().templates.get(cpcPageType);
        if (cpcPageType && cpcPageType !== '' && template && template === cpcPageType.toLowerCase()) {
            flag = true;
        }
        return flag;    
    }

    public isChannelPageTypeValid(channelTemplateMapping:any, channelName:string, cpcPageType:string):boolean {
        let flag = false;
        channelTemplateMapping?.forEach((channelTemplateConfig:any):any => {
            if(channelTemplateConfig.channel === channelName) {
                if(channelTemplateConfig.template === cpcPageType) {
                    flag = true;
                    return flag; 
                }
            }
        });
        return flag;
    }
}