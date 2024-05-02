/**
 * @jest-environment jsdom
 */
import { CommonTest } from '../common/common-test-function';
import { ConfigSubmitData } from '../test-data/config-submit.data';
import { FormSubmitData } from '../test-data/form-submit.data';


describe('', () => {
    describe('Should validate template rendering', () => {
        const configSubmitDataObj = new ConfigSubmitData();
        const FormSubmitDataObj = new FormSubmitData();
        const testCommon = new CommonTest();

        test('Should Validate XM With CardOnly Config Custom Data and Form Submit Data', async () => {
            const ConfigSubmitData =  configSubmitDataObj.getResponseChanelCustomData('XM');
            const FormSubmitData =  FormSubmitDataObj.getResponseWithCustomData('XM','CardOnly');
            const CofigFormSubmitData = testCommon.prepareFormSubmitResponse(ConfigSubmitData,'CardOnly');
            console.log(JSON.stringify(FormSubmitData) === JSON.stringify(CofigFormSubmitData));
            expect(JSON.stringify(FormSubmitData) === JSON.stringify(CofigFormSubmitData)).toBe(false);
        });

        test('Should Validate XM With Achonly Config Custom Data and Form Submit Data', async () => {
            const ConfigSubmitData =  configSubmitDataObj.getResponseChanelCustomData('XM');
            const FormSubmitData =  FormSubmitDataObj.getResponseWithCustomData('XM','Achonly');
            const CofigFormSubmitData = testCommon.prepareFormSubmitResponse(ConfigSubmitData,'Achonly');
            console.log(JSON.stringify(FormSubmitData) === JSON.stringify(CofigFormSubmitData));
            expect(JSON.stringify(FormSubmitData) === JSON.stringify(CofigFormSubmitData)).toBe(false);
        });

        test('Should Validate XM With CardOnly Config Data and Form Submit Data', async () => {
            const ConfigSubmitData =  configSubmitDataObj.getResponseChanel('XM');
            const FormSubmitData =  FormSubmitDataObj.getResponse('XM','CardOnly');
            const CofigFormSubmitData = testCommon.prepareFormSubmitResponse(ConfigSubmitData,'CardOnly');
            console.log(JSON.stringify(FormSubmitData) === JSON.stringify(CofigFormSubmitData));
            expect(JSON.stringify(FormSubmitData) === JSON.stringify(CofigFormSubmitData)).toBe(false);
        });

        test('Should Validate XM With Achonly Config Data and Form Submit Data', async () => {
            const ConfigSubmitData =  configSubmitDataObj.getResponseChanelCustomData('XM');
            const FormSubmitData =  FormSubmitDataObj.getResponse('XM','Achonly');
            const CofigFormSubmitData = testCommon.prepareFormSubmitResponse(ConfigSubmitData,'Achonly');
            console.log(JSON.stringify(FormSubmitData) === JSON.stringify(CofigFormSubmitData));
            expect(JSON.stringify(FormSubmitData) === JSON.stringify(CofigFormSubmitData)).toBe(false);
        });

        test('Should Validate SMB With CardOnly Config and Form Submit Data', async () => {
            const ConfigSubmitData =  configSubmitDataObj.getResponseChanelCustomData('SMB');
            const FormSubmitData =  FormSubmitDataObj.getResponseWithCustomData('SMB','CardOnly');
            const CofigFormSubmitData = testCommon.prepareFormSubmitResponse(ConfigSubmitData,'CardOnly');
            console.log(JSON.stringify(FormSubmitData) === JSON.stringify(CofigFormSubmitData));
            expect(JSON.stringify(FormSubmitData) === JSON.stringify(CofigFormSubmitData)).toBe(false);
        });

        test('Should Validate SMB With Achonly Config and Form Submit Data', async () => {
            const ConfigSubmitData =  configSubmitDataObj.getResponseChanelCustomData('SMB');
            const FormSubmitData =  FormSubmitDataObj.getResponseWithCustomData('SMB','Achonly');
            const CofigFormSubmitData = testCommon.prepareFormSubmitResponse(ConfigSubmitData,'Achonly');
            console.log(JSON.stringify(FormSubmitData) === JSON.stringify(CofigFormSubmitData));
            expect(JSON.stringify(FormSubmitData) === JSON.stringify(CofigFormSubmitData)).toBe(false);
        });
    
    });
});