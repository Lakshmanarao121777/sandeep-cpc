import { CC, JUMP_BANK_BLOCKED, JUMP_CARD_BLOCKED, JUMP_CC_COMPONENT_LOADED } from '../constant/app.constant';
import { IChannelData } from '../model/channel-data';
import { PaymentType } from '../model/view.model';
import { ErrorHandling } from '../utils/error-handling';
import { ActionObserverService } from '../service/action-observer-service';
import { Globals } from '../utils/globals';
import { CommonWebComponent } from './common-web.component';
import { getBlockingErrorMessage, showBlockError } from '../utils/payment-config';


export class CardOnlyWebComponent extends HTMLElement {  
    _content: DocumentFragment = Object.assign({});
    _displayComponent:string;  
    private errorHandling:ErrorHandling = new ErrorHandling();
    cardOnlyActionDispatcher:ActionObserverService;
    commonWebComponent = new CommonWebComponent();
    global:Globals;

    get displayComponent() {
        return this._displayComponent;
    }
    set displayComponent(value) {
        if (value) {
            this.setAttribute('display-component', value);
            this._displayComponent = value;
        }
    }
    static get observedAttributes(): string[] {
        return ['display-component'];
    }
    constructor(){
        super(); 
        this.global = Globals.getInstance();
        console.log('cc web component constructor');
        this._content = new DocumentFragment();
        this._displayComponent = 'true';
        this.cardOnlyActionDispatcher = this.global.actionObserverService;
        this.subscribeAdditionalEvents();
        this.commonWebComponent.init('card-only-base-template',this , this.cardOnlyActionDispatcher , JUMP_CC_COMPONENT_LOADED);                
    }
    attributeChangedCallback(attrName: string, oldValue: string, newValue: string): void {
        this.commonWebComponent.attributeChangedCallback(attrName , oldValue , newValue , this);
    }
      
    async render(data:any):Promise <void> {        
        if(!this.displayComponent){
            const data = Object.assign({});
            data.showError = false;
            this.commonWebComponent.showError(data,this,PaymentType.CardOnly);
        } else if (this.global.appState.get(JUMP_CARD_BLOCKED) 
            && (this.global.appState.get('config')?.cpcPageType === PaymentType[PaymentType.CardOnly].toLowerCase() 
                || this.global.appState.get('config')?.cpcPageType === PaymentType[PaymentType.CardOnlyWithEdit].toLowerCase())) {
            showBlockError(this, JUMP_CARD_BLOCKED, getBlockingErrorMessage(this.global.appState.get(JUMP_CARD_BLOCKED), this.global.appState.get(JUMP_BANK_BLOCKED)), this.global.appState.get('channelData').channelDetails?.cpcMessageDisplayLocation, this.global.actionObserverService);
        } else {
            await this.commonWebComponent.showComponent(data,this,'CardOnlyBaseTemplate');
            const channelData:IChannelData = this.global.appState.get('channelData');
            if(channelData?.config?.iguard?.enableIguardIntegration){
                this.commonWebComponent.disableFields(data, CC);
            }
            if (this.global.appState.get(JUMP_CARD_BLOCKED)) {
                showBlockError(this, JUMP_CARD_BLOCKED, getBlockingErrorMessage(this.global.appState.get(JUMP_CARD_BLOCKED), this.global.appState.get(JUMP_BANK_BLOCKED)), this.global.appState.get('channelData').channelDetails?.cpcMessageDisplayLocation, this.global.actionObserverService);
            }
        }        
    }
    subscribeAdditionalEvents(){
        this.global.actionObserverService.subscribe((sender:any,data:any)=>{
            console.log('card blocked....', data);
            if(data?.detail?.action === JUMP_CARD_BLOCKED){
                this.commonWebComponent.removeComponent('jump-cc-template-container');
                this.commonWebComponent.showError(data.detail.data , this , PaymentType.CardOnly);
            }
        });
    }
}
customElements.define('jump-cc-web-component', CardOnlyWebComponent);

