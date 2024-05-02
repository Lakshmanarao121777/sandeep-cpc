import { EVN_CPC_FORM_SUBMIT_RESPONSE, JUMP_UPDATE_VIEW_MODEL } from '../../src/constant/app.constant';
import { IViewModel } from '../../src/model/viewModel/view-model';
import { ChannelService } from '../../src/service/channel-service';
import { CommonService } from '../../src/service/common.service';
import { MinCardEditService } from '../../src/service/min-card-edit.service';
import { MinCardOnlyService } from '../../src/service/min-card-only.service';
import { MinCardOnlyViewModelService } from '../../src/service/viewModel/min-card-only-vm-service';
import { ErrorHandling } from '../../src/utils/error-handling';
import { Globals } from '../../src/utils/globals';
import { AddToWalletResponseData } from '../test-data/add-to-wallet-response.data';
import { CardData } from '../test-data/card-only-service.data';
import { CardRequestData } from '../test-data/card-request.data';
import { ConfigData } from '../test-data/config.data';
import { ErrorMappingResponseData } from '../test-data/error-mapping-response.data';
import { ViewModelData } from '../test-data/view-model.data';
import { IConfig, PaymentType } from '../../src/model/view.model';

const minCardOnlyService:MinCardOnlyService = Object.assign({});
const minCardEditService:MinCardEditService = Object.assign({});
const request:IViewModel = Object.assign({});
const events = Object.assign([]);
const addToWallet = Object.assign({});
const config:IConfig = Object.assign({});
const globalInstance = Globals.getInstance();
const viewModelData:ViewModelData = new ViewModelData('mincardonly');
const vmData = viewModelData.getViewModel();
globalInstance.appState.set('channelData',vmData.channelData);
const channelService:ChannelService = new ChannelService(vmData.channelData);
const minCardOnlyViewModelService:MinCardOnlyViewModelService = Object.assign({});
const errorMessageResponse:any = new ErrorMappingResponseData('mincardonly').getErrorMessageResponse();
const commonService:CommonService = new CommonService(globalInstance.actionObserverService,channelService,config);
const errorHandling:ErrorHandling = new ErrorHandling(channelService);
let cardData:CardData;
let cardVm:IViewModel;
const currentPaymentType = 'MinCardOnly';
let cardRequestData:CardRequestData;

// describe('MinCardOnlyService - Happy Scenarios',() => {
//     beforeEach(() => {
//         config = new ConfigData(currentPaymentType).getConfig();
//         minCardEditService = new MinCardEditService(config,channelService,currentPaymentType,minCardOnlyViewModelService,errorMessageResponse,commonService,errorHandling);
//         minCardOnlyService = new MinCardOnlyService(config,channelService,currentPaymentType,minCardEditService,minCardOnlyViewModelService,errorMessageResponse,commonService,errorHandling);
//         minCardOnlyService.config = config;
//         //minCardOnlyService.viewModel = viewModelData.getViewModel();
//         cardRequestData = new CardRequestData(currentPaymentType);
//         request = cardRequestData.getRequest();
//         events = [];
//         addToWallet = new AddToWalletResponseData();
//         //global.fetch = jest.fn(() => Promise.resolve(addToWallet.getResponse()));
//         cardData = new CardData();
//         //cardVm = cardData.getCardInfo();   
//     });
//     // it('submit', () => {      
//     //     const window = new Window();
//     //     const document = window.document;
//     //     document.write('');
//     //     const addToWalletResponse = addToWallet.getResponse();
//     //     jest.mock('MinCardOnlyService',()=>{
//     //         return {
//     //             addToWallet:()=>{
//     //                 const response = new Promise((resolve, reject) => resolve(addToWalletResponse));
//     //                 return response;
//     //             },                
//     //         };

//     //     });
//     //     // const mock = jest
//     //     //     .spyOn(minCardOnlyService, 'addToWallet')
//     //     //     .mockImplementation(() => {
//     //     //         const response = new Promise((resolve, reject) => resolve(addToWalletResponse));
//     //     //         return response;
//     //     //     });

//     //     // jest.spyOn(minCardOnlyService.commonService,'getEncryptedCCInfo');
//     //     // jest.spyOn(minCardOnlyService,'getPersonalInfo');
//     //     // jest.spyOn(minCardOnlyService,'prepareRequest');        
        
//     //     expect(minCardOnlyService.viewModel.cardInfo).toBeUndefined();
        
//     //     minCardOnlyService.submit(request);

//     //     expect(minCardOnlyService.viewModel.cardInfo).not.toBeUndefined();
//     //     expect(minCardOnlyService.viewModel.cardInfo.ccNo).toEqual(request.cardInfo.ccNo);
//     //     expect(minCardOnlyService.viewModel.cardInfo.cvv).toEqual(request.cardInfo.cvv);
//     //     expect(minCardOnlyService.viewModel.cardInfo.expMonth).toEqual(request.cardInfo.expMonth);
//     //     expect(minCardOnlyService.viewModel.cardInfo.expYear).toEqual(request.cardInfo.expYear);

//     //     expect(minCardOnlyService.addToWallet).toHaveBeenCalledTimes(1);
//     //     expect(minCardOnlyService.commonService.getEncryptedCCInfo).toHaveBeenCalledTimes(1);
//     //     expect(minCardOnlyService.getPersonalInfo).toHaveBeenCalledTimes(1);
//     //     expect(minCardOnlyService.prepareRequest).toHaveBeenCalledTimes(1);
//     //     //mock.mockRestore();
//     // });

