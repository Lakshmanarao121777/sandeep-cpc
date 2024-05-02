/**
 * @jest-environment jsdom
 */
import { FetchData } from '../api/fetch-data';
import { CommonWebComponent } from '../component/common-web.component';
import { CommonTest } from '../../unit-test/common/common-test-function';

describe('commmon web component function', () => {
    describe('Should validate template rendering', () => {
        const commonWebComponent = new CommonWebComponent();
        const fetchData = new FetchData(); 
        const testCommon = new CommonTest();
        //Card Only Template Render Check
        test('Should validate card only template url and render', async () => {
            const url = testCommon.init('card-only-base-template'); 
            const data  = await fetchData.get(url);
            expect(typeof data).toBe('string');
            expect(data.includes('CardOnlyBaseTemplate')).toBe(true);
            expect(typeof commonWebComponent.getTemplateContent(data,'CardOnlyBaseTemplate')).toBe('object');
        });
        //ACH Only Template Render Check
        test('Should validate ach only template url and render', async () => {
            const url = testCommon.init('ach-only-base-template'); 
            const data  = await fetchData.get(url);
            expect(typeof data).toBe('string');
            expect(data.includes('AchOnlyBaseTemplate')).toBe(true);
            expect(typeof commonWebComponent.getTemplateContent(data,'AchOnlyBaseTemplate')).toBe('object');
        });
    });
});