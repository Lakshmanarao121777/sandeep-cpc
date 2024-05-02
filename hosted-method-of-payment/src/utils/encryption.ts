import { TextEncoder } from 'text-encoding-shim';
import { fromByteArray } from 'base64-js';
import 'webcrypto-shim';


export const encryptRsaOaep=async (textToEncrypt: string, cryptoKey: CryptoKey)=>{
    // Check if window.crypto is available  
    if (!window.crypto)
    { 
        throw new Error('Web Crypto API is not supported in this environment.');   
    }
    // signature algorithm.
    const sigAlgorithm = {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-1' },
    };
    // Encrypt the text.
    const result = window.crypto.subtle.encrypt(
        sigAlgorithm,
        cryptoKey,
        (new TextEncoder()).encode(textToEncrypt),
    );
    const encrypted = fromByteArray(new Uint8Array(await result));
    return encrypted;
};