import { IConfig, IEnvironmentConfig, LabelCase, PaymentType } from '../model/view.model';
import {envConfig} from '../config/config';
import { EVN_CPC_CONFIG_READY,EVN_CPC_PAGE_RESIZE,EVN_CPC_READY,ERR_HOSTED_APP_NOT_FOUND, CURRENT_CHANNEL_DOMAIN, ALLOWED_CHANNEL_DOMAIN_LIST } from '../constant/app.constant';
import { ErrorHandler } from '../service/error-handler';
export class JumpWebComponent extends HTMLElement {
    _config:IConfig = Object.assign({});
    _shadowRoot:ShadowRoot;
    _environmentConfig:IEnvironmentConfig = Object.assign({});
    private containerDiv:HTMLDivElement = Object.assign({});
    private iframeContainer:HTMLIFrameElement = Object.assign({});
    //private isHostedAppLoaded = false;
    private errorHandler = new ErrorHandler();

    static get observedAttributes(): string[] {
        return ['cpc-env','cpc-page-css-url', 'cpc-page-type', 'cpc-page-label-case', 'cpc-page-height','cpc-page-width', 'cpc-page-border'];
    }
    attributeChangedCallback(attrName:string, oldValue:string, newValue:string) :void {
      console.log("wc Inside attributeChangedCallback..")
      var pageTypeChanged=false;
        if(newValue !== oldValue) {
            switch (attrName) {

            case 'cpc-env':
                this._config.cpcEnv = newValue;
                this.setEnvConfig();
                const isCpcEnvValid = this.errorHandler.isEnvValid(this.cpcEnv);
                if(!isCpcEnvValid){
                    this.errorHandler.displayError(ERR_HOSTED_APP_NOT_FOUND);
                } else {
                    this.render(pageTypeChanged);
                }
                break;
            case 'cpc-page-css-url':
                this._config.cpcPageCssUrl = newValue;
                break;
            case 'cpc-page-type': 
            console.log("old: ", oldValue + " new: " + newValue);
            pageTypeChanged=true;
                this._config.cpcPageType = (newValue as any) as PaymentType;
                this.render(pageTypeChanged);
                break;
            case 'cpc-page-height':
                this._config.cpcPageHeight =newValue;
                break;
            case 'cpc-page-width':
                this._config.cpcPageWidth =newValue;
                break;
            case 'cpc-page-border':
                this._config.cpcPageBorder =newValue;
                break;
            case 'cpc-page-label-case': 
                this._config.cpcPageLabelCase = (newValue as any) as LabelCase;
                break;    
            default:
                break;
            }            
        }
    }
   
    
    get cpcEnv(){
        return this._config.cpcEnv;
    } 
    set cpcEnv(value) {
        if(value) {
            this.setAttribute('cpc-env', value);
            this._config.cpcEnv = value;
        }
    }
    get cpcPageCssUrl(){
        return this._config.cpcPageCssUrl;
    } 
    set cpcPageCssUrl(value) {
        if(value) {
            this.setAttribute('cpc-page-css-url', value);
            this._config.cpcPageCssUrl = value;
        }
    }
    get cpcPageType() {
        return this._config.cpcPageType;
    }
    set cpcPageType(value: PaymentType) {
        if(value) {
            this.setAttribute('cpc-page-type', value.toString());
            this._config.cpcPageType = value as PaymentType;
        }
    }
    get cpcPageHeight(){
        return this._config.cpcPageHeight;
    }
    set cpcPageHeight(value:string) {
        if(value) {
            this.setAttribute('cpc-page-height', value);
            this._config.cpcPageHeight = value;
        }
    }
    get cpcPageWidth(){
        return this._config.cpcPageWidth;
    }
    set cpcPageWidth(value:string) {
        if(value) {
            this.setAttribute('cpc-page-width', value);
            this._config.cpcPageWidth = value;
        }
    }
    get cpcPageBorder(){
        return this._config.cpcPageBorder;
    }
    set cpcPageBorder(value:string) {
        if(value) {
            this.setAttribute('cpc-page-border', value);
            this._config.cpcPageBorder = value;
        }
    }
    get cpcPageLabelCase() {
        return this._config.cpcPageLabelCase;
    }
    set cpcPageLabelCase(value: LabelCase) {
        if(value) {
            this.setAttribute('cpc-page-label-case', value.toString());
            this._config.cpcPageLabelCase = value as LabelCase;
        }
    }
      
