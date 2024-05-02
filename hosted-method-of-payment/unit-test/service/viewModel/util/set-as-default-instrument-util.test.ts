import { isDefaultPaymentChecked } from '../../../../src/service/viewModel/util/set-as-default-instrument-util';

describe('setAsDefaultPayment', () => {

  beforeEach(() => {
    createMockElement();
  });
    
  it('should check default checkbox is checked or not', () => {
  const setAsDefaultPaymentCheckboxAchUnchecked = document.querySelector('#jump-ach-web-component [id="jump-default-payment-checkbox"]') as HTMLInputElement;
  const setAsDefaultPaymentCheckboxCardChecked = document.querySelector('#jump-cc-web-component [id="jump-default-payment-checkbox"]') as HTMLInputElement;
  
  expect(setAsDefaultPaymentCheckboxCardChecked?.checked).toBe(true);
  expect(isDefaultPaymentChecked(setAsDefaultPaymentCheckboxAchUnchecked, setAsDefaultPaymentCheckboxCardChecked)).toBe(true);

  });


});

const createMockElement = ():void => {
  const checkBoxChecked =  '<input class="form-check-input" type="checkbox" name="jump-default-payment-checkbox" id="jump-default-payment-checkbox" checked>';
  const checkBoxUnchecked ='<input class="form-check-input" type="checkbox" name="jump-default-payment-checkbox" id="jump-default-payment-checkbox" >';

  const ccDivChecked = document.createElement('div');
  ccDivChecked.setAttribute('id', 'jump-cc-web-component');
  ccDivChecked.innerHTML = checkBoxChecked;

  const achDivUnchecked = document.createElement('div');
  achDivUnchecked.setAttribute('id', 'jump-ach-web-component');
  achDivUnchecked.innerHTML = checkBoxUnchecked;

  document.body.appendChild(achDivUnchecked);
  document.body.appendChild(ccDivChecked);          
};