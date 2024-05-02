import * as bankAccountType from '../../src/constant/bank-account-type';
import * as bankData from '../test-data/channelTemplateMapping.data'; 

describe('translatePaymentServiceBankAccountTypeToLabel', () => {
    const CONSUMER_INT =  'CONSUMER_INT';
    const CBPC_ONETIME = 'CBPC_ONETIME';
    const MMCES_LITE = 'MMCES_LITE';

    it('should translate service saving value for: default account type', () => {
        const accountType = bankAccountType.translatePaymentServiceBankAccountTypeToLabel(bankAccountType.SERVICE_SAVINGS_VALUE, bankData.channelTemplateMapping, CONSUMER_INT);
        expect(accountType).toBe(bankAccountType.LABEL_SAVINGS);
    });

    it('should translate service checking value for: default account type', () => {
        const accountType = bankAccountType.translatePaymentServiceBankAccountTypeToLabel(bankAccountType.SERVICE_CHECKING_VALUE, bankData.channelTemplateMapping, CONSUMER_INT);
        expect(accountType).toBe(bankAccountType.LABEL_CHECKING);
    });

    it('should translate service corporate checking value for: default account type', () => {
        const accountType = bankAccountType.translatePaymentServiceBankAccountTypeToLabel(bankAccountType.SERVICE_CORPORATE_CHECKING_VALUE, bankData.channelTemplateMapping, CONSUMER_INT);
        expect(accountType).toBe(bankAccountType.LABEL_CORPORATE_CHECKING);
    });
    //
    it('should translate service corporate checking value for: corporate default account type', () => {
        const accountType = bankAccountType.translatePaymentServiceBankAccountTypeToLabel(bankAccountType.SERVICE_CORPORATE_CHECKING_VALUE, bankData.channelTemplateMapping , CBPC_ONETIME);
        expect(accountType).toBe(bankAccountType.LABEL_CORPORATE_CHECKING);
    });

    it('should translate service checking value for: corporate default account type', () => {
        const accountType = bankAccountType.translatePaymentServiceBankAccountTypeToLabel(bankAccountType.SERVICE_CHECKING_VALUE, bankData.channelTemplateMapping , CBPC_ONETIME);
        expect(accountType).toBe(bankAccountType.LABEL_PERSONAL_CHECKING);
    });

    it('should translate service saving value for corporate default account type', () => {
        const accountType = bankAccountType.translatePaymentServiceBankAccountTypeToLabel(bankAccountType.SERVICE_SAVINGS_VALUE, bankData.channelTemplateMapping , CBPC_ONETIME);
        expect(accountType).toBe(bankAccountType.LABEL_PERSONAL_SAVINGS);
    });
    //
    it('should translate service corporate checking value for: corporate default account type', () => {
        const accountType = bankAccountType.translatePaymentServiceBankAccountTypeToLabel(bankAccountType.SERVICE_CORPORATE_CHECKING_VALUE, bankData.channelTemplateMapping , MMCES_LITE);
        expect(accountType).toBe(bankAccountType.LABEL_CORPORATE_CHECKING);
    });

    it('should translate service checking value for: corporate default account type', () => {
        const accountType = bankAccountType.translatePaymentServiceBankAccountTypeToLabel(bankAccountType.SERVICE_CHECKING_VALUE, bankData.channelTemplateMapping , MMCES_LITE);
        expect(accountType).toBe(bankAccountType.LABEL_PERSONAL_CHECKING);
    });

    it('should translate service saving value for corporate default account type', () => {
        const accountType = bankAccountType.translatePaymentServiceBankAccountTypeToLabel(bankAccountType.SERVICE_SAVINGS_VALUE, bankData.channelTemplateMapping , MMCES_LITE);
        expect(accountType).toBe(bankAccountType.LABEL_PERSONAL_SAVINGS);
    });
    //
    it('should return the same account type when channelType does not match channelName ', () => {
        const accountType = bankAccountType.translatePaymentServiceBankAccountTypeToLabel('SomeOtherAccountType', bankData.channelTemplateMapping, 'CONSUMER');
        expect(accountType).toBe('SomeOtherAccountType');
    });
});
