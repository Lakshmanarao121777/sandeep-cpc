import { ConfigValidation } from '../../src/utils/config-validation';
import { IConfig } from '../../src/model/view.model';

describe('Test index isValid* functions', () => {
    const configValidation = new ConfigValidation();
    
    describe('Should validate config', () => {
        const config:IConfig = Object.assign({});

        it('Should validate local', () => {
            config.cpcEnv = 'local';
            expect(configValidation.isValidConfig(config)).toBe(true);
        });

        it('Should validate development', () => {
            config.cpcEnv = 'development';
            expect(configValidation.isValidConfig(config)).toBe(true);
        });
    
        it('Should validate integration', () => {
            config.cpcEnv = 'integration';
            expect(configValidation.isValidConfig(config)).toBe(true);
        });
          
        it('Should validate preproduction', () => {
            config.cpcEnv = 'preproduction';
            expect(configValidation.isValidConfig(config)).toBe(true);
        });
    
        it('Should validate production', () => {
            config.cpcEnv = 'production';
            expect(configValidation.isValidConfig(config)).toBe(true);
        });

        it('Should validate regardless of case PROduction', () => {
            config.cpcEnv = 'PROduction';
            expect(configValidation.isValidConfig(config)).toBe(true);
        });

        it('Should not validate stage (not a real environment)', () => {
            config.cpcEnv = 'stage';
            expect(configValidation.isValidConfig(config)).toBe(false);
        });

        it('Should not validate empty string', () => {
            config.cpcEnv = '';
            expect(configValidation.isValidConfig(config)).toBe(false);
        });
    });

    describe('Should validate template', () => {
        let cpcPageType:string;

        it('Should validate MinCardOnly', () => {
            cpcPageType = 'MinCardOnly';
            expect(configValidation.isValidTemplate(cpcPageType)).toBe(true);
        });

        it('Should not validate MinCardOnly with incorrect case', () => {
            cpcPageType = 'mincardonly';
            expect(configValidation.isValidTemplate(cpcPageType)).toBe(false);
        });

        it('Should not validate empty string', () => {
            cpcPageType = '';
            expect(configValidation.isValidTemplate(cpcPageType)).toBe(false);
        });

        it('Should not validate unknown value', () => {
            cpcPageType = 'notARealTemplateName';
            expect(configValidation.isValidTemplate(cpcPageType)).toBe(false);
        });
    });

    describe('isChannelPageTypeValid', () => {
        it('should return true when the channel and template match', () => {
        // Sample channelTemplateMapping data
            const channelTemplateMapping = [
                { channel: 'channel1', template: 'template1' },
                { channel: 'channel2', template: 'template2' },
            ];

            const channelName = 'channel1';
            const cpcPageType = 'template1';

            // Call the method under test
            const result = configValidation.isChannelPageTypeValid(channelTemplateMapping, channelName, cpcPageType);

            // Assert the result
            expect(result).toBe(true);
        });

        it('should return false when the channel and template do not match', () => {
        // Sample channelTemplateMapping data
            const channelTemplateMapping = [
                { channel: 'channel1', template: 'template1' },
                { channel: 'channel2', template: 'template2' },
                // Add more channelTemplateConfig objects as needed
            ];

            const channelName = 'channel1';
            const cpcPageType = 'template2'; // Different template

            // Call the method under test
            const result = configValidation.isChannelPageTypeValid(channelTemplateMapping, channelName, cpcPageType);

            // Assert the result
            expect(result).toBe(false);
        });

        it('should return false when the channel is not found', () => {
        // Sample channelTemplateMapping data
            const channelTemplateMapping = [
                { channel: 'channel1', template: 'template1' },
                { channel: 'channel2', template: 'template2' },
                // Add more channelTemplateConfig objects as needed
            ];

            const channelName = 'channel3'; // Non-existing channel
            const cpcPageType = 'template1'; 

            // Call the method under test
            const result = configValidation.isChannelPageTypeValid(channelTemplateMapping, channelName, cpcPageType);

            // Assert the result
            expect(result).toBe(false);
        });
        it('should return false when the template is not found', () => {
        // Sample channelTemplateMapping data
            const channelTemplateMapping = [
                { channel: 'channel1', template: 'template1' },
                { channel: 'channel2', template: 'template2' },
                // Add more channelTemplateConfig objects as needed
            ];

            const channelName = 'channel1'; 
            const cpcPageType = 'template3'; // Non-existing template

            // Call the method under test
            const result = configValidation.isChannelPageTypeValid(channelTemplateMapping, channelName, cpcPageType);

            // Assert the result
            expect(result).toBe(false);
        });
        it('should return false when the channel and template is not found', () => {
        // Sample channelTemplateMapping data
            const channelTemplateMapping = [
                { channel: 'channel1', template: 'template1' },
                { channel: 'channel2', template: 'template2' },
                // Add more channelTemplateConfig objects as needed
            ];

            const channelName = 'channel3'; // Non-existing channel
            const cpcPageType = 'template3'; // Non-existing template

            // Call the method under test
            const result = configValidation.isChannelPageTypeValid(channelTemplateMapping, channelName, cpcPageType);

            // Assert the result
            expect(result).toBe(false);
        });
        it('should return false when the channel is empty is not found', () => {
        // Sample channelTemplateMapping data
            const channelTemplateMapping = [
                { channel: 'channel1', template: 'template1' },
                { channel: 'channel2', template: 'template2' },
                // Add more channelTemplateConfig objects as needed
            ];

            const channelName = ''; // empty channel
            const cpcPageType = 'template1';

            // Call the method under test
            const result = configValidation.isChannelPageTypeValid(channelTemplateMapping, channelName, cpcPageType);

            // Assert the result
            expect(result).toBe(false);
        });
        it('should return false when the template is empty is not found', () => {
        // Sample channelTemplateMapping data
            const channelTemplateMapping = [
                { channel: 'channel1', template: 'template1' },
                { channel: 'channel2', template: 'template2' },
                // Add more channelTemplateConfig objects as needed
            ];

            const channelName = 'channel1'; 
            const cpcPageType = '';// empty template

            // Call the method under test
            const result = configValidation.isChannelPageTypeValid(channelTemplateMapping, channelName, cpcPageType);

            // Assert the result
            expect(result).toBe(false);
        });
        it('should return false when the channel and template is empty is not found', () => {
        // Sample channelTemplateMapping data
            const channelTemplateMapping = [
                { channel: 'channel1', template: 'template1' },
                { channel: 'channel2', template: 'template2' },
                // Add more channelTemplateConfig objects as needed
            ];

            const channelName = ''; // empty channel
            const cpcPageType = ''; // empty template

            // Call the method under test
            const result = configValidation.isChannelPageTypeValid(channelTemplateMapping, channelName, cpcPageType);

            // Assert the result
            expect(result).toBe(false);
        });

    });

});
