import { FetchData } from '../api/fetch-data';
import { ACH, CC, CURRENT_CHANNEL_DOMAIN, EVN_CPC_ERROR } from '../constant/app.constant';
import { MessageType, PaymentType } from '../model/view.model';
import { ActionObserverService } from '../service/action-observer-service';
import { Globals } from '../utils/globals';
import { ErrorWebComponent } from './error-web.component';
export class CommonWebComponent  {  
    global:Globals;
    constructor(){
        this.global = Globals.getInstance();
        console.log('cc web component constructor');
    }
    attributeChangedCallback(attrName: string,oldValue: string,newValue: string , component: any): void {
        if (newValue !== oldValue) {
            switch (attrName) {           
            case 'display-component':
                component._displayComponent = newValue;
                component.render({});
                break;
            case 'address-for':
                component._addressFor = newValue;                
                break;
            case 'account-type-for':
                component._accountTypeFor = newValue;
                break;
            case 'tc-for':
                component._tcFor = newValue;
                break; 
            case 'care-for':
                component._careFor = newValue;
                break;   
            case 'userrole-list-for':
                component._userroleListFor = newValue;
                break;            
            default:
                break;
            }
        }
    }
    
    init(pageType:string , component:any , dispatchEventName:any , actionType:string): void { 
        if(!component._content){
            return;
        }        
        const rootUrl = this.global.appState.get('config').envConfig.cpcEnv.split('/');
        const url:string = this.global.appState.get('config').envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/base/'+pageType+'.html'; 
        this.fetch(url,component,dispatchEventName,actionType);
    }
    fetch(url: string , component:any , dispatchEventName:ActionObserverService , actionType:string) {
        (async () => {
            const fetchData = new FetchData();     
            const data  = await fetchData.get(url);
            if(data) {
                component.render(data);
                dispatchEventName.fire(this,{detail: {action : actionType}});            
            }
        })();        
    }

    async showComponent(data: any , component:any , templateId:string ){                
        const template = this.getTemplateContent(data,templateId);
        component._content.appendChild(template);
        component.appendChild(component._content); 
    }
    async removeComponent(templateId:string ){ 
        const component = document?.querySelector('[name="'+templateId+'"]');
        if(component){
            component.classList.add('d-none');
            // component.remove();
        }          
    }
    disableFields(data:any, paymentType:string){
        const cache = Object.assign({});
        if(data){
            if(paymentType === CC){
                cache.cardCc = document.querySelector('#jump-card-only-container [id="jump-credit-card"]');
                cache.cardExpMM = document.querySelector('#jump-card-only-container [id="jump-expiry-mm"]');
                cache.cardExpYY = document.querySelector('#jump-card-only-container [id="jump-expiry-yy"]');
                cache.cardCvv = document.querySelector('#jump-card-only-container [name="jump-cvv"]');
            }
            if(paymentType === ACH){
                cache.achAccountNo = document.querySelector('#jump-ach-only-container [id="jump-account-no"]');
                cache.achRoutingNo = document.querySelector('#jump-ach-only-container [id="jump-routing-no"]');
            }
            for (const key in cache) {
                if (Object.prototype.hasOwnProperty.call(cache, key)) {
                    cache[key].setAttribute('disabled', true);
                }
            }
        }
    }
    getTemplateContent(data:any , templateId:string):any{
        const domContent = new DOMParser().parseFromString(data.toString(), 'text/html');
        const template = Object.assign({});
        let content = '';
        template.cc = domContent.documentElement.querySelector('[id="'+templateId+'"]');
        if(template.cc){
            content = template.cc?.content?.cloneNode(true);
        }
        return content;
    }
    showError(data: any , component:any , cardTypeNum : any){
        const div = document.createElement('div');
        const erroWebComponent = new ErrorWebComponent();
        erroWebComponent.isRemoveExisting = 'false';
        if(data?.displayMessageLocation){
            erroWebComponent.displayMessageLocation = data?.displayMessageLocation;    
        } else{
            erroWebComponent.displayMessageLocation = 'top';    
        }        
        erroWebComponent.errorMessage = data?.errorMessage;
        erroWebComponent.paymentType = PaymentType[cardTypeNum].toString();
        if(data.showError) {
            if(component.children && component.length>0){
                component.children[0].remove();
            }
            component._content = new DocumentFragment();
        }
        div.appendChild(erroWebComponent);
        component._content.appendChild(div);                
        component.appendChild(component._content);

        const cpcFormError = component.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error,data?.errorMessage);
        parent.postMessage(JSON.stringify(cpcFormError), CURRENT_CHANNEL_DOMAIN.URI);
    }


  
}