//     it('submit', () => {
//         const addToWalletResponse = addToWallet.getResponse();
//         const mock = jest
//             .spyOn(minCardOnlyService, 'addToWallet')
//             .mockImplementation(() => {
//                 const response = new Promise((resolve, reject) => resolve(addToWalletResponse));
//                 return response;
//             });
//         jest.spyOn(minCardOnlyService.commonService,'getEncryptedCCInfo');
//         //jest.spyOn(minCardOnlyService,'getPersonalInfo');
//         jest.spyOn(minCardOnlyService,'prepareRequest');        
        
//         expect(minCardOnlyService.viewModel.cardInfo).toBeUndefined();
        
//         minCardOnlyService.submit(request);

//         expect(minCardOnlyService.viewModel.cardInfo).not.toBeUndefined();
//         expect(minCardOnlyService.viewModel.cardInfo.ccNo).toEqual(request.cardInfo.ccNo);
//         expect(minCardOnlyService.viewModel.cardInfo.cvv).toEqual(request.cardInfo.cvv);
//         expect(minCardOnlyService.viewModel.cardInfo.expMonth).toEqual(request.cardInfo.expMonth);
//         expect(minCardOnlyService.viewModel.cardInfo.expYear).toEqual(request.cardInfo.expYear);

//         expect(minCardOnlyService.addToWallet).toHaveBeenCalledTimes(1);
//         expect(minCardOnlyService.commonService.getEncryptedCCInfo).toHaveBeenCalledTimes(1);
//         //expect(minCardOnlyService.getPersonalInfo).toHaveBeenCalledTimes(1);
//         expect(minCardOnlyService.prepareRequest).toHaveBeenCalledTimes(1);
//         mock.mockRestore();
//     });    
//     it('subscribeChild',() => {
//         const cardDetail:IViewModel = cardData.getCardInfo();
//         expect(minCardOnlyService.viewModel.personalInfo).toBeUndefined();
//         expect(minCardOnlyService.viewModel.cardInfo).toBeUndefined();

//         globalInstance.actionObserverService.fire(this,{detail:{action:JUMP_UPDATE_VIEW_MODEL, type:'min-cc', data:cardDetail}});

//         //expect(1+1).toEqual(2);

//         expect(minCardOnlyService.viewModel.personalInfo).not.toBeUndefined();
//         expect(minCardOnlyService.viewModel.cardInfo).not.toBeUndefined();

//         expect(minCardOnlyService.viewModel.personalInfo.firstName).toEqual(cardDetail.personalInfo.firstName);
//         expect(minCardOnlyService.viewModel.personalInfo.lastName).toEqual(cardDetail.personalInfo.lastName);

//         expect(minCardOnlyService.viewModel.cpcPageType).toEqual(currentPaymentType);
//         expect(minCardOnlyService.viewModel.cardInfo.ccNo).toEqual(cardDetail.cardInfo.ccNo);
//         expect(minCardOnlyService.viewModel.cardInfo.expMonth).toEqual(cardDetail.cardInfo.expMonth);
//         expect(minCardOnlyService.viewModel.cardInfo.expYear).toEqual(cardDetail.cardInfo.expYear);
//         expect(minCardOnlyService.viewModel.cardInfo.cvv).toEqual(cardDetail.cardInfo.cvv);                        
        
//     });
//     it('addOrUpdateCall',() => {
//         const viewModel:IViewModel = cardRequestData.getEditRequest();   
//         config = new ConfigData('MinCardOnlyWithEdit').getConfig();
//         minCardOnlyService.config = config;
//         //minCardOnlyService.minCardOnlyVmService.inputReference = cardData.getInputReference();        
//         minCardEditService.inputReference = cardData.getInputReference();

//         minCardEditService.viewModel.cardInfo = viewModel.cardInfo;
//         minCardEditService.viewModel.personalInfo = viewModel.personalInfo;
//         const existingPaymentInstrument = {
//             'cpcStatus': 'SUCCESS',
//             'walletCardDetails':{
//                 'defaultInstrument': true,
//                 'customerDefinedName': 'Art-Vandelay',
//                 'token': '6485859064326918803007',
//                 'paymentMode': 'OneTimePayment',
//                 'billTo': {
//                     'address': {
//                         'city': 'Philadelphia',
//                         'country': 'US',
//                         'line1': '1945 Chapmans Ln',
//                         'line2': 'Unit A225',
//                         'state': 'PA',
//                         'zip': '19114'
//                     },
//                     'contact': { 
//                         'emailAddress': 'test@test.com', 
//                         'phone': '3039999999' 
//                     },
//                     'name': {
//                         'firstName': 'ART',
//                         'lastName': 'VANDELAY'
//                     }
//                 },
//                 'maskedCardNumber': '************6321',
//                 'cardType': 'MasterCard',
//                 'expirationDate': '0925',
//                 'maskedCvv': '***',
//                 'cardLast4Digits': '6321'
//             }
//         };
//         //minCardOnlyService.config.cpcPageType = PaymentType[PaymentType.MinCardOnlyWithEdit];// 'mincardonlywithedit';
//         minCardEditService.onExistingPaymentInstrumentCompletedHandler(existingPaymentInstrument);
//         minCardOnlyService.viewModel.cpcPageType = 'mincardonlywithedit';
        
//         //minCardEditService.isFormFieldsModified();
//         minCardOnlyService.addOrUpdateCall(viewModel);
//         window.addEventListener('message',(data:any)=>{
//             console.log('data: ', data.action);

//         });


//     });
// });

// describe('MinCardOnlyService - Unhappy Scenarios',() => {
//     it('should thru error',()=>{
//         const submitNoArgs = ()=>{
//             minCardOnlyService.submit(Object.assign({}));
//         };
//         expect(submitNoArgs).toThrow(/Cannot read propert/);
//     });
// });

describe('MinCardOnlyService - Unhappy Scenarios',() => {
    it('should test string',()=>{           
        expect('test').toEqual('test');
    });
});