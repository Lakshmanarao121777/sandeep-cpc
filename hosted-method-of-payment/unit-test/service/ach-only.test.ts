/**

* @jest-environment jsdom

*/
import { ChannelService } from '../../src/service/channel-service';
import { CommonService } from '../../src/service/common.service';
import { IConfig } from '../../src/model/view.model';
import { ErrorHandling } from '../../src/utils/error-handling';
import { CareService } from '../../src/service/care.service';
import { Globals } from '../../src/utils/globals';
import { IViewModel } from '../../src/model/viewModel/view-model';
import { CardData } from '../test-data/card-only-service.data';
import crypto from 'crypto';
import { ConfigData } from '../test-data/config.data';
import { ViewModelData } from '../test-data/view-model.data';
import { AddToWalletResponseData } from '../test-data/add-to-wallet-response.data';
import { ErrorMappingResponseData } from '../test-data/error-mapping-response.data';
import { JUMP_ADD_TO_WALLET_SUCCESS } from '../../src/constant/app.constant';
import { CardOnlyService } from '../../src/service/card-only.service';
import { CardOnlyEditService } from '../../src/service/card-only-edit.service';
import { CardOnlyViewModelService } from '../../src/service/viewModel/card-only-vm-service';
import { CardOnlyInitService } from '../../src/service/facade/card-only-init.service';
import { AchOnlyService } from '../../src/service/ach-only.service';
import { AchOnlyEditService } from '../../src/service/ach-only-edit.service';
import { AchOnlyViewModelService } from '../../src/service/viewModel/ach-only-vm-service';
import { AchOnlyInitService } from '../../src/service/facade/ach-only-init.service';

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

describe('Ach Only Service.', () => {
    const configData:ConfigData = new ConfigData('achonly');
    const viewModelData:ViewModelData = new ViewModelData('achonly');
    const responseData:AddToWalletResponseData = new AddToWalletResponseData('achonly');
    const errorResponseData:ErrorMappingResponseData = new ErrorMappingResponseData('achonly');

    let achOnlyService:AchOnlyService = Object.assign({});
    let achOnlyEditService:AchOnlyEditService = Object.assign({});
    const achOnlyViewModelService:AchOnlyViewModelService = Object.assign({});

    const careService:CareService = Object.assign({});
    const vm = Object.assign({});
    let config:IConfig = Object.assign({});
    const globalInstance = Globals.getInstance();
    globalInstance.appState.set('channelData',viewModelData.getViewModel());
    const channelService:ChannelService = new ChannelService(viewModelData.getChannelData());
    const errorMessageResponse:any = errorResponseData.getErrorMessageResponse();
    const commonService:CommonService = new CommonService(globalInstance.actionObserverService,channelService,config);
    const errorHandling:ErrorHandling = new ErrorHandling(channelService);
    let achOnlyInitService:AchOnlyInitService = Object.assign({});
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
            achOnlyEditService = new AchOnlyEditService(config,channelService,'achonlywithedit',errorMessageResponse,commonService,errorHandling);
            achOnlyService = new AchOnlyService(config,channelService,'achonly',achOnlyEditService,achOnlyViewModelService,errorMessageResponse,commonService,errorHandling,careService);
            achOnlyService.config =  configData.getConfig();
            achOnlyInitService = new CardOnlyInitService(config,channelService.channelData);
            achOnlyInitService.config = config;
            commonService.channelService =  channelService;
            commonService.config = configData.getConfig();
            achOnlyService.viewModel = viewModelData.getViewModel();
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
        jest.spyOn(achOnlyService, 'addToWallet');
        const addToWalletResponse = responseData.getAddToWalletResponse();
        global.fetch = jest.fn().mockImplementation(() => {
            return new Promise((resolve): void => {
                resolve(createMockResponse(addToWalletResponse , 200 , 'OK'));
            });
        });
        await achOnlyService.addToWallet(vm, 'achonly');

        expect(achOnlyService.addToWallet).toHaveBeenCalledTimes(1);
        expect(addToWalletResponse.submissionDetails.cpcStatus).toEqual('SUCCESS');
        expect(addToWalletResponse.cardDetails.token).not.toBe('');
        expect(addToWalletResponse.cardDetails.cardLast4Digits).toEqual('4448');
    });
 
});
