import { ACH, CC, JUMP_ACH_USERROLE_LIST_COMPONENT_LOADED, JUMP_CC_USERROLE_LIST_COMPONENT_LOADED } from '../constant/app.constant';
import { IViewModelEncrypted } from '../model/view.model';
import { ActionObserverService } from '../service/action-observer-service';
import { Globals } from '../utils/globals';
import { CommonWebComponent } from './common-web.component';
import { Validation } from '../utils/validation';
export class UserroleListWebComponent extends HTMLElement {
    _content: DocumentFragment;
    _userroleListFor = '';
    userroleListActionDispatcher: ActionObserverService;
    commonWebComponent = new CommonWebComponent();
    global: Globals;
    public validations = new Validation();

    static get observedAttributes(): string[] {
        return ['userrole-list-for'];
    }
    get userroleListFor() {
        return this._userroleListFor;
    }
    set userroleListFor(value) {
        if (value) {
            this.setAttribute('userrole-list-for', value);
            this._userroleListFor = value;
        }
    }
    constructor() {
        super();
        this._content = new DocumentFragment();
        this.global = Globals.getInstance();
        this.userroleListActionDispatcher = Globals.getInstance().actionObserverService;
        if (this.getAttribute('userrole-list-for')?.toLowerCase() === CC) {
            this.commonWebComponent.init('userrole-list-base-template', this, this.userroleListActionDispatcher, JUMP_CC_USERROLE_LIST_COMPONENT_LOADED);
        }
        if (this.getAttribute('userrole-list-for')?.toLowerCase() === ACH) {
            this.commonWebComponent.init('userrole-list-base-template', this, this.userroleListActionDispatcher, JUMP_ACH_USERROLE_LIST_COMPONENT_LOADED);
        }
    }
    attributeChangedCallback(attrName: string, oldValue: string, newValue: string): void {
        this.commonWebComponent.attributeChangedCallback(attrName, oldValue, newValue, this);
    }

    render(data: any): void {
        const domContent = new DOMParser().parseFromString(data.toString(), 'text/html');
        const template = Object.assign({});
        template.cc = domContent.documentElement.querySelector('[id="UserroleListBaseTemplate"]');
        const userRoleList = this.global.appState.get('channelData')?.customerDetails?.userRoleList;

        if (userRoleList && template.cc) {
            template.ccContent = template.cc?.content?.cloneNode(true);
            const enableMultipleUserSelection = this.global.appState.get('channelData')?.config?.enableMultipleUserSelection;
            if(userRoleList && enableMultipleUserSelection){
                this._content.appendChild(template.ccContent);
                this.appendChild(this._content);
            }
        }
    }
    validate(): boolean {
        return true;
    }
    submit(paymentSuccess: boolean, vm: IViewModelEncrypted, cpcPageType: string): void {
        //this.userroleListOnlyService.paymentClick(paymentSuccess, vm, cpcPageType);
    }
}
customElements.define('jump-userrole-list-web-component', UserroleListWebComponent);