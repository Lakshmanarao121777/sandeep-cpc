import { IConfig, IInputReference } from '../model/view.model';
import { ErrorHandling } from '../utils/error-handling';
import { CommonService } from './common.service';
import { FormValidationService } from './form-validation-service';
import { Validation } from '../utils/validation';
import { DataLayerService } from './data-layer.service';
import { BaseAccountTypeService } from './base-account-type-service';
import { ChannelService } from './channel-service';
import { CardListViewModelService } from './viewModel/card-list-vm.service';
import {IViewModel} from '../model/viewModel/view-model';
export class WalletMgmtNoAutopayService extends BaseAccountTypeService {
    public cardListViewModelService:CardListViewModelService = Object.assign({});  
    public inputReference: IInputReference = Object.assign({});
    public viewModel: IViewModel = Object.assign({});
    public config: IConfig = Object.assign({});
    public validations = new Validation();
    public commonService = new CommonService(Object.assign({})); 
    public formFieldStatusMap:Map<string, boolean>;
    public formValidationService: FormValidationService;
    public existingFormData:Map<string, string>;
    public dataLayerService:DataLayerService;
    public errorHandling:ErrorHandling=new ErrorHandling();
    constructor(config:IConfig, channel:ChannelService,type:string,cardListViewModelService:CardListViewModelService,errorMessageResponse:any,commonService:CommonService,errorHandling:ErrorHandling) {
        super(config,channel,type,errorMessageResponse,errorHandling);
        //this.global = Globals.getInstance();
        this.cardListViewModelService = cardListViewModelService;
        this.commonService = commonService;
        this.formValidationService = new FormValidationService();
        this.formFieldStatusMap = new Map<string,boolean>();
        this.existingFormData = new Map<string,string>();
        this.dataLayerService = new DataLayerService();
        this.config = config;
        console.log('Wallet MGMT Constructor ');
    } 
}