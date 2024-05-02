// Import the function and constants
import { enableManualEntry } from '../../../../src/service/viewModel/util/enable-manual-entry-util';
import { ACH_ONLY, CARD_ONLY, ACH_ONLY_WITH_EDIT, CARD_ONLY_WITH_EDIT, CPC_CARD_BANK_OR_EXISTING, CARD_OR_EXISTING} from '../../../../src/constant/app.constant';

describe('enableManualEntry', () => {
    let inputField: any;
    let addEventListenerSpy: jest.SpyInstance;

    beforeEach(() => {
    // Create a mock input field and spy on addEventListener
        inputField = document.createElement('input');
        addEventListenerSpy = jest.spyOn(inputField, 'addEventListener');
    });

    afterEach(() => {
    // Clear any mocks and reset the input field
        jest.clearAllMocks();
        inputField = null;
    });

    it('should add achOnly event listeners when enableManualEntry is true', () => {
        const cpcPageType = ACH_ONLY.toLowerCase();
        const enableManualEntryValue = true;

        enableManualEntry(enableManualEntryValue, inputField, cpcPageType);

        // Expectations for each event type
        expect(addEventListenerSpy).toHaveBeenCalledWith('contextmenu', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('copy', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('cut', expect.any(Function));
    });

    it('should not add achOnly event listeners when enableManualEntry is false', () => {
        const cpcPageType = ACH_ONLY.toLowerCase();
        const enableManualEntryValue = false;

        enableManualEntry(enableManualEntryValue, inputField, cpcPageType);

        // Expectations that no event listeners were added
        expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it('should add cardOnly event listeners when enableManualEntry is true', () => {
        const cpcPageType = CARD_ONLY.toLowerCase();
        const enableManualEntryValue = true;

        enableManualEntry(enableManualEntryValue, inputField, cpcPageType);

        // Expectations for each event type
        expect(addEventListenerSpy).toHaveBeenCalledWith('contextmenu', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('copy', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('cut', expect.any(Function));
    });

    it('should not add cardOnly event listeners when enableManualEntry is false', () => {
        const cpcPageType = CARD_ONLY.toLowerCase();
        const enableManualEntryValue = false;

        enableManualEntry(enableManualEntryValue, inputField, cpcPageType);

        // Expectations that no event listeners were added
        expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it('should add cardOnlyWithEdit event listeners when enableManualEntry is true', () => {
        const cpcPageType = CARD_ONLY_WITH_EDIT.toLowerCase();
        const enableManualEntryValue = true;

        enableManualEntry(enableManualEntryValue, inputField, cpcPageType);

        // Expectations for each event type
        expect(addEventListenerSpy).toHaveBeenCalledWith('contextmenu', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('copy', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('cut', expect.any(Function));
    });

    it('should not add cardOnlyWithEdit event listeners when enableManualEntry is false', () => {
        const cpcPageType = CARD_ONLY_WITH_EDIT.toLowerCase();
        const enableManualEntryValue = false;

        enableManualEntry(enableManualEntryValue, inputField, cpcPageType);

        // Expectations that no event listeners were added
        expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    it('should add AchOnlyWithEdit event listeners when enableManualEntry is true', () => {
        const cpcPageType = ACH_ONLY_WITH_EDIT.toLowerCase();
        const enableManualEntryValue = true;

        enableManualEntry(enableManualEntryValue, inputField, cpcPageType);

        // Expectations for each event type
        expect(addEventListenerSpy).toHaveBeenCalledWith('contextmenu', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('copy', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('cut', expect.any(Function));
    });

    it('should not add AchOnlyWithEdit event listeners when enableManualEntry is false', () => {
        const cpcPageType = ACH_ONLY_WITH_EDIT.toLowerCase();
        const enableManualEntryValue = false;

        enableManualEntry(enableManualEntryValue, inputField, cpcPageType);

        // Expectations that no event listeners were added
        expect(addEventListenerSpy).not.toHaveBeenCalled();
    });
  
    it('should add CardBankOrExisting event listeners when enableManualEntry is true', () => {
        const cpcPageType = CPC_CARD_BANK_OR_EXISTING.toLowerCase();
        const enableManualEntryValue = true;

        enableManualEntry(enableManualEntryValue, inputField, cpcPageType);

        // Expectations for each event type
        expect(addEventListenerSpy).toHaveBeenCalledWith('contextmenu', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('copy', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('cut', expect.any(Function));
    });

    it('should not add CardBankOrExisting event listeners when enableManualEntry is false', () => {
        const cpcPageType = CPC_CARD_BANK_OR_EXISTING.toLowerCase();
        const enableManualEntryValue = false;

        enableManualEntry(enableManualEntryValue, inputField, cpcPageType);

        // Expectations that no event listeners were added
        expect(addEventListenerSpy).not.toHaveBeenCalled();
    });
  
    it('should add CardOrExisting event listeners when enableManualEntry is true', () => {
        const cpcPageType = CARD_OR_EXISTING.toLowerCase();
        const enableManualEntryValue = true;

        enableManualEntry(enableManualEntryValue, inputField, cpcPageType);

        // Expectations for each event type
        expect(addEventListenerSpy).toHaveBeenCalledWith('contextmenu', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('copy', expect.any(Function));
        expect(addEventListenerSpy).toHaveBeenCalledWith('cut', expect.any(Function));
    });

    it('should not add CardOrExisting event listeners when enableManualEntry is false', () => {
        const cpcPageType = CARD_OR_EXISTING.toLowerCase();
        const enableManualEntryValue = false;

        enableManualEntry(enableManualEntryValue, inputField, cpcPageType);

        // Expectations that no event listeners were added
        expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    // Add more test cases for different cpcPageType values and enableManualEntry values
});
