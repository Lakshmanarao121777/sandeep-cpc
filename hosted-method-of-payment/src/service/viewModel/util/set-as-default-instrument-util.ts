export const isSetAsDefaultPaymentCheckboxChecked = ():boolean => {
    const setAsDefaultPaymentCheckboxAchOnly = document.querySelector('#jump-ach-web-component [id="jump-default-payment-checkbox"]') as HTMLInputElement;
    const setAsDefaultPaymentCheckboxCardOnly = document.querySelector('#jump-cc-web-component [id="jump-default-payment-checkbox"]') as HTMLInputElement;
    
    return isDefaultPaymentChecked(setAsDefaultPaymentCheckboxAchOnly, setAsDefaultPaymentCheckboxCardOnly);
    
};

export const isDefaultPaymentChecked = (setAsDefaultPaymentCheckboxAchOnly:HTMLInputElement, setAsDefaultPaymentCheckboxCardOnly:HTMLInputElement):boolean => {
    let setAsDefaultPaymentCheckboxChecked = false;
    if(setAsDefaultPaymentCheckboxAchOnly?.checked || setAsDefaultPaymentCheckboxCardOnly?.checked) {
        setAsDefaultPaymentCheckboxChecked = true;
    }
    return setAsDefaultPaymentCheckboxChecked;
};