/**

* @jest-environment jsdom

*/
import { ChannelService } from '../../src/service/channel-service';
import { CommonService } from '../../src/service/common.service';
import { IConfig } from '../../src/model/view.model';
import { ErrorHandling } from '../../src/utils/error-handling';
import { Globals } from '../../src/utils/globals';
import { IViewModel } from '../../src/model/viewModel/view-model';
import { CardData } from '../test-data/card-only-service.data';
import crypto from 'crypto';
import { ConfigData } from '../test-data/config.data';
import { ViewModelData } from '../test-data/view-model.data';
import { AddToWalletResponseData } from '../test-data/add-to-wallet-response.data';
import { ErrorMappingResponseData } from '../test-data/error-mapping-response.data';
import { MinCardOnlyService } from '../../src/service/min-card-only.service';
import { MinCardEditService } from '../../src/service/min-card-edit.service';
import { MinCardOnlyViewModelService } from '../../src/service/viewModel/min-card-only-vm-service';
import { MinCardOnlyInitService } from '../../src/service/facade/min-card-only-init.service';
import { JUMP_ADD_TO_WALLET_SUCCESS } from '../../src/constant/app.constant';


Object.defineProperty(global.self, 'crypto', {
    value: {
        subtle: crypto.webcrypto.subtle,
    },
});


window.crypto.subtle.importKey = jest.fn();
window.crypto.subtle.encrypt = jest.fn();

function createMockResponse(
    body: any,
    status: number,
    statusText: string
): Response {
    return {
        ok: status >= 200 && status < 300,
        status,
        statusText,
        headers: {
            get: (headerName: string) => {
                if (headerName === 'content-type') {
                    return 'application/json';
                }
                return null;
            },
        },
        json: async () => body,
        text: async () => body,
    } as unknown as Response;
}

