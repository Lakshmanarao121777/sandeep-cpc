class PaymentHostedAppComponent extends HTMLElement {
    _templateUrl = '';
    static get observedAttributes() {
        console.log('observed attribute!');
        return ['template-url'];
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        console.log('newValue ', newValue);
        if(newValue !== oldValue) {
            switch (attrName) {
                case 'template-url':
                    this._templateUrl = newValue;
                    break;
                default:
                    break;
            }
            
        }
    }
   
    get templateUrl(){
        return this._templateUrl;
    } 
    set templateUrl(value) {
        if(value) {
            this._templateUrl = value;
        }
    }

  
    constructor(){
        super();   
        //this.eventHandler = this.eventHandler.bind(this);     
        console.log('constructor called...');
        // document.addEventListener('web-component-loaded', (e)=>{
        //     console.log('web-component-loaded...');
        //     let ce = new CustomEvent('jump-set-hosted-app-config', {detail: {templateUrl : this._templateUrl }});
        //     document.dispatchEvent(ce);
        // });
        
    }
    connectedCallback() {       
        const shadowRoot = this.attachShadow({mode: 'open'});        
        console.log('connectedCallback...');
        
        this.hostedAppBinding();

        const iframe = document.createElement('iframe');
        iframe.id = "jump-hosted-app-iframe";
        //iframe.src = "http://localhost:8081/index.html";
        iframe.height = "400";
        iframe.width = "400";
        
        //const iframe = document.createElement('div');
        //iframe.innerHTML = "<h1>hello world!</h1>";
                
        shadowRoot.appendChild(iframe);        

        this.render();        
    }
    render() {                
                        
    }
    
    dispatchCustomAction(name, data){        
        let anEvent = new CustomEvent(name, {detail: data});
        document.dispatchEvent(anEvent);
    }  
    hostedAppBinding() {
        document.addEventListener('jump-hosted-app-loaded', (data) =>{                
            if(data && data.detail && data.detail.hostedAppLoaded) {
                console.log('jump-hosted-app-loaded called...', data.detail);
                let ce = new CustomEvent('jump-set-hosted-app-config', {detail: {'templateUrl' :this._templateUrl}});
                console.log('document.children ', document.querySelector("payment-hosted-app").shadowRoot.getElementById("jump-hosted-app-iframe"));
                data.detail.hostedAppLoaded.dispatchEvent(ce);
            } 
        });
    }    
}
customElements.define('payment-hosted-app', PaymentHostedAppComponent);

// window.addEventListener('DOMContentLoaded', (e) =>{
//      console.log('web component - DOMContentLoaded') ; 
//     if(document.getElementsByTagName("payment-hosted-app")[0] === undefined) {
//         console.log('DOMContentLoaded web component loaded...');    
//         let ce = new CustomEvent('jump-hosted-app-loaded', {detail: {'webComponentLoaded' :true}});
//         document.dispatchEvent(ce);
//     }
//     // let wcl = new CustomEvent('web-component-loaded', {detail: {'webComponentLoaded' :true}});
//     // document.dispatchEvent(wcl);
    
// });

