function str2ab(str: string) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
  

  
export function importRsaKey(pem: string) {
    // Check if window.crypto is available  
    if (!window.crypto)
    { 
        throw new Error('Web Crypto API is not supported in this environment.');   
    }
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pem);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    return window.crypto.subtle.importKey(
        'spki',
        binaryDer,
        {
            name: 'RSA-OAEP',
            hash: 'SHA-1',
        },
        true,
        ['encrypt']
    );
}