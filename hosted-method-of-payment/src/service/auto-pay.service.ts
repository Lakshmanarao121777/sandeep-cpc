import {
    JUMP_UPDATE_VIEW_MODEL,
} from '../constant/app.constant';
import {
    IConfig,
    IInputReference
} from '../model/view.model';
import { IViewModel } from '../model/viewModel/view-model';
import { Globals } from '../utils/globals';
import { CommonService } from './common.service';
import { BaseAccountTypeService } from './base-account-type-service';
import { ChannelService } from './channel-service';
import { ErrorHandling } from '../utils/error-handling';
import { Validation } from '../utils/validation';
export class AutoPayService extends BaseAccountTypeService {
    public inputReference:IInputReference = Object.assign({});
    public viewModel:IViewModel = Object.assign({});
    public config: IConfig = Object.assign({});
    public validations = new Validation();
    public formFieldStatusMap = new Map<string,boolean>();
    public commonService:CommonService = Object.assign({});  
    public existingFormData: Map<string, string>;
    private autoPayFor:string;
    constructor(config:IConfig, channel:ChannelService,type:string,autoPayFor:string,errorMessageResponse:any,errorHandling:ErrorHandling) {
        super(config,channel,type,errorMessageResponse,errorHandling);
        this.config = config;
        this.autoPayFor = autoPayFor;
        this.global = Globals.getInstance();
        this.existingFormData = new Map<string, string>();
        this.subscribe();
        console.log('Auto Pay Service constructor');
    }

    subscribeChild(detail:any){
        switch(detail?.action){
        case JUMP_UPDATE_VIEW_MODEL:
            if(detail.data.isAutoPay){
                this.viewModel.isAutoPay = detail.data.isAutoPay;
            }
            break;          
        }
    }
    private resolve(data:IViewModel){
        this.submit(data);
    } 
    submit(viewModel:IViewModel){
        this.viewModel = viewModel;
    } 
    removeErrorFeedback = (reference: string) => {
        const parentId =
            this.inputReference[reference as keyof IInputReference].parentElement;
        const errFeedback =
            this.inputReference[reference as keyof IInputReference].name;
        if (parentId) {
            const selector = `[name='${errFeedback}-feedback']`;
            if (selector && parentId.querySelector(selector)) {
                parentId.querySelector(selector).remove();
            }
        }
    };
    appendErrorFeedback = (reference: string, feedbackMsg: string): any => {
        const nameField =
            this.inputReference[reference as keyof IInputReference].name;
        const div = document.createElement('div');
        div.setAttribute('name', nameField + '-feedback');
        div.classList.add('invalid-feedback');
        div.innerHTML = feedbackMsg;
        return div;
    };
}