describe('Min Card Only Service.', () => {
    const configData:ConfigData = new ConfigData('mincardonly');
    const viewModelData:ViewModelData = new ViewModelData('mincardonly');
    const responseData:AddToWalletResponseData = new AddToWalletResponseData('mincardonly');
    const errorResponseData:ErrorMappingResponseData = new ErrorMappingResponseData('mincardonly');

    let cardOnlyService:MinCardOnlyService = Object.assign({});
    let cardOnlyEditService:MinCardEditService = Object.assign({});
    const cardonlyEditVM:MinCardOnlyViewModelService = Object.assign({});
    const vm = Object.assign({});
    let config:IConfig = Object.assign({});
    const globalInstance = Globals.getInstance();
    globalInstance.appState.set('channelData',viewModelData.getViewModel());
    const channelService:ChannelService = new ChannelService(viewModelData.getChannelData());
    const errorMessageResponse:any = errorResponseData.getErrorMessageResponse();
    const commonService:CommonService = new CommonService(globalInstance.actionObserverService,channelService,config);
    const errorHandling:ErrorHandling = new ErrorHandling(channelService);
    let mincardOnlyInitService:MinCardOnlyInitService = Object.assign({});
    const dummyresponse:any = {
        'publicKey': 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs9j6Xuwumokfd+1OhPQKYaw9v2g9lIOpgPzp11PxBCPhAfBQBdbWmznNfZkBxRxlcYybIxvy+cMG8t304ybt3RYSMHRivjNRsfCQRzs7FkOeX9DNQZBY+CSfKnnNDfWzcvX0Ae9DJSm6eB3zdm/dpbrtfqmWdB1MTiBcArDIoLc2xUp6DlDh8hnWd52eKzb/ZgJiStLNiZjzMh531ROFaR3dTJMeL7ldVs/dA/XoWYhYLufTCzReKFenEhWwC4LrCKSl+3yu29TapHb+jeHkEp4cRjDTn9ARMwk01bzAfXkzXsRtjIonpuxTxP9zooN6EnxfsRfn51bIvjj/NPgyVwIDAQAB',
        'psErrorCode': null,
        'psErrorMessage': null,
        'cpcStatus': 'SUCCESS'
    };
    const dummyPaymentConfig:any  = {
        'paymentConfigurationDetails': {
            'cpcStatus': 'SUCCESS',
            'psErrorCode': null,
            'psErrorMessage': null,
            'trackingId': '3_getPaymentConfigurationDetails',
            'billingArrangementId': '8720101010393451',
            'paymentFrequency': 'onetime',
            'bankblockStatus': false,
            'cardblockStatus': false
        }
    };
    let cardData:CardData;
    let cardVm:IViewModel;
    global.fetch = jest.fn(() => Promise.resolve(createMockResponse(dummyresponse , 200 , 'OK')));

    beforeEach(() => {
        try{
            config = configData.getConfig();
            cardOnlyEditService = new MinCardEditService(config,channelService,'mincardnolywithedit',cardonlyEditVM,errorMessageResponse,commonService,errorHandling);
            cardOnlyService = new MinCardOnlyService(config,channelService,'mincardonly',cardOnlyEditService,cardonlyEditVM,errorMessageResponse,commonService,errorHandling);
            cardOnlyService.config =  configData.getConfig();
            mincardOnlyInitService = new MinCardOnlyInitService(config,channelService.channelData);
            mincardOnlyInitService.config = config;
            commonService.channelService =  channelService;
            commonService.config = configData.getConfig();
            cardOnlyService.viewModel = viewModelData.getViewModel();
            cardData = new CardData();
            cardVm = cardData.getCardInfo();
            jest.doMock('../../src/constant/app.constant', () => ({
                JUMP_ADD_TO_WALLET_SUCCESS: 'jump-add-to-wallet-success'
            }));
            jest.resetModules();   
        }catch(e){
            console.log('Card Only Service beforeEach ', e);
        }        
    });

    it('getPublicKey method mock api call', async () => {    
        jest.spyOn(commonService, 'getPublicKey'); 
        const publicaKey:any = await  commonService.getPublicKey();
        expect(publicaKey.cpcStatus).toEqual('SUCCESS');
        expect(publicaKey.publicKey).not.toBe('');     
        expect(commonService.getPublicKey).toHaveBeenCalledTimes(1); 
    });
    
    it('getPaymentConfiguration method mock api call', async () => {   
        jest.spyOn(commonService, 'getPaymentConfiguration'); 
        global.fetch = jest.fn().mockImplementation(() => {
            return new Promise((resolve): void => {
                resolve(createMockResponse(dummyPaymentConfig , 200 , 'OK'));
            });
        });
        const apiReponse:any = await  commonService.getPaymentConfiguration(viewModelData.getViewModel(),config);
        expect(apiReponse.paymentConfigurationDetails.cpcStatus).toEqual('SUCCESS');
        expect(apiReponse.paymentConfigurationDetails.cardblockStatus).toBe(false);
        expect(apiReponse.paymentConfigurationDetails.bankblockStatus).toBe(false);   
        expect(commonService.getPaymentConfiguration).toHaveBeenCalledTimes(1);     
    });
        
    it('addToWallet method mock api call', async () => {    
        jest.spyOn(cardOnlyService, 'addToWallet');
        const addToWalletResponse = responseData.getAddToWalletResponse();
        global.fetch = jest.fn().mockImplementation(() => {
            return new Promise((resolve): void => {
                resolve(createMockResponse(addToWalletResponse , 200 , 'OK'));
            });
        });
        await cardOnlyService.addToWallet(vm, 'mincardonly');

        expect(cardOnlyService.addToWallet).toHaveBeenCalledTimes(1);
        expect(addToWalletResponse.submissionDetails.cpcStatus).toEqual('SUCCESS');
        expect(addToWalletResponse.cardDetails.token).not.toBe('');
        expect(addToWalletResponse.cardDetails.cardLast4Digits).toEqual('4448');
    });
 
});