    constructor(){
        super();  
        console.log('wc PERFORMANCE STATS - jump - start: ', performance.now());
        const shadowRoot = this.attachShadow({mode: 'open'});           
        this._shadowRoot = shadowRoot;
        this.isLoading(true);
        console.log("wc channel domain allowed:", this.isChannelDomainAllowed(window.location?.origin));
        if(this.isChannelDomainAllowed(window.location?.origin)){
            CURRENT_CHANNEL_DOMAIN.URI = window.location.origin;
        }
        console.log('wc constructor...');
    }
    setEnvConfig() {
        this._config.channelTemplateMapping = envConfig.channelTemplateMapping;
        if(this._config.cpcEnv) {
            switch(this._config.cpcEnv.toLowerCase()) {
            case 'local':
                this._config.envConfig = envConfig.environment.local;
                this._config.channelEnvironmentKeynameMapping = envConfig.channelEnvironmentKeynameMapping.local;
                break;
            case 'development':
                this._config.envConfig = envConfig.environment.development;
                this._config.channelEnvironmentKeynameMapping = envConfig.channelEnvironmentKeynameMapping.development;
                break;
            case 'integration':
                this._config.envConfig = envConfig.environment.integration;
                this._config.channelEnvironmentKeynameMapping = envConfig.channelEnvironmentKeynameMapping.integration;
                break;
            case 'preproduction':
                this._config.envConfig = envConfig.environment.preproduction;
                this._config.channelEnvironmentKeynameMapping = envConfig.channelEnvironmentKeynameMapping.preproduction;
                break;
            case 'production':
                this._config.envConfig = envConfig.environment.production;
                this._config.channelEnvironmentKeynameMapping = envConfig.channelEnvironmentKeynameMapping.production;
                break;                
            }
        }   
    }
    connectedCallback(): void {
        console.log("wc Inside connectedCallback");
        this.hostedAppBinding();
        const pageTypeChanged = false;
        this.render(pageTypeChanged);
        console.log('wc connectedCallback end...');
    }
    render(pageTypeChanged:Boolean): void {
        console.log("wc cpcEnv:" + this._config?.envConfig?.cpcEnv + " pageType:" + this._config.cpcPageType + " cpcPageWidth:" + this._config.cpcPageWidth);
        if(!this._shadowRoot || !this._config?.envConfig?.cpcEnv || !this._config.cpcPageType || !this._config.cpcPageWidth) {
            return;
        }else{        
        const rootElement = document?.querySelector('jump-web-component')?.shadowRoot;
        const iFrame = document?.querySelector("jump-web-component")?.shadowRoot?.querySelector("iframe");
        if(rootElement && !iFrame && !pageTypeChanged) {
            rootElement.innerHTML = '';
            this.appendIframe();
        }else if(this._config.cpcPageType && pageTypeChanged){
            this.appendIframe();
        }
        }
        console.log('wc PERFORMANCE STATS - jump - end: ', performance.now());
    }
    appendIframe(){
        console.log("wc - Appending iframe");
        const iframe = document.createElement('iframe');
        this.containerDiv = document.createElement('div');
        this.containerDiv.id = 'jump-web-component-container';
        
        iframe.id = 'jump-hosted-app-iframe';
        iframe.src = this._config.envConfig.cpcEnv;
        iframe.scrolling = 'no';
        iframe.style.width = this._config.cpcPageWidth;
        iframe.style.border = this._config.cpcPageBorder;
        iframe.style.overflow = 'hidden';
        this.iframeContainer = iframe;        
                
        iframe.className = 'jump-iframe';                         
        this.containerDiv.appendChild(iframe);
        this._shadowRoot.appendChild(this.containerDiv);
        console.log("wc appended iFrame successfully to shadowRoot" + iframe);
    } 
    isLoading(loading:boolean): void {
        console.log("wc send CPC_LOADING event");
        const data = Object.assign({});
        data.action = 'CPC_LOADING';
        data.isLoading = loading;
        if(this.isChannelDomainAllowed(window.location?.origin)){
            CURRENT_CHANNEL_DOMAIN.URI = window.location.origin;
            console.log('wc CURRENT_CHANNEL_DOMAIN.URI:' + CURRENT_CHANNEL_DOMAIN.URI)
        }
        window.postMessage(JSON.stringify(data),CURRENT_CHANNEL_DOMAIN.URI);
   
    }         
    hostedAppBinding(): void {
        console.log("wc Inside hostedAppBinding");
        window.addEventListener('message', (message) => {
            const isDomainAllowed = this.isChannelDomainAllowed(message.origin);
            console.log('wc isDomainAllowed:', isDomainAllowed + " : origin: " + message.origin + ": message: " + JSON.stringify(message));
            if(isDomainAllowed  && message && message.data && typeof message.data==='string' && message.data.indexOf('"action":') >= 0){                
                const data = JSON.parse(message.data);
                if(data.action === EVN_CPC_READY) {
                    //this.isHostedAppLoaded = true;
                    //document?.querySelector('jump-web-component')?.shadowRoot?.getElementById('jump-error-template-message')?.remove();
                    this.isLoading(false);
                    console.log('jump component cpc-ready', data);
                    if(data && data.hostedAppLoaded) {            
                        const cpcDetailedMessage:any = {
                            action: EVN_CPC_CONFIG_READY,
                            config: this._config
                        };
                        cpcDetailedMessage.cpcMessage = 'Jump component cpc-ready.';
                        cpcDetailedMessage.cpcStatus = 'SUCCESS';
                        window.postMessage(JSON.stringify(cpcDetailedMessage), CURRENT_CHANNEL_DOMAIN.URI);
                    } 
                } else if(data.action === EVN_CPC_PAGE_RESIZE){
                    console.log('wc page resize called!');
                    this.containerDiv.style.height = data.pageHeight;
                    this.iframeContainer.height = data.pageHeight;
                }
            }            
        });        
    }
    isChannelDomainAllowed(uri: string): boolean{
        const allowedList:Array<string> = ALLOWED_CHANNEL_DOMAIN_LIST;
        let flag = false;
        if(uri){
            for(let i=0; i<allowedList.length; i++){
                if(uri.indexOf(allowedList[i])>=0){
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }       
}
customElements.define('jump-web-component', JumpWebComponent);