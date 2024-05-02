/**
 * @jest-environment jsdom
 */

import { ConfigData } from '../test-data/config.data';
import { IConfig } from '../../src/model/view.model';
import { Globals } from '../../src/utils/globals';
import { Validation } from '../../src/utils/validation';
describe('Auto pay web component', () => {
    let config: IConfig = Object.assign({});
    config = new ConfigData('CardOrBank').getConfig();
    Globals.getInstance().appState.set('config', config);
    const validations = new Validation();
    describe('Should validate channel', () => {
 
        it('Should validate BSD_DIGITAL_SALES as true', () => {
            expect(validations.isBusinessChannelNameAllowed('BSD_DIGITAL_SALES')).toBe(true);
        });

        it('Should validate EINSTEIN as false', () => {
            expect(validations.isBusinessChannelNameAllowed('EINSTEIN')).toBe(false);
        });
    });
});