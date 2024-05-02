import { derivePreAuthorization, getPersonalInfo, deriveAutopayEnroll, isWalletIdDWallet } from '../../src/utils/wallet';
import { IChannelData } from '../../src/model/channel-data';
import { ACH, CC } from '../../src/constant/app.constant';

describe('Test derivePreAuthorization', () => {
    const channelDataEmpty = Object.assign({});
    const channelDataEmptyCustomerDetails = Object.assign({'customerDetails': {}});
    const channelDataStoredPaymentTrue = Object.assign({'customerDetails': {'storePaymentInstrumentLongTerm': true}});
    const channelDataStoredPaymentFalse = Object.assign({'customerDetails': {'storePaymentInstrumentLongTerm': false}});
    const storedPaymentFalseDisplayFalse = Object.assign({'customerDetails': {'storePaymentInstrumentLongTerm': false}, 
        'config': {'displayStoredPaymentOption': false, 'displayAutoPayEnroll': false}});
    const storedPaymentTrueDisplayFalse = Object.assign({'customerDetails': {'storePaymentInstrumentLongTerm': true}, 
        'config': {'displayStoredPaymentOption': false, 'displayAutoPayEnroll': false}});
    const storedPaymentTrueDisplayTrue = Object.assign({'customerDetails': {'storePaymentInstrumentLongTerm': true}, 
        'config': {'displayStoredPaymentOption': true, 'displayAutoPayEnroll': true}});
    const storedPaymentFalseDisplayTrue = Object.assign({'customerDetails': {'storePaymentInstrumentLongTerm': false}, 
        'config': {'displayStoredPaymentOption': true, 'displayAutoPayEnroll': true}});
    const storedPaymentTrueDisplayStoreTrueAutoFalse = Object.assign({'customerDetails': {'storePaymentInstrumentLongTerm': true}, 
        'config': {'displayStoredPaymentOption': true, 'displayAutoPayEnroll': false}});
    const storedPaymentFalseDisplayStoreTrueAutoFalse = Object.assign({'customerDetails': {'storePaymentInstrumentLongTerm': false}, 
        'config': {'displayStoredPaymentOption': true, 'displayAutoPayEnroll': false}});

    it('empty channelData and false storedPaymentChecked', () => {
        expect(derivePreAuthorization(channelDataEmpty, false)).toBe(null);
    });
    it('empty channelData and true storedPaymentChecked', () => {
        expect(derivePreAuthorization(channelDataEmpty, true)).toBe(null);
    });
      
    it('empty channelData.customerDetails and false storedPaymentChecked', () => {
        expect(derivePreAuthorization(channelDataEmptyCustomerDetails, false)).toBe(null);
    });
    it('empty channelData.customerDetails and true storedPaymentChecked', () => {
        expect(derivePreAuthorization(channelDataEmptyCustomerDetails, true)).toBe(null);
    });

    it('true storePaymentLongTerm, no config, and false storedPaymentChecked', () => {
        expect(derivePreAuthorization(channelDataStoredPaymentTrue, false)).toBe(true);
    });
    it('true storePaymentLongTerm, no config, and true storedPaymentChecked', () => {
        expect(derivePreAuthorization(channelDataStoredPaymentTrue, false)).toBe(true);
    });

    it('false storePaymentLongTerm, no config, and false storedPaymentChecked', () => {
        expect(derivePreAuthorization(channelDataStoredPaymentFalse, false)).toBe(false);
    });
    it('false storePaymentLongTerm, no config, and true storedPaymentChecked', () => {
        expect(derivePreAuthorization(channelDataStoredPaymentFalse, true)).toBe(false);
    });

    it('false storePaymentLongTerm, false display, and true storedPaymentChecked', () => {
        expect(derivePreAuthorization(storedPaymentFalseDisplayFalse, true)).toBe(false);
    });
    it('false storePaymentLongTerm, false display, and false storedPaymentChecked', () => {
        expect(derivePreAuthorization(storedPaymentFalseDisplayFalse, false)).toBe(false);
    });

    it('true storePaymentLongTerm, false display, and true storedPaymentChecked', () => {
        expect(derivePreAuthorization(storedPaymentTrueDisplayFalse, true)).toBe(true);
    });
    it('true storePaymentLongTerm, false display, and false storedPaymentChecked', () => {
        expect(derivePreAuthorization(storedPaymentTrueDisplayFalse, false)).toBe(true);
    });

    it('true storePaymentLongTerm, true display, and true storedPaymentChecked', () => {
        expect(derivePreAuthorization(storedPaymentTrueDisplayTrue, true)).toBe(true);
    });
    it('true storePaymentLongTerm, true display, and false storedPaymentChecked', () => {
        expect(derivePreAuthorization(storedPaymentTrueDisplayTrue, false)).toBe(false);
    });

    it('false storePaymentLongTerm, true display, and true storedPaymentChecked', () => {
        expect(derivePreAuthorization(storedPaymentFalseDisplayTrue, true)).toBe(true);
    });
    it('false storePaymentLongTerm, true display, and false storedPaymentChecked', () => {
        expect(derivePreAuthorization(storedPaymentFalseDisplayTrue, false)).toBe(false);
    });

    it('true storePaymentLongTerm, true store display, and true storedPaymentChecked', () => {
        expect(derivePreAuthorization(storedPaymentTrueDisplayStoreTrueAutoFalse, true)).toBe(true);
    });
    it('true storePaymentLongTerm, true store display, and false storedPaymentChecked', () => {
        expect(derivePreAuthorization(storedPaymentTrueDisplayStoreTrueAutoFalse, false)).toBe(false);
    });

    it('false storePaymentLongTerm, true stored display, and true storedPaymentChecked', () => {
        expect(derivePreAuthorization(storedPaymentFalseDisplayStoreTrueAutoFalse, true)).toBe(true);
    });
    it('false storePaymentLongTerm, true stored display, and false storedPaymentChecked', () => {
        expect(derivePreAuthorization(storedPaymentFalseDisplayStoreTrueAutoFalse, false)).toBe(false);
    });
  });

