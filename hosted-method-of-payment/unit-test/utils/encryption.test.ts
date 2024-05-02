import { encryptRsaOaep } from "../../src/utils/encryption";
import { importRsaKey } from "../../src/utils/crypto-key-import";
import crypto from "crypto";
/**
 * @jest-environment jsdom
 */

// Mock window.crypto.subtle.encrypt for testing

Object.defineProperty(global.self, "crypto", {
    value: {
      subtle: crypto.webcrypto.subtle,
    },
  });

describe('encryptRsaOaep', () => {
    test('should encrypt the text using RSA-OAEP', async () => {
       const textToEncrypt = '4444444444444448';
       const mockPemString:string = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs9j6Xuwumokfd+1OhPQKYaw9v2g9lIOpgPzp11PxBCPhAfBQBdbWmznNfZkBxRxlcYybIxvy+cMG8t304ybt3RYSMHRivjNRsfCQRzs7FkOeX9DNQZBY+CSfKnnNDfWzcvX0Ae9DJSm6eB3zdm/dpbrtfqmWdB1MTiBcArDIoLc2xUp6DlDh8hnWd52eKzb/ZgJiStLNiZjzMh531ROFaR3dTJMeL7ldVs/dA/XoWYhYLufTCzReKFenEhWwC4LrCKSl+3yu29TapHb+jeHkEp4cRjDTn9ARMwk01bzAfXkzXsRtjIonpuxTxP9zooN6EnxfsRfn51bIvjj/NPgyVwIDAQAB';
       const cryptoKey = await importRsaKey(mockPemString);
       // expected the return value of window.crypto.subtle.encrypt
       const expectedEncryptedData = "X90pEmJzswFvdeq5KvfAZ9Ao2sRBZXj5I/kZ0kHhAOQcoHKa/1nfiD2wrPNfTKI/2//KkvKy4zHIoLDzSTPn6ijzSvCl8+DU4ODl4y5DphIcvSqan1Y69fOEMs36vbC+vVwQGWJTamzj3+XEVq4RdRBWketezVIMJJY8v73yfDXwyXyyO4kzdiExl8GsM2lwXXXAN1eagyZmAQthuGJoeJNpQlCZfBMrnQGRHiSpUYnZLngKyuKpec1fYBIb333alh0ISKAg8WgGpAcbotUZ0I1Iv3jjOqrHsmr1SQatySNEMkkI3zs+Cjs7Eb2fCu3/wT/jTHl8AtK88xJhUDNHCQ==";
      
       const encrypted = await encryptRsaOaep(textToEncrypt, cryptoKey);
       // assert to verify that the encryption is correct checking if encrypted data is defined and lenght are same as expected.
       expect(encrypted).toBeDefined();
       expect(encrypted).toHaveLength(expectedEncryptedData.length);
       expect(encrypted===textToEncrypt).toBe(false)

    });
  });
  
  
