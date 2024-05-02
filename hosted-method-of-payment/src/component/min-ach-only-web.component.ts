import { ErrorHandling } from '../utils/error-handling';
import { JUMP_BANK_BLOCKED, JUMP_CARD_BLOCKED, JUMP_MIN_ACH_COMPONENT_LOADED } from '../constant/app.constant';
import { PaymentType } from '../model/view.model';
import { ActionObserverService } from '../service/action-observer-service';
import { Globals } from '../utils/globals';
import { CommonWebComponent } from './common-web.component';
import { getBlockingErrorMessage, showBlockError } from '../utils/payment-config';

export class MinAchOnlyWebComponent extends HTMLElement {  
    _content: DocumentFragment = Object.assign({});
    _displayComponent:string;
    private errorHandling:ErrorHandling=new ErrorHandling();
    minAchOnlyActionDispatcher:ActionObserverService;
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
        console.log('min ach web component constructor');       
        this._content = new DocumentFragment();
        this._displayComponent = 'true';
        this.minAchOnlyActionDispatcher = this.global.actionObserverService;
        this.subscribeAdditionalEvents();
        this.commonWebComponent.init('min-ach-only-base-template',this , this.minAchOnlyActionDispatcher , JUMP_MIN_ACH_COMPONENT_LOADED);
    }
    attributeChangedCallback(attrName: string, oldValue: string, newValue: string): void {
        this.commonWebComponent.attributeChangedCallback(attrName , oldValue , newValue , this);
    }
  
    render(data: any): void {
        if(!this.displayComponent){
            const data = Object.assign({});
            data.showError = false;
            this.commonWebComponent.showError(data,this,PaymentType.MinAchOnly);
        } else if(this.global.appState.get(JUMP_BANK_BLOCKED)) {
            showBlockError(this, JUMP_BANK_BLOCKED, getBlockingErrorMessage(this.global.appState.get(JUMP_CARD_BLOCKED), this.global.appState.get(JUMP_BANK_BLOCKED)), this.global.appState.get('channelData').channelDetails?.cpcMessageDisplayLocation, this.global.actionObserverService);
        } else {
            this.commonWebComponent.showComponent(data,this,'MinAchOnlyBaseTemplate');
        } 
    }
    subscribeAdditionalEvents(){
        this.global.actionObserverService.subscribe((sender:any,data:any)=>{
            if(data?.detail?.action === JUMP_BANK_BLOCKED){
                console.log('bank blocked....');
                this.commonWebComponent.removeComponent('jump-min-ach-only-template-container');
                this.commonWebComponent.showError(data.detail.data , this , PaymentType.MinAchOnly);
            }
        });
    }
}
customElements.define('jump-min-ach-only-web-component', MinAchOnlyWebComponent);