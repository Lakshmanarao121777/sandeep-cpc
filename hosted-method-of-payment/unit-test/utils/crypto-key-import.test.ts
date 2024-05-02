import crypto from "crypto";
import { importRsaKey } from "../../src/utils/crypto-key-import";
/**
 * @jest-environment jsdom
 */

// Mock window.crypto.subtle.encrypt for testing

Object.defineProperty(global.self, "crypto", {
    value: {
      subtle: crypto.webcrypto.subtle,
    },
  });


describe('importRsaKey', () => {
    test('should import RSA key', async () => {
      const mockPemString:string = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs9j6Xuwumokfd+1OhPQKYaw9v2g9lIOpgPzp11PxBCPhAfBQBdbWmznNfZkBxRxlcYybIxvy+cMG8t304ybt3RYSMHRivjNRsfCQRzs7FkOeX9DNQZBY+CSfKnnNDfWzcvX0Ae9DJSm6eB3zdm/dpbrtfqmWdB1MTiBcArDIoLc2xUp6DlDh8hnWd52eKzb/ZgJiStLNiZjzMh531ROFaR3dTJMeL7ldVs/dA/XoWYhYLufTCzReKFenEhWwC4LrCKSl+3yu29TapHb+jeHkEp4cRjDTn9ARMwk01bzAfXkzXsRtjIonpuxTxP9zooN6EnxfsRfn51bIvjj/NPgyVwIDAQAB';
      const cryptoKey = await importRsaKey(mockPemString);
  
      // assert to verify that the function behaves as expected.
      expect(cryptoKey).toBeDefined();
    });
  });