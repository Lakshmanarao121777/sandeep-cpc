import './assets/css/bootstrap.min.css';
import './assets/css/jump-light.css';
import { ErrorHandling } from './utils/error-handling';
import { ALLOWED_CHANNEL_DOMAIN_LIST, ALLOWED_CHANNEL_QUANTUM_METRIC, CURRENT_CHANNEL_DOMAIN, CPC_DEFAULT_ERROR_MESSAGE, ERR_INVALID_CHANNEL_DATA, ERR_INVALID_CONFIG, ERR_INVALID_TEMPLATE, EVN_CPC_ERROR, ENV_EXPIRY_DATE_VALIDATION } from './constant/app.constant';
export * from './component/card-only-web.component';
export * from './component/card-list-web.component';
export * from './component/ach-only-web.component';
export * from './component/address-web.component';
export * from './component/min-card-only-web.component';
export * from './component/account-type-web.component';
export * from './component/error-web.component';
export * from './component/min-ach-only-web.component';
export * from './component/address-option-web.component';
export * from './component/auto-pay-web.component';
export * from './component/terms-and-condition-web.component';
export * from './component/care-web.component';
export * from './component/default-payment-web.component';
export * from './component/common-web.component';

export * from './component/userrole-list-web.component';
export * from './component/userrole-web.component';

import {
    EVN_CPC_CONFIG_SUBMIT,
    EVN_CPC_FORM_SUBMIT,
    EVN_CPC_PAGE_RESIZE,
    EVN_CPC_READY,
} from './constant/app.constant';
import { ENV_VARIABLES, IConfig, MessageType, PaymentType } from './model/view.model';
import { IChannelData } from './model/channel-data';
import { Globals } from './utils/globals';
import { CardOnlyInitService } from './service/facade/card-only-init.service';
import { AchOnlyInitService } from './service/facade/ach-only-init.service';
import { CardOrBankInitService } from './service/facade/card-or-bank-init.service';
import { MinCardOnlyInitService } from './service/facade/min-card-only-init.service';
import { MinAchOnlyInitService } from './service/facade/min-ach-only-init.service';
import { CardListInitService } from './service/facade/card-list-init.service';
import { ConfigValidation } from './utils/config-validation';

let isComponentLoaded = false;
let timeoutId: NodeJS.Timeout;
const isInputValid:any = Object.assign({
    isValidConfg :true,
    isValidTemplates :true,
    isValidChannelData :true
});
bind();

const configValidation = new ConfigValidation();

function init(config: IConfig, channelData: IChannelData) {
    console.log('init channelData: ', channelData);
    if (!isComponentLoaded) {
        //const baseInitService:BaseInitService = new BaseInitService(config,channelData);
        //baseInitService.run();
        switch(config.cpcPageType.toString().toLowerCase()){
        case PaymentType[PaymentType.CardOnly].toLowerCase():
        case PaymentType[PaymentType.CardOnlyWithEdit].toLowerCase():
            const cardOnlyInitService:CardOnlyInitService = new CardOnlyInitService(config,channelData);
            cardOnlyInitService.run();
            break;
        case PaymentType[PaymentType.AchOnly].toLowerCase():
        case PaymentType[PaymentType.AchOnlyWithEdit].toLowerCase():
            const achOnlyInitService:AchOnlyInitService = new AchOnlyInitService(config,channelData);
            achOnlyInitService.run();
            break;
        case PaymentType[PaymentType.CardOrBank].toLowerCase(): 
        case PaymentType[PaymentType.BankOrCard].toLowerCase():
            const cardOrBankInitService:CardOrBankInitService = new CardOrBankInitService(config,channelData);
            cardOrBankInitService.run();
            break;
        case PaymentType[PaymentType.MinCardOnly].toLowerCase():
        case PaymentType[PaymentType.MinCardOnlyWithEdit].toLowerCase():
            const minCardOnlyInitService:MinCardOnlyInitService = new MinCardOnlyInitService(config,channelData);
            minCardOnlyInitService.run();
            break;
        case PaymentType[PaymentType.MinAchOnly].toLowerCase():
            const minAchOnlyInitService:MinAchOnlyInitService = new MinAchOnlyInitService(config,channelData);
            minAchOnlyInitService.run();
            break;
        case PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase():
        case PaymentType[PaymentType.CardExpirationEdit].toLowerCase():
        case PaymentType[PaymentType.CardOrExisting].toLowerCase():
        case PaymentType[PaymentType.CardBankOrExisting].toLowerCase():
        case PaymentType[PaymentType.BankCardOrExisting].toLowerCase():
            const cardListInitService:CardListInitService = new CardListInitService(config,channelData);
            cardListInitService.run();
            break;
        }        
        console.log('PERFORMANCE STATS - hosted-method-of-payment - end: ', performance.now());        
        isComponentLoaded = true;
    }
}
function bind() {
    console.log('Hosted App binding - addEventListner for message and DOMContentLoaded');
    window.addEventListener('message', (message) => {
        console.log('hosted-app event listener...', message);
        const isDomainAllowed = isChannelDomainAllowed(message.origin);
        if (
            isDomainAllowed && message && message.data &&
            typeof message.data === 'string' && message.data.indexOf('"action":') >= 0) {
            const data = JSON.parse(message.data);
            if (data) {
                switch (data.action) {
                case EVN_CPC_FORM_SUBMIT:
                    console.log('Received EVN_CPC_FORM_SUBMIT data by hosted app:', JSON.stringify(data.channelData));
                    const ce = new CustomEvent('jump-payment-clicked', {
                        detail: { data: data },
                    });
                    document.dispatchEvent(ce);
                    break;
                case EVN_CPC_CONFIG_SUBMIT:
                    console.log('Received EVN_CPC_CONFIG_SUBMIT by hosted app:', JSON.stringify(data.channelData));
                    const channelName = data?.channelData?.channelDetails?.channelName;
                    console.log('ChannelName: ', channelName);
                    const enableDarkMode = data?.channelData?.config?.enableDarkMode;
                    if(enableDarkMode === true) {
                        document.getElementById('jump-main-container')?.setAttribute('data-bs-theme','dark');
                        document.getElementById('jump-main-container')?.classList?.add('modal-dark');
                    }
                    const config = data?.config;
                    const quantumUrl = config.envConfig.quantumUrl;
                    console.log('quantumUrl: ', quantumUrl);
                    appendQuantumMetrics(channelName, quantumUrl);
                    const isChannelPageTypeValid = configValidation.isChannelPageTypeValid(config.channelTemplateMapping, channelName, config.cpcPageType);
                    console.log('isChannelPageTypeValid:',isChannelPageTypeValid);
                 
                    if (isValidConfig(config) && isValidTemplate(config.cpcPageType) && isValidChannelData(data.channelData) && isChannelPageTypeValid) {
                        config.cpcPageType = config.cpcPageType.toString().toLowerCase();
                        try {
                            init(config, data.channelData);
                        } catch (error) {
                            const errorHandling = new ErrorHandling();
                            const err = 'Error while loading the application';
                            const cpcMessage = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.backend, MessageType.error, error);
                            errorHandling.showError(cpcMessage, err);  
                        }
                    } else {
                        const errorHandling = new ErrorHandling();
                        const cpcMessage = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.config, MessageType.error, CPC_DEFAULT_ERROR_MESSAGE);
                        const messageDetail = getDetailMessage();
                        // const messageDetail = 'Missing configuration, please provide valid configuration for the hosted-app!';
                        errorHandling.showError(cpcMessage, messageDetail);
                        console.log(
                            'Missing configuration, please provide valid configuration for the hosted-app!'
                        );
                        return;
                    }
                    break;
                case ENV_EXPIRY_DATE_VALIDATION:
                    console.log(data);
                    break;
                default:
                    break;
                }
            }
        }
    });
    document.addEventListener('DOMContentLoaded', () => {
        console.log('hosted-method-of-payment DOMContentLoaded event listner - start');
        if (document.getElementsByTagName('payment-hosted-app')[0] === undefined) {
            console.log('PERFORMANCE STATS - hosted-method-of-payment - start: ', performance.now());            
            const containerRef = document.getElementById('jump-hosted-container');
            const message = {
                action: EVN_CPC_READY,
                hostedAppLoaded: containerRef ? 'true' : null,
            };

            console.log('EVN_CPC_READY window.location:', window.location);
            console.log('EVN_CPC_READY document.referrer:', document.referrer);
            if(isChannelDomainAllowed(document.referrer)){
                CURRENT_CHANNEL_DOMAIN.URI = document.referrer;
            }            
            pageHeightObserver();
            parent.postMessage(JSON.stringify(message), CURRENT_CHANNEL_DOMAIN.URI);
        }
    });
}

