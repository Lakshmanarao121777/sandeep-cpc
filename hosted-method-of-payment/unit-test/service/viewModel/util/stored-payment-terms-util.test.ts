import { isStoredPaymentTermsChecked } from '../../../../src/service/viewModel/util/stored-payment-terms-util';

describe('setAsDefaultPayment', () => {

  beforeEach(() => {
    createMockElement();
  });
    
  it('should check default checkbox is checked or not', () => {
  const storedPaymentsCheckedElement = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
  const storedPaymentsUncheckedElement = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;


  expect(storedPaymentsCheckedElement?.checked).toBe(true);
  expect(storedPaymentsUncheckedElement?.checked).toBe(false);
  expect(isStoredPaymentTermsChecked(storedPaymentsCheckedElement, storedPaymentsUncheckedElement)).toBe(true);

  });
});

const createMockElement = ():void => {
  const storedPaymentsAchChecked =  '<input class="form-check-input" type="checkbox" name="jump-tc-checkbox" checked>';
  const storedPaymentsCcUnchecked ='<input class="form-check-input" type="checkbox" name="jump-tc-checkbox">';
 
  const element1 = document.createElement('div');
  element1.setAttribute('id', 'jump-ach-web-component');
  element1.innerHTML = storedPaymentsAchChecked;

  const element2 = document.createElement('div');
  element2.setAttribute('id', 'jump-cc-web-component');
  element2.innerHTML = storedPaymentsCcUnchecked;

  document.body.appendChild(element1);        
  document.body.appendChild(element2);    
};