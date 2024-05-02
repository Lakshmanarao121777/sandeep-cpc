export const isStoredPaymentTermsCheckboxChecked = ():any => {

    const storedPaymentTermsCheckboxAchOnly = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
    const storedPaymentTermsCheckboxCardOnly = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
    return isStoredPaymentTermsChecked(storedPaymentTermsCheckboxAchOnly, storedPaymentTermsCheckboxCardOnly);
    
};

export const isStoredPaymentTermsChecked = (storedPaymentTermsCheckboxAchOnly:HTMLInputElement, storedPaymentTermsCheckboxCardOnly:HTMLInputElement):boolean => {
    let storedPaymentTermsCheckboxChecked = false;
    if(storedPaymentTermsCheckboxAchOnly?.checked || storedPaymentTermsCheckboxCardOnly?.checked) {
        storedPaymentTermsCheckboxChecked = true;
    }
    return storedPaymentTermsCheckboxChecked;
};