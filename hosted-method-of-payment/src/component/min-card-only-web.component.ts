import { JUMP_BANK_BLOCKED, JUMP_CARD_BLOCKED, JUMP_MIN_COMPONENT_LOADED } from '../constant/app.constant';
import { PaymentType } from '../model/view.model';
import { ActionObserverService } from '../service/action-observer-service';
import { ErrorHandling } from '../utils/error-handling';
import { Globals } from '../utils/globals';
import { getBlockingErrorMessage, showBlockError } from '../utils/payment-config';
import { CommonWebComponent } from './common-web.component';

export class MinCardOnlyWebComponent extends HTMLElement {  
    _content: DocumentFragment = Object.assign({});
    _displayComponent:string;
    private errorHandling:ErrorHandling = new ErrorHandling();
    minCardOnlyActionDispatcher:ActionObserverService;
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
        this._content = new DocumentFragment();
        this._displayComponent = 'true';
        this.minCardOnlyActionDispatcher = this.global.actionObserverService;
        this.subscribeAdditionalEvents();
        this.commonWebComponent.init('min-card-only-base-template',this , this.minCardOnlyActionDispatcher , JUMP_MIN_COMPONENT_LOADED);                
    }
    attributeChangedCallback(attrName: string, oldValue: string, newValue: string): void {
        this.commonWebComponent.attributeChangedCallback(attrName , oldValue , newValue , this);
    }
      
    render(data:any): void {        
        if(!this.displayComponent){
            const data = Object.assign({});
            data.showError = false;
            this.commonWebComponent.showError(data,this,PaymentType.MinCardOnly);
        } else if(this.global.appState.get(JUMP_CARD_BLOCKED)) {
            showBlockError(this, JUMP_CARD_BLOCKED, getBlockingErrorMessage(this.global.appState.get(JUMP_CARD_BLOCKED), this.global.appState.get(JUMP_BANK_BLOCKED)), this.global.appState.get('channelData').channelDetails?.cpcMessageDisplayLocation, this.global.actionObserverService);
        } else {
            this.commonWebComponent.showComponent(data,this,'MinCardOnlyBaseTemplate');
        }        
    }
    subscribeAdditionalEvents(){
        this.global.actionObserverService.subscribe((sender:any,data:any)=>{
            if(data?.detail?.action === JUMP_CARD_BLOCKED){
                console.log('card blocked....');
                this.commonWebComponent.removeComponent('jump-min-cc-template-container');
                this.commonWebComponent.showError(data.detail.data , this , PaymentType.MinCardOnly);
            }
        });
    }
  
}
customElements.define('jump-min-card-web-component', MinCardOnlyWebComponent);
