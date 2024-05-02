export class ErrorWebComponent extends HTMLElement {
    _content: DocumentFragment = Object.assign({});
    _errorMessage = '';
    _displayMessageLocation = 'top';
    _paymentType = '';
    _isRemoveExisting = 'true';

    get errorMessage() {
        return this._errorMessage;
    }
    set errorMessage(value) {
        if (value) {
            this.setAttribute('error-message', value);
            this._errorMessage = value;
        }
    }

    get displayMessageLocation() {
        return this._displayMessageLocation;
    }
    set displayMessageLocation(value) {
        if (value) {
            this.setAttribute('display-message-location', value);
            this._displayMessageLocation = value;
        }
    }

    get paymentType() {
        return this._paymentType;
    }
    set paymentType(value) {
        if (value) {
            this.setAttribute('payment-type', value);
            this._paymentType = value;
        }
    }
    get isRemoveExisting() {
        return this._isRemoveExisting;
    }
    set isRemoveExisting(value) {
        if (value) {
            this.setAttribute('is-remove-existing', value);
            this._isRemoveExisting = value;
        }
    }

    static get observedAttributes(): string[] {
        return ['error-message', 'display-message-location', 'payment-type'];
    }

    constructor(){
        super();
        this._content = new DocumentFragment();
    }
    attributeChangedCallback(
        attrName: string,
        oldValue: string,
        newValue: string
    ): void {
        if (newValue !== oldValue) {
            switch (attrName) {
            case 'payment-type':
                this._paymentType = newValue;
                break;
            case 'display-message-location':
                this._displayMessageLocation = newValue;
                break;
            case 'error-message':
                this._errorMessage = newValue;
                this.render();
                break;
            default:
                break;
            }
        }
    }

    connectedCallback(): void {
        this.init();
    }

    init(): void {
        if (!this._content) {
            return;
        }
        if(this.isRemoveExisting == 'true'){
            this.clear();
        }        
        //const temp = this.getTemplate();
        if(this._errorMessage){
            const temp = document.createElement('div');
            temp.innerHTML = this.getTemplate();
            this._content.appendChild(temp);
            this.appendChild(this._content);
            //this.displayTemplate(temp);
        }        
    }
    clear(){
        const elExists = document.getElementsByTagName('jump-error-web-component');
        if(elExists && elExists[0] || !this._errorMessage){
            elExists[0].innerHTML = '';
        }
    }

    displayTemplate(temp: string): any {
        if (this._errorMessage && this._displayMessageLocation) {
            let parent: any;
            switch (this._paymentType.toLowerCase()) {
            case 'cardonly':
            case 'cardonlywithedit':
                parent = document.getElementById('jump-error-web-component-cc');
                if(parent){
                    parent.innerHTML = temp;
                }                
                break;
            case 'achonly':
            case 'achonlywithedit':
                parent = document.getElementById('jump-error-web-component-ach');
                parent.innerHTML = temp;
                break;
            case 'mincardonly':
            case 'mincardonlywithedit':
                parent = document.getElementById('jump-error-web-component-min-card');
                parent.innerHTML = temp;
                break;
            case 'cardorbank':
                parent = document.getElementById('jump-error-web-component-card-or-bank');
                parent.innerHTML = temp;
                break;
            case 'minachonly':
                parent = document.getElementById('jump-error-web-component-min-ach');
                parent.innerHTML = temp;
                break;
            default:
                break;
            } 
        }
    }

    render(): any {
        const temp = this.getTemplate();
        this.displayTemplate(temp);
    }

    getTemplate(): any {
        const temp = `          
<div class="alert alert-danger d-flex alert-dismissible fade show jump-error-style" role="alert">
  ${this._errorMessage}  
</div>
      `;
        //<button type="button" class="btn-close jump-error-btn" data-bs-dismiss="alert" aria-label="Close"></button>      
        return temp;
    }
}

customElements.define('jump-error-web-component', ErrorWebComponent);