function appendQuantumMetrics(channelName:string, quantumUrl:string) {
    if(isQuantumChannelNameAllowed(channelName)) {
        if (document.getElementsByTagName('payment-hosted-app')[0] === undefined) {
            const script = document.createElement('script');
            script.setAttribute('src', quantumUrl);
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('async', 'true');
            const head = document.getElementById('jump-web-component-head');
            const metricApi:any = !(window as any).QuantumMetricAPI;
            if (head && metricApi) {
                head.appendChild(script);
            }
        }
    }
}

function isValidTemplate(cpcPageType:string):boolean {
    const isValid = configValidation.isValidTemplate(cpcPageType);
    isInputValid.isValidTemplate = isValid;
    return isValid;    
}

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(fn: Function, ms = 200) {
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
}

function isValidChannelData(data:IChannelData) {
    let flag = true;
    if(!data) {
        flag = false;
    }
    isInputValid.isValidChannelData = flag;
    return flag;
}

function isValidConfig(configData:IConfig):boolean {
    const isValid = configValidation.isValidConfig(configData);
    isInputValid.isValidConfg = isValid;
    return isValid;
}

function getDetailMessage():string {
    const message = Object.assign({});
    if(!isInputValid.isValidChannelData) { 
        message.error =  ERR_INVALID_CHANNEL_DATA;
    }
    else if(!isInputValid.isValidConfg) { 
        message.error = ERR_INVALID_CONFIG;
    }
    else if(!isInputValid.isValidTemplate) { 
        message.error= ERR_INVALID_TEMPLATE;
    }
    return message.error;
}

function onPageResize(height: string) {
    console.log('EVN_CPC_PAGE_RESIZE');
    const message = {
        action: EVN_CPC_PAGE_RESIZE,
        pageHeight: height,
    };
    parent.postMessage(JSON.stringify(message), CURRENT_CHANNEL_DOMAIN.URI);
}
function isChannelDomainAllowed(uri: string): boolean{
    const allowedList:Array<string> = ALLOWED_CHANNEL_DOMAIN_LIST;
    let flag = false;
    if(uri) {
        for(let i=0; i<allowedList.length; i++) {
            if(uri.indexOf(allowedList[i])>=0) {
                flag = true;
                break;
            }
        }
    }
    return flag;
}
function isQuantumChannelNameAllowed(uri:string): boolean {
    console.log('Hosted App - isChannelDomainAllowded: ' + uri);
    const allowedList:Array<string> = ALLOWED_CHANNEL_QUANTUM_METRIC;
    let flag = false;
    if(uri && allowedList) {
        for(let i=0; i<allowedList.length; i++) {
            if(uri.indexOf(allowedList[i])>=0) {
                flag = true;
                break;
            }
        }
    }
    return flag; 
}
function pageHeightObserver() {
    const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
            const cr = entry.contentRect;
            //console.log('Element entry:', entries.length);
            //console.log('Element:', entry.target);
            //console.log(`Element size: ${cr.width}px x ${cr.height}px`);
            //console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
            const debouncedPageResize = debounce(onPageResize, 100);
            console.log('cr.height: ', cr.height);
            debouncedPageResize((cr.height + 40) + 'px');
            break;
        }
    });
    const container = document.getElementById('jump-hosted-container');
    if (container) {
        ro.observe(container);
    }
}
