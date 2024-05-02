import { MessageType } from '../model/view.model';
import { CPC_ERROR, CURRENT_CHANNEL_DOMAIN } from '../constant/app.constant';

export class ErrorHandler {
    private isErrorTemplateLoaded = false;
    public  isEnvValid(cpcEnv:string): boolean {
        let flag = true;
        if(!cpcEnv) {
            flag = false;
        } else if(cpcEnv.toLowerCase() === 'local' || cpcEnv.toLowerCase() === 'development' || cpcEnv.toLowerCase() === 'integration' 
        || cpcEnv.toLowerCase() === 'preproduction' || cpcEnv.toLowerCase() === 'production') {
            flag = true;
        } else {
            flag = false;
        }
        return flag;        
    }    
    public displayError(errorMessage:string) {        
        this.appendEnvErrorMessage(errorMessage);
        const cpcFormError = this.getErrorInstance(CPC_ERROR, MessageType.Config, MessageType.Error, errorMessage);
        window.postMessage(JSON.stringify(cpcFormError),CURRENT_CHANNEL_DOMAIN.URI);        
    }    
    private  appendEnvErrorMessage(errorMessage:string): void {
        if(!this.isErrorTemplateLoaded) {
            const containerDiv = document.getElementsByTagName('jump-web-component')[0]?.shadowRoot;
            this.appendErrorTemplate(errorMessage , containerDiv, false);
            const errorTemplateStyle = document.createElement('style');
            errorTemplateStyle.innerHTML = errorTemplateStyle.innerHTML + this.errorMessageStyles('');
            containerDiv?.appendChild(errorTemplateStyle);
            this.isErrorTemplateLoaded = true;
        }
    }
    private  appendErrorTemplate(errorMessage:string, containerDiv: any, iframeStyle:boolean): void {
        console.log(iframeStyle);        
        const jumpErrorTemplate = document.createElement('div');
        //jumpErrorTemplate.setAttribute('id','jump-error-template-message');
        jumpErrorTemplate.innerHTML = `
        <div class="alert alert-danger d-flex alert-dismissible fade show jump-error-style" role="alert">
        ${errorMessage}
        </div>`;
        containerDiv.appendChild(jumpErrorTemplate);
    }
    public getErrorInstance(cpcAction:string, type:string, errorType:string, messageDetails:any):any {
        const cpcMessage = Object.assign({});
        cpcMessage.action= cpcAction;
        cpcMessage.type= type;
        cpcMessage.level= errorType;
        cpcMessage.message= messageDetails;
        return cpcMessage;
    }   

    private  errorMessageStyles(style:any): string {
        return `.alert {
            border: 1px solid transparent;
            border-radius: 0.25rem;
            padding: 1rem;
            margin-bottom: 1rem;
            position: relative;
          }
          .d-flex {
            display: flex!important;
          }
          .alert-danger {
            background-color: #f8d7da;
            border-color: #f5c2c7;
            color: #842029;
            ${style};
          }`;
    }  
}