describe('Test derivePreAuthorization', () => {
    const responseEmpty = Object.assign({
        walletCardDetails: { billTo: { name: {} } },
        walletBankDetails: { billTo: { name: {} } },
    });
    const responseNull = Object.assign({
        walletCardDetails: { billTo: { name: { firstName: null, lastName: null, } } },
        walletBankDetails: { billTo: { name: { firstName: null, lastName: null, } } },
    });
    const responseUndefined = Object.assign({
        walletCardDetails: { billTo: { name: { firstName: 'undefined', lastName: 'undefined', } } },
        walletBankDetails: { billTo: { name: { firstName: 'undefined', lastName: 'undefined', } } },
    });
    const responseDetails = Object.assign({
        walletCardDetails: { billTo: { name: { firstName: 'SANDY', lastName: 'V', } } },
        walletBankDetails: { billTo: { name: { firstName: 'SANDY', lastName: 'V', } } },
    });
    const channelDataCustomerDetails = Object.assign({
        customerDetails: {
            firstName: 'Sandeep',
            lastName: 'K'
        }
    });
    it('empty responseCC', () => {
        expect(JSON.stringify(getPersonalInfo(responseEmpty, channelDataCustomerDetails, CC))).toBe(JSON.stringify({ firstName: 'Sandeep', lastName: 'K' }));
    });
    it('responseCC with null', () => {
        expect(JSON.stringify(getPersonalInfo(responseNull, channelDataCustomerDetails, CC))).toBe(JSON.stringify({ firstName: 'Sandeep', lastName: 'K' }));
    });
    it('responseCC with undefined string', () => {
        expect(JSON.stringify(getPersonalInfo(responseUndefined, channelDataCustomerDetails, CC))).toBe(JSON.stringify({ firstName: 'Sandeep', lastName: 'K' }));
    });
    it('responseCC with data', () => {
        expect(JSON.stringify(getPersonalInfo(responseDetails, channelDataCustomerDetails, CC))).toBe(JSON.stringify({ firstName: 'SANDY', lastName: 'V' }));
    });

    it('empty responseACH', () => {
        expect(JSON.stringify(getPersonalInfo(responseEmpty, channelDataCustomerDetails, ACH))).toBe(JSON.stringify({ firstName: 'Sandeep', lastName: 'K' }));
    });
    it('responseACH with null', () => {
        expect(JSON.stringify(getPersonalInfo(responseNull, channelDataCustomerDetails, ACH))).toBe(JSON.stringify({ firstName: 'Sandeep', lastName: 'K' }));
    });
    it('responseACH with undefined string', () => {
        expect(JSON.stringify(getPersonalInfo(responseUndefined, channelDataCustomerDetails, ACH))).toBe(JSON.stringify({ firstName: 'Sandeep', lastName: 'K' }));
    });
    it('responseACH with data', () => {
        expect(JSON.stringify(getPersonalInfo(responseDetails, channelDataCustomerDetails, ACH))).toBe(JSON.stringify({ firstName: 'SANDY', lastName: 'V' }));
    });
});

