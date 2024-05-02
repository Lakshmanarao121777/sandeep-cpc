import { pasteEvent } from '../../src/utils/event-handling';

describe('pasteEvent', () => {
    // Mock the necessary event object
    const mockEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
      clipboardData: {
        getData: jest.fn().mockReturnValue('Mocked Clipboard Data')
      }
    };
  
    it('should call the necessary event methods', () => {
      pasteEvent(mockEvent);
  
      // Verify that stopPropagation and preventDefault were called
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  
    it('should return the correct clipboard data', () => {
      const result = pasteEvent(mockEvent);
  
      // Verify that getData was called with 'Text'
      expect(mockEvent.clipboardData.getData).toHaveBeenCalledWith('Text');
  
      // Verify that the function returns the correct clipboard data
      expect(result).toBe('Mocked Clipboard Data');
    });
  });