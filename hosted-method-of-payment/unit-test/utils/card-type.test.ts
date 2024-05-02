import { IConfig } from '../../src/model/view.model';
import { getCardTypes } from '../../src/utils/card-type';
import { Globals } from '../../src/utils/globals';
import {ConfigData} from '../../unit-test/test-data/config.data';

describe('cardType', () => {
  const cardNumber ='<input name="jump-credit-card" id="jump-credit-card" type="text" class="form-control d-block box-size" aria-label="Credit card" autocomplete="jump-credit-card" maxLength="19" aria-invalid="false">';
  const cardNumberDiv = document.createElement('div');
  cardNumberDiv.innerHTML = cardNumber
 
  const cardTypeLabel ='<span name="jump-credit-card-img" class="form-label position-absolute image-size"><img class="image-height" src="http://localhost:8081/global-web-resources/images/cardtypes/visa.png" alt="Visa"></span>';
  const cardTypeLabelDiv = document.createElement('div');
  cardTypeLabelDiv.innerHTML = cardTypeLabel

  document.body.appendChild(cardNumberDiv);
  document.body.appendChild(cardTypeLabelDiv);    

  const cardTypeLabelElementSelector: any = document.getElementsByName('jump-credit-card-img')[0];
  const cardNumberElementSelector: any = document.getElementsByName('jump-credit-card')[0];
  
  const value = "4444444444444448";

    it('Get Card Type', () => {
        const global = getGlobal()

        expect(getCardTypes(value, cardTypeLabelElementSelector, cardNumberElementSelector, global)).toBeDefined;
        expect(cardTypeLabelElementSelector.innerHTML).toEqual ( '<img class="image-height" src="http://localhost:8081/global-web-resources/images/cardtypes/visa.png" alt="Visa">');
        expect(cardNumberElementSelector.value).toEqual ( '4444 4444 4444 4448');  
      });      
  }
);

const getGlobal= ():any => {
  let config: IConfig = Object.assign({});
  config = new ConfigData('CardOnly').getConfig();

  const global = Globals.getInstance();
  global.appState.set('config', config);

  return global;

}