describe('Test deriveAutopayEnroll', () => {
    const channelDataEmpty = Object.assign({});
    const channelDataEmptyCustomerDetails = Object.assign({'customerDetails': {}});
    const channelDataAutopayTrue = Object.assign({'customerDetails': {'enrollInAutopay': true}});
    const channelDataAutopayFalse = Object.assign({'customerDetails': {'enrollInAutopay': false}});
    const autopayFalseDisplayFalse = Object.assign({'customerDetails': {'enrollInAutopay': false}, 
        'config': {'displayAutoPayEnroll': false}});
    const autopayTrueDisplayFalse = Object.assign({'customerDetails': {'enrollInAutopay': true}, 
        'config': {'displayAutoPayEnroll': false}});
    const autopayTrueDisplayTrue = Object.assign({'customerDetails': {'enrollInAutopay': true}, 
        'config': {'displayAutoPayEnroll': true}});
    const autopayFalseDisplayTrue = Object.assign({'customerDetails': {'enrollInAutopay': false}, 
        'config': {'displayAutoPayEnroll': true}});

    it('empty channelData and false autoPayChecked', () => {
        expect(deriveAutopayEnroll(channelDataEmpty, false)).toBe(false);
    });
    it('empty channelData and true autoPayChecked', () => {
        expect(deriveAutopayEnroll(channelDataEmpty, true)).toBe(false);
    });
      
    it('empty channelData.customerDetails and false autoPayChecked', () => {
        expect(deriveAutopayEnroll(channelDataEmptyCustomerDetails, false)).toBe(false);
    });
    it('empty channelData.customerDetails and true autoPayChecked', () => {
        expect(deriveAutopayEnroll(channelDataEmptyCustomerDetails, true)).toBe(false);
    });

    it('true enrollInAutopay, no config, and false autoPayChecked', () => {
        expect(deriveAutopayEnroll(channelDataAutopayTrue, false)).toBe(true);
    });
    it('true enrollInAutopay, no config, and true autoPayChecked', () => {
        expect(deriveAutopayEnroll(channelDataAutopayTrue, false)).toBe(true);
    });

    it('false enrollInAutopay, no config, and false autoPayChecked', () => {
        expect(deriveAutopayEnroll(channelDataAutopayFalse, false)).toBe(false);
    });
    it('false enrollInAutopay, no config, and true autoPayChecked', () => {
        expect(deriveAutopayEnroll(channelDataAutopayFalse, true)).toBe(false);
    });

    it('false enrollInAutopay, false display, and true autoPayChecked', () => {
        expect(deriveAutopayEnroll(autopayFalseDisplayFalse, true)).toBe(false);
    });
    it('false enrollInAutopay, false display, and false autoPayChecked', () => {
        expect(deriveAutopayEnroll(autopayFalseDisplayFalse, false)).toBe(false);
    });

    it('true enrollInAutopay, false display, and true autoPayChecked', () => {
        expect(deriveAutopayEnroll(autopayTrueDisplayFalse, true)).toBe(true);
    });
    it('true enrollInAutopay, false display, and false autoPayChecked', () => {
        expect(deriveAutopayEnroll(autopayTrueDisplayFalse, false)).toBe(true);
    });

    it('true enrollInAutopay, true display, and true autoPayChecked', () => {
        expect(deriveAutopayEnroll(autopayTrueDisplayTrue, true)).toBe(true);
    });
    it('true enrollInAutopay, true display, and false autoPayChecked', () => {
        expect(deriveAutopayEnroll(autopayTrueDisplayTrue, false)).toBe(false);
    });

    it('false enrollInAutopay, true display, and true autoPayChecked', () => {
        expect(deriveAutopayEnroll(autopayFalseDisplayTrue, true)).toBe(true);
    });
    it('false enrollInAutopay, true display, and false autoPayChecked', () => {
        expect(deriveAutopayEnroll(autopayFalseDisplayTrue, false)).toBe(false);
    });
});

describe('Test isWalletIdDWallet', () => {
    const csgDWallet = 'D8069123412341234';
    const xmDWallet = 'd1092739283';
    const xmDwallet2 = 'D10293847543';
    const notDWallet = 'dcustguidofsomesort';
    const validWalletId = 'DC4C9033-B1B1-439A-B5A0-2830B611A763';
    
    it('empty walletId', () => {
        expect(isWalletIdDWallet('')).toBe(false);
    });

    it('CSG DwalletId', () => {
        expect(isWalletIdDWallet(csgDWallet)).toBe(true);
    });

    it('XM DwalletId 1', () => {
        expect(isWalletIdDWallet(xmDWallet)).toBe(true);
    });

    it('XM DwalletId 2', () => {
        expect(isWalletIdDWallet(xmDwallet2)).toBe(true);
    });

    it('not Dwallet', () => {
        expect(isWalletIdDWallet(notDWallet)).toBe(false);
    });

    it('not Dwallet guid', () => {
        expect(isWalletIdDWallet(validWalletId)).toBe(false);
    });
});