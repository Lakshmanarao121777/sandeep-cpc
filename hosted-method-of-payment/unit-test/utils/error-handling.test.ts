import { EVN_CPC_ERROR } from "./../../src/constant/app.constant";
import { ErrorType, IChannelData, MessageType, PaymentType } from "./../../src/model/view.model";
import { ErrorHandling } from "./../../src/utils/error-handling";
import { ChannelService } from '../../src/service/channel-service';
import { Globals } from './../../src/utils/globals';
import {ConfigData} from "./../test-data/config.data"

describe('error-handling unit testing', () => {
    const configData = new ConfigData('cardonly');
    const channelDataInitTop = configData.getChannelData('top')
    const channelDataInitBottom = configData.getChannelData('bottom')
    let channelData = new ChannelService(channelDataInitTop);
    const cardSuccessResponse = {
        "customerId": "cust559903",
        "customerDetails": {
            "firstName": "sandeep",
            "lastName": "kumar"
        },
        "submissionDetails": {
            "cpcStatus": "SUCCESS",
            "psErrorCode": null,
            "psErrorMessage": null,
            "trackingId": "3_addPaymentInstrumentToWallet",
            "actionTaken": "tokenize",
            "methodOfPaymentType": "card"
        },
        "cardDetails": {
            "token": "6854767345326207803012",
            "defaultInstrument": false,
            "cardLast4Digits": "4448",
            "cardType": "Visa",
            "expirationDate": "0628",
            "avsCode": null,
            "maskedCardNumber": "************4448"
        },
        "bankDetails": {
            "token": null,
            "defaultInstrument": false,
            "bankAccountLast4Digits": null,
            "bankAccountType": null,
            "maskedAccountNumber": null
        },
        "autopayDetails": null,
        "contractDetails": null
    }
    const cardErrorResponse = {
        "customerId": "cust559903",
        "customerDetails": {
            "firstName": "sandeep",
            "lastName": "kumar"
        },
        "submissionDetails": {
            "cpcStatus": "SUCCESS",
            "psErrorCode": "PAYMENT-5050",
            "psErrorMessage": "We are unable to process your payment. Please try again tomorrow.",
            "trackingId": "3_addPaymentInstrumentToWallet",
            "actionTaken": "tokenize",
            "methodOfPaymentType": "card"
        },
        "cardDetails": {
            "token": null,
            "defaultInstrument": false,
            "cardLast4Digits": "4448",
            "cardType": "Visa",
            "expirationDate": "0628",
            "avsCode": null,
            "maskedCardNumber": "************4448"
        },
        "bankDetails": {
            "token": null,
            "defaultInstrument": false,
            "bankAccountLast4Digits": null,
            "bankAccountType": null,
            "maskedAccountNumber": null
        },
        "autopayDetails": null,
        "contractDetails": null
    }
    let errorHandlingNoChannelData = new ErrorHandling();
    const global = Globals.getInstance();

    it('psErrorCode is null or undefined ', () => {
        const response = cardSuccessResponse
        const error = global.getErrorMessage(ErrorType.service);
        const cpcFormError = errorHandlingNoChannelData.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandlingNoChannelData.showError(cpcFormError, JSON.stringify(response.submissionDetails.psErrorMessage));
    });
    let errorHandling = new ErrorHandling(channelData);
    it('psErrorCode is null or undefined and no detailed error message ', () => {
        const response = cardSuccessResponse
        const error = global.getErrorMessage(ErrorType.service);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, '');
    });
    it('psErrorCode is not null ', () => {
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });

    it('error instance for failed card payment ', () => {
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        expect.objectContaining({
            action: EVN_CPC_ERROR,
            type: MessageType.form,
            level: MessageType.error,
            message: error
        })
    });
    it('isPsErrorCodeInNoWalletEntryList error code is not belongs to wallet entry', () => {
        const result = errorHandling.isPsErrorCodeInNoWalletEntryList('PAYMENT-8015')
        expect(result).toBe(false)
    })
    it('isPsErrorCodeInNoWalletEntryList error code is not belongs to wallet entry', () => {
        const result = errorHandling.isPsErrorCodeInNoWalletEntryList('PAYMENT-8015|PAYMENT-8291')
        expect(result).toBe(false)
    })
    it('isPsErrorCodeInNoWalletEntryList error code is not belongs to wallet entry', () => {
        const result = errorHandling.isPsErrorCodeInNoWalletEntryList('PAYMENT-8015|PAYMENT-8011')
        expect(result).toBe(false)
    })
    it('isPsErrorCodeInNoWalletEntryList error code is not belongs to wallet entry', () => {
        const result = errorHandling.isPsErrorCodeInNoWalletEntryList('PAYMENT-8099|PAYMENT-8011')
        expect(result).toBe(true)
    })
    it('isPsErrorCodeInNoWalletEntryList error code is not belongs to wallet entry', () => {
        const result = errorHandling.isPsErrorCodeInNoWalletEntryList('PAYMENT-8015')
        expect(result).toBe(false)
    })
    it('isPsErrorCodeInNoWalletEntryList error code is not belongs to wallet entry', () => {
        const result = errorHandling.isPsErrorCodeInNoWalletEntryList('PAYMENT-8291')
        expect(result).toBe(false)
    })
    it('isPsErrorCodeInNoWalletEntryList error code is not belongs to wallet entry', () => {
        const result = errorHandling.isPsErrorCodeInNoWalletEntryList('PAYMENT-8016')
        expect(result).toBe(true)
    })
    it('isPsErrorCodeInNoWalletEntryList error code is not belongs to wallet entry', () => {
        const result = errorHandling.isPsErrorCodeInNoWalletEntryList('PAYMENT-8011')
        expect(result).toBe(false)
    })


    it('psErrorCode is not null for cardOnly', () => {
        global.appState.set('currentPaymentType', PaymentType.CardOnly.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
    it('psErrorCode is not null for CardOnlyWithEdit', () => {
        global.appState.set('currentPaymentType', PaymentType.CardOnlyWithEdit.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
    it('psErrorCode is not null for AchOnly', () => {
        global.appState.set('currentPaymentType', PaymentType.AchOnly.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
    it('psErrorCode is not null for AchOnlyWithEdit', () => {
        global.appState.set('currentPaymentType', PaymentType.AchOnlyWithEdit.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
    it('psErrorCode is not null for CardOrBank', () => {
        global.appState.set('currentPaymentType', PaymentType.CardOrBank.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
    it('psErrorCode is not null for BankOrCard', () => {
        global.appState.set('currentPaymentType', PaymentType.BankOrCard.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
    it('psErrorCode is not null for MinCardOnly', () => {
        global.appState.set('currentPaymentType', PaymentType.MinCardOnly.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
    it('psErrorCode is not null for MinCardOnlyWithEdit', () => {
        global.appState.set('currentPaymentType', PaymentType.MinCardOnlyWithEdit.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
    it('psErrorCode is not null for CardOrExisting', () => {
        global.appState.set('currentPaymentType', PaymentType.CardOrExisting.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
    it('psErrorCode is not null for CardBankOrExisting', () => {
        global.appState.set('currentPaymentType', PaymentType.CardBankOrExisting.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
    it('psErrorCode is not null for BankCardOrExisting', () => {
        global.appState.set('currentPaymentType', PaymentType.BankCardOrExisting.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
    it('psErrorCode is not null for MinAchOnly', () => {
        global.appState.set('currentPaymentType', PaymentType.MinAchOnly.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
    it('psErrorCode is not null for CardOnlyWalletMgmtNoAutopayWithEdit', () => {
        global.appState.set('currentPaymentType', PaymentType.WalletMgmtNoAutopay.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
    it('psErrorCode is not null for CardExpirationEdit', () => {
        global.appState.set('currentPaymentType', PaymentType.CardExpirationEdit.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
    
     channelData = new ChannelService(channelDataInitBottom);
      errorHandling = new ErrorHandling(channelData);
     it('psErrorCode is not null for CardExpirationEdit error in bottom', () => {
        global.appState.set('currentPaymentType', PaymentType.CardExpirationEdit.toString().toLowerCase())
        const responseErrCC = cardErrorResponse
        const error = global.getErrorMessage(ErrorType.service, responseErrCC?.submissionDetails?.psErrorCode);
        const cpcFormError = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, error);
        errorHandling.showError(cpcFormError, responseErrCC.submissionDetails.psErrorMessage);
    });
});