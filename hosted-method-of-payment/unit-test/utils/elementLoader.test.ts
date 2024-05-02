import { waitForElementToLoad } from '../../src/utils/elementLoader';

describe('setAsDefaultPayment', () => {

  beforeEach(() => {
    createMockElement();
  });
    
  it('should check default checkbox is checked or not', () => {

  const componentId = 'jump-cc-web-component'
  const editIconId = '#' + componentId + ' [id="jump-default-payment-checkbox"]';

  expect(waitForElementToLoad(editIconId)).toBeDefined;

  });

});

const createMockElement = ():void => {
  const checkBoxChecked =  '<input class="form-check-input" type="checkbox" name="jump-default-payment-checkbox" id="jump-default-payment-checkbox" checked>';

  const ccDivChecked = document.createElement('div');
  ccDivChecked.setAttribute('id', 'jump-cc-web-component');
  ccDivChecked.innerHTML = checkBoxChecked;

  document.body.appendChild(ccDivChecked);          
};