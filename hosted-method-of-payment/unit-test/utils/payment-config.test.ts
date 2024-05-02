import { ActionObserverService } from "../../src/service/action-observer-service";
import { showBlockError } from "../../src/utils/payment-config";

describe('showBlockError', () => {
    it('should have called fire with event', () => {
        let service:ActionObserverService = new ActionObserverService();
        jest.spyOn(service, 'fire');
        showBlockError(this, 'test event', 'test message', 'top', service);
        expect(service.fire).toBeCalledTimes(1);
    });
});