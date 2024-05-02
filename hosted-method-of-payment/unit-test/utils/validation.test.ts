/**
 * @jest-environment jsdom
 */

import { translatePsTypeToNiceType } from '../../src/utils/card-type';
import { Validation } from '../../src/utils/validation';
describe('Dummy Test',()=>{
    it('Dummy test-1',()=>{
        expect(true).toBe(true);
    });
    
});
describe('Validate Customer Information', () => {
    const validation = new Validation();
    describe('Should validate enrollInAutoPay and storedPaymentMethod', () => {
        it('Should validate if enrollInAutoPay not checked, storedPaymentMethod not checked, allowedChannelList false/true ', () => {
            expect(validation.validateAutoPay(false,false,true,'')).toBe(true);
            expect(validation.validateAutoPay(false,false,false,'')).toBe(true);
        });
        it('Should validate if enrollInAutoPay checked, storedPaymentMethod not checked, allowedChannelList true ', () => {
            expect(validation.validateAutoPay(true,false,true,'')).toBe(true);
        });
        it('Should not validate if enrollInAutoPay checked, storedPaymentMethod not checked, allowedChannelList false ', () => {
            expect(validation.validateAutoPay(true,false,false,'')).toBe(false);
        });
        it('Should validate if enrollInAutoPay checked, storedPaymentMethod checked, allowedChannelList false/true ', () => {
            expect(validation.validateAutoPay(true,true,false,'')).toBe(true);
            expect(validation.validateAutoPay(true,true,true,'')).toBe(true);
        });
        it('Should validate if enrollInAutoPay not checked, storedPaymentMethod checked, allowedChannelList false/true ', () => {
            expect(validation.validateAutoPay(false,true,false,'')).toBe(true);
            expect(validation.validateAutoPay(false,true,true,'')).toBe(true);
        });
    });
    describe('Should validate name', () => {
 
        it('Should validate first-name with length of 3 ', () => {
            expect(validation.validateFirstName('Art', '').isValid).toBe(true);
        });
        it('Should validate name field to no more than 2 consecutive numeric characters ', () => {
            expect(validation.validateFirstName('Art12', '').isValid).toBe(true);
        });
        it('Should validate name field to no more than 3 consecutive numeric characters ', () => {
            expect(validation.validateFirstName('Art123', '').isValid).toBe(true);
        });
        it('Should not validate name field no more than 3 consecutive numeric characters ', () => {
            expect(validation.validateFirstName('Art1234', '').isValid).toBe(false);
        });
        it('Should validate name field to total of 5 numeric characters ', () => {
            expect(validation.validateFirstName('Art12 Me123', '').isValid).toBe(true);
        });
 
        it('Should validate name field to total of 3 numeric characters ', () => {
            expect(validation.validateFirstName('A1 B2 C3', '').isValid).toBe(true);
        });
        it('Should not validate name field more than total of 6 numeric characters ', () => {
            expect(validation.validateFirstName('Art123 Me45 A6', '').isValid).toBe(true);
        });
        it('Should validate name field to total of 6 numeric characters ', () => {
            expect(validation.validateFirstName('Ar12 M34 A5 B6', '').isValid).toBe(true);
        });
        it('Should validate name field to total of 5 numeric characters ', () => {
            expect(validation.validateFirstName('Art12 Men123', '').isValid).toBe(true);
        });
        it('Should not validate name field more than total of 6 numeric characters ', () => {
            expect(validation.validateFirstName('Art123 Me1234', '').isValid).toBe(false);
        });
        it('Should not validate name field with length of 1 ', () => {
            expect(validation.validateFirstName('A', '').isValid).toBe(true);
        });
        it('Should not validate name field with length of 0 ', () => {
            expect(validation.validateFirstName('', '').isValid).toBe(false);
        });
        it('Should validate name field max length of 150 ', () => {
            expect('ArtVandelayField ArtVandelayField ArtVandelayField ArtVandelayField ArtVandelayField ArtVandelayField ArtVandelayField ArtVandelayField ArtVandelayFie'.length === 150).toBe(true);
            expect(validation.validateFirstName('ArtVandelayField ArtVandelayField ArtVandelayFieldArtVandelayFields ArtVandelayFields ArtVandelayFieldsArtVandelayFields ArtVandelayFields ArtVandelay', '').isValid).toBe(true);
        });
        it('Should not validate length greater than 150 ', () => {
            expect('ArtVandelayFields ArtVandelayFields ArtVandelayFieldsArtVandelayFields ArtVandelayFields ArtVandelayFieldsArtVandelayFields ArtVandelayFields ArtVandelayFields'.length === 159).toBe(true);
            expect(validation.validateFirstName('ArtVandelayFields ArtVandelayFields ArtVandelayFieldsArtVandelayFields ArtVandelayFields ArtVandelayFieldsArtVandelayFields ArtVandelayFields ArtVandelayFields', '').isValid).toBe(false);
        });
        it('Should validate business name field total of 8 numeric characters ', () => {
            expect(validation.validateFirstName('Art12345 B678', 'business').isValid).toBe(true);
        });
        it('Should not validate business name field more than total of 8 numeric characters ', () => {
            expect(validation.validateFirstName('Art12345 Me6 A7 B8 C9', 'business').isValid).toBe(false);
        });
        it('Should validate business name field total of 5 consecutive numeric characters ', () => {
            expect(validation.validateFirstName('Art12345 Me6', 'business').isValid).toBe(true);
        });
        it('Should not validate business name field more than total of 6 consecutive numeric characters ', () => {
            expect(validation.validateFirstName('Art123456 Me45', 'business').isValid).toBe(false);
        });
        it('Should validate residential name field total of 3 consecutive numeric characters ', () => {
            expect(validation.validateFirstName('Art123 Me A', 'residential').isValid).toBe(true);
        });
        it('Should not validate residential name field no more than 3 consecutive numeric characters ', () => {
            expect(validation.validateFirstName('Art1234 Me5 A', 'residential').isValid).toBe(false);
        });
        it('Should validate residential name field total of 6 numeric characters ', () => {
            expect(validation.validateFirstName('Art123 Me456 A', 'residential').isValid).toBe(true);
        });
        it('Should not validate residential name field more than total of 6 numeric characters ', () => {
            expect(validation.validateFirstName('Art123 Me45 A6 B7', 'residential').isValid).toBe(false);
        });
        it('Should validate name field with a dash ', () => {
            expect(validation.validateFirstName('Art-123', 'residential').isValid).toBe(true);
        });
        it('Should validate name field with a apostrophe ', () => {
            expect(validation.validateFirstName('Art\'2', 'residential').isValid).toBe(true);
        });
        it('ErrorType for first name with empty/null value is no_value ', () => {
            expect(validation.validateFirstName('','residential').errorType).toBe('no_value');
        });
        it('ErrorType for first name with invalid value is invalid ', () => {
            expect(validation.validateFirstName('adqdfasdfa23232323232','residential').errorType).toBe('invalid');
        });
        it('Should validate name field with a apostrophe ', () => {
            expect(validation.validateFirstName('Art"3', 'residential').isValid).toBe(true);
        });
        it('Should validate empty business name field', () => {
            expect(validation.validateFirstName('undefined', 'business').isValid).toBe(true);
        });
        it('Should validate business name field consecutive number of 5', () => {
            expect(validation.validateFirstName('test12345te7', 'business').isValid).toBe(true);
        });
        it('Should not validate business name field consecutive number more than 6', () => {
            expect(validation.validateFirstName('test123456te7', 'business').isValid).toBe(false);
        });
        it('Should not validate business name field consecutive total number more than 8', () => {
            expect(validation.validateFirstName('test12345te6789', 'business').isValid).toBe(false);
        });
        it('Should not validate first name with all numbers', () => {
            expect(validation.validateFirstName('123', 'residential').isValid).toBe(false);
        });
        it('Should not validate business name with all numbers', () => {
            expect(validation.validateFirstName('12345', 'business').isValid).toBe(false);
        });
    
    });
 
    describe('Should validate credit card number', () => {
    
        it('Should validate cc number with length of 16 ', () => {
            const ccNum1 = '4444444444444448';
            expect(ccNum1.length === 16).toBe(true);
            expect(validation.validateCC(ccNum1).isValid).toBe(true);
        });
        it('Should not validate cc number with length of 16 ', () => {
            const ccNum1 = '4444444444444444';
            expect(ccNum1.length === 16).toBe(true);
            expect(validation.validateCC(ccNum1).isValid).toBe(false);
        });
        it('Should validate cc number with a space ', () => {
            expect(validation.validateCC('6011 111111111117').isValid).toBe(true);
        });
        it('Should validate cc number with spaces ', () => {
            expect(validation.validateCC('41111111   1111 1111').isValid).toBe(true);
        });
        it('Should not validate cc number with length of 2 ', () => {
            const ccNum4 = '44';
            expect(ccNum4.length === 2).toBe(true);
            expect(validation.validateCC(ccNum4).isValid).toBe(false);
        });
        it('Should not validate visa cc number with length of 17 ', () => {
            const ccNum3 = '44444444444444448';
            expect(ccNum3.length === 17).toBe(true);
            expect(validation.validateCC(ccNum3).isValid).toBe(false);
        });
        it('Should not validate visa cc number with length of 18 ', () => {
            const ccNum3 = '444444444444444448';
            expect(ccNum3.length === 18).toBe(true);
            expect(validation.validateCC(ccNum3).isValid).toBe(false);
        });
        it('Should not validate visa cc number with length of 19 ', () => {
            const ccNum3 = '4444444444444444448';
            expect(ccNum3.length === 19).toBe(true);
            expect(validation.validateCC(ccNum3).isValid).toBe(false);
        });
        it('Should not validate random cc number with length of 16 ', () => {
            const ccNum5 = '1234567890123456';
            expect(ccNum5.length === 16).toBe(true);
            expect(validation.validateCC(ccNum5).isValid).toBe(false);
        });
 
        it('Should not validate Diners Club cc number with length of 14 ', () => {
            const ccNum6 = '44444444444448';
            expect(ccNum6.length === 14).toBe(true);
            expect(validation.validateCC(ccNum6).isValid).toBe(false);
        });
        it('Should not validate cc number with length of 15 ', () => {
            const ccNum2 = '444444444444448';
            expect(ccNum2.length === 15).toBe(true);
            expect(validation.validateCC(ccNum2).isValid).toBe(false);
        });
        it('Should not validate Visa cc number with length of 15 and only 4\'s', () => {
            const ccNum6 = '444444444444444';
            expect(ccNum6.length === 15).toBe(true);
            expect(validation.validateCC(ccNum6).isValid).toBe(false);
        });
        it('Should  not validate an empty credit card number', () => {
            expect(validation.validateCC('').isValid).toBe(false);
        });
    });
 
    const date = new Date();
    const CurrentMonth = (num: number) => {
        let currentMonth = (date.getMonth() + 1 + num).toString();
        if (Number(currentMonth) < 1) {
            currentMonth = '01';
        }
        if (Number(currentMonth) > 12) {
            currentMonth = '12';
        }
        currentMonth =
       currentMonth.length === 1 ? '0' + currentMonth : currentMonth;
        return currentMonth;
    };
 
    const CurrentYear = (num: number) => {
        const currentYear = (date.getFullYear() + num).toString();
        return currentYear;
    };
 
    describe('Should validate validateExpMM', () => {
        it('Should validate current month and current year ', () => {
            expect(validation.validateExpMM(CurrentMonth(0), CurrentYear(0))).toBe(true);
        });
        it('Should validate next month and current year ', () => {
            expect(validation.validateExpMM(CurrentMonth(1), CurrentYear(0))).toBe(true);
        });
        //  it("Should not validate current month and previous year ", () => {
        //    expect(validation.validateExpMM(CurrentMonth(0), CurrentYear(-1))).toBe(false);
        //  });
        //  it("Should not validate single digit month ", () => {
        //    expect(validation.validateExpMM("2", CurrentYear(0))).toBe(false);
        //  });
        it('Should not validate an empty month', () => {
            expect(validation.validateExpMM('', CurrentYear(0))).toBe(false);
        });
        it('Should validate current month and empty year', () => {
            expect(validation.validateExpMM(CurrentMonth(0), 'undefined')).toBe(true);
        });
        it('Should not validate an empty month and empty year', () => {
            expect(validation.validateExpMM('', '')).toBe(false);
        });
    });
 
    describe('Should validate validateExpYY', () => {
        it('Should validate year input greater than current year', () => {
            expect(validation.validateExpYY(CurrentYear(1), CurrentMonth(1))).toBe(true);
        });
        it('Should validate current year and next month ', () => {
            expect(validation.validateExpYY(CurrentYear(0), CurrentMonth(1))).toBe(true);
        });
        it('Should not validate previous year and previous month ', () => {
            expect(validation.validateExpYY(CurrentYear(-1), CurrentMonth(-1))).toBe(false);
        });
        it('Should not validate an empty year', () => {
            expect(validation.validateExpYY('', CurrentMonth(0))).toBe(false);
        });
        it('Should not validate current year and empty month', () => {
            expect(validation.validateExpYY(CurrentYear(0), 'undefined')).toBe(false);
        });
        it('Should not validate an empty year and empty month', () => {
            expect(validation.validateExpYY('', '')).toBe(false);
        });
    });
 
    //document.body.innerHTML = '<input name="jump-cvv" type="password" placeholder="CVV" maxlength="4" class="form-control" aria-label="Security code">';
    describe('Should validate validateExpCvv', () => {
        it('Should not validate an empty cc number and empty cvv', () => {
            expect(validation.validateExpCvv('', '').isValid).toBe(false);
        });
        it('Should validate american-express 4 digit cvv number', () => {
            expect(validation.validateExpCvv('1234', '378282246310005').isValid).toBe(true);
        });
        it('Should validate discover 3 digit cvv number', () => {
            expect(validation.validateExpCvv('123', '6011111111111117').isValid).toBe(true);
        });
        it('Should validate mastercard 3 digit cvv number', () => {
            expect(validation.validateExpCvv('123', '5555555555554444').isValid).toBe(true);
        });
        it('Should validate visa 3 digit cvv number', () => {
            expect(validation.validateExpCvv('123', '4012888888881881').isValid).toBe(true);
        });
        //  it("Should validate JCB cvv number", () => {
        //   expect(validation.validateExpCvv("123", "3530111333300000").isValid).toBe(true);
        //  });
        it('Should not validate visa 4 digit cvv number', () => {
            expect(validation.validateExpCvv('1234', '4147888888881881').isValid).toBe(false);
        });
    });
 
    describe('Should validate validateAccountNo', () => {
        it('Should not validate an empty accountNo', () => {
            expect(validation.validateAccountNo('').isValid).toBe(false);
        });
        it('Should validate correct accountNo', () => {
            expect(validation.validateAccountNo('4102').isValid).toBe(true);
        });
        it('Should validate correct accountNo', () => {
            expect(validation.validateAccountNo('41025678901234567').isValid).toBe(true);
        });
        it('Should not validate 3 digits accountNo', () => {
            expect(validation.validateAccountNo('410').isValid).toBe(false);
        });
        it('Should not validate 18 digits accountNo', () => {
            expect(validation.validateAccountNo('410256789012345678').isValid).toBe(false);
        });
        it('ErrorType of accountNois no_value if value is empty/null is no_value', () => {
            expect(validation.validateAccountNo('').errorType).toBe('no_value');
        });
        it('ErrorType of accountNo is invalid if value is not valid', () => {
            expect(validation.validateAccountNo('xadrerer3adfqe').errorType).toBe('alpha_characters');
        });
    });
 
    describe('Should validate validateRoutingNo', () => {
        it('Should validate correct routingNo', () => {
            expect(validation.validateRoutingNo('091000019').isValid).toBe(true);
            expect(validation.validateRoutingNo('011401533').isValid).toBe(true);
        });
        it('Should validate first set of RTN less than 12 ', () => {
            expect(validation.validateRoutingNo('091000019').isValid).toBe(true);
        });
        it('Should not validate routingNo less 9 digits', () => {
            expect(validation.validateRoutingNo('12322312').isValid).toBe(false);
        });
        it('Should not validate routingNo with symbols', () => {
            expect(validation.validateRoutingNo('12322312$').isValid).toBe(false);
        });
        it('Should not validate inncorrect first two digits higher than 12', () => {
            expect(validation.validateRoutingNo('151000019').isValid).toBe(false);
        });
        it('Should not validate inncorrect first two digits higher than 32', () => {
            expect(validation.validateRoutingNo('338739111').isValid).toBe(false);
        });
        it('Should not validate inncorrect first two digits higher than 72', () => {
            expect(validation.validateRoutingNo('738739111').isValid).toBe(false);
        });
        it('Should not validate an empty routingNo', () => {
            expect(validation.validateRoutingNo('').isValid).toBe(false);
        });
    });
 
    describe('Should validate validateAccountTypeChecking', () => {
        it('Should not validate an empty accountTypeChecking', () => {
            expect(validation.validateAccountTypeChecking('')).toBe(false);
        });
        it('Should validate an accountTypeChecking', () => {
            expect(validation.validateAccountTypeChecking('checking')).toBe(true);
        });
    });
 
    describe('Should validate validateAccountTypeSaving', () => {
        it('Should not validate an empty accountTypeSaving', () => {
            expect(validation.validateAccountTypeSaving('')).toBe(false);
        });
        it('Should validate an accountTypeSaving', () => {
            expect(validation.validateAccountTypeSaving('savings')).toBe(true);
        });
    });
 
    describe('Should validate address', () => {
        it('Should validate address length less or equal to 13', () => {
            expect(validation.validateAddress('1701 JFK Blvd').isValid).toBe(true);
        });
        it('Should validate address to 8 total of consecutive numbers', () => {
            expect(validation.validateAddress('12345678 JFK Blvd').isValid).toBe(true);
        });
        it('Should not validate address to 9 total consecutive numbers', () => {
            expect(validation.validateAddress('123456789 JFK Blvd').isValid).toBe(false);
        });
        it('Should validate address to 12 total of numeric values', () => {
            expect(validation.validateAddress('123456 JFK Blvd123456').isValid).toBe(true);
        });
        it('Should not validate address to 13 numeric values', () => {
            expect(validation.validateAddress('1234567 JFK Blvd123456').isValid).toBe(false);
        }); 
        it('Should not validate address length greater than 61', () => {
            const address182Length =
         '1701 JFK Blvd 1701 JFK Blvd 1701 JFK Blvd 1701 JFK Blvd 1701 1701 JFK Blvd 1701 JFK Blvd 1701 JFK Blvd 1701 JFK Blvd 1701 1701 JFK Blvd 1701 JFK Blvd 1701 JFK Blvd 1701 JFK Blvd 1701';
            expect(validation.validateAddress(address182Length).isValid).toBe(false);
        });
        it('Should not validate address only numbers', () => {
            expect(validation.validateAddress('123456789').isValid).toBe(false);
        });
        it('Should not validate address the length of 1', () => {
            expect(validation.validateAddress('a').isValid).toBe(true);
        });
        it('Should validate address with symbols', () => {
            expect(validation.validateAddress('1701 $JFK Blvd').isValid).toBe(true);
        });
        it('Should not validate an empty address', () => {
            expect(validation.validateAddress('').isValid).toBe(false);
        });
        it('ErrorType for Address field with an empty/null value is no_value', () => {
            expect(validation.validateAddress('').errorType).toBe('no_value');
        });
        it('ErrorType for Address field with an invalid value is Invalid', () => {
            expect(validation.validateAddress('adfasdfads45435434343434225').errorType).toBe('invalid');
        });
    });
 
    describe('Should validate validateAddressLine2', () => {
        it('Should validate an empty addressLine2', () => {
            expect(validation.validateAddressLine2('')).toBe(true);
        });
        it('Should validate addressLine2', () => {
            expect(validation.validateAddressLine2('Apt 23')).toBe(true);
        });
        it('Should validate hash symbol addressLine2', () => {
            expect(validation.validateAddressLine2('Apt #23')).toBe(true);
        });
        it('Should validate a symbol', () => {
            expect(validation.validateAddressLine2('$22')).toBe(true);
        });
        it('Should not validate addressLine2 the length of 1', () => {
            expect(validation.validateAddressLine2('a')).toBe(true);
        });
        it('Should validate address to 8 consecutive numbers', () => {
            expect(validation.validateAddressLine2('12345678 JFK Blvd')).toBe(true);
        });
        it('Should not validate address to 9 consecutive numbers', () => {
            expect(validation.validateAddressLine2('123456789 JFK Blvd')).toBe(false);
        });
        it('Should validate address to 12 numeric values', () => {
            expect(validation.validateAddressLine2('123456 JFK Blvd123456')).toBe(true);
        });
        it('Should not validate address to 13 numeric values', () => {
            expect(validation.validateAddressLine2('1234567 JFK Blvd123456')).toBe(false);
        });
    });
 
    describe('Should validate validateCity ', () => {
        it('Should validate city ', () => {
            expect(validation.validateCity('New York').isValid).toBe(true);
        });
        it('Should not validate city length of 1', () => {
            expect(validation.validateCity('N').isValid).toBe(false);
        });
        it('Should not validate city field with numeric characters ', () => {
            expect(validation.validateCity('New York2').isValid).toBe(false);
        });
        it('Should not validate city length greater than 20', () => {
            const city21Length = 'New York New York New';
            expect(validation.validateCity(city21Length).isValid).toBe(false);
        });
        it('Should not validate an empty city ', () => {
            expect(validation.validateCity('').isValid).toBe(false);
        });
    });
 
    describe('Should validate validateState ', () => {
        it('Should validate CA state ', () => {
            expect(validation.validateState('CA')).toBe(true);
        });
        it('Should not validate state length of 1', () => {
            expect(validation.validateState('C')).toBe(false);
        });
        it('Should not validate state field with numeric characters', () => {
            expect(validation.validateState('CA2')).toBe(false);
            expect(validation.validateState('C2')).toBe(false);
        });
        it('Should not validate unknown CC state', () => {
            expect(validation.validateState('CC')).toBe(false);
        });
        it('Should not validate an empty state ', () => {
            expect(validation.validateState('')).toBe(false);
        });
    });
 
    describe('Should validate validateZipcode ', () => {
        it('Should validate zip code length of 5', () => {
            expect(validation.validateZipcode('95117').isValid).toBe(true);
        });
        it('Should not validate zip code with 6 consecutive numbers ', () => {
            expect(validation.validateZipcode('123456').isValid).toBe(false);
        });
        it('Should not validate zip code length of 4', () => {
            expect(validation.validateZipcode('1231').isValid).toBe(false);
        });
        it('Should not validate an empty zip code ', () => {
            expect(validation.validateZipcode('').isValid).toBe(false);
        });
        it('Should not validate zip code 5 plus 4 digit zip format with space ', () => {
            expect(validation.validateZipcode('915054 0900').isValid).toBe(false);
        });
        it('Should validate zip code 5 - 4 digit zip format ', () => {
            expect(validation.validateZipcode('95112-4232').isValid).toBe(true);
        });
        it('Should validate zip code 9 digit zip format ', () => {
            expect(validation.validateZipcode('951124232').isValid).toBe(true);
        });
        it('Should not validate zip code all zero digit zip format ', () => {
            expect(validation.validateZipcode('00000').isValid).toBe(false);
        });
        it('Should not validate zip code 5 + 4 all zero digit zip format ', () => {
            expect(validation.validateZipcode('00000 0000').isValid).toBe(false);
        });
        it('ErrorType for zip code with empty value is no_value', () => {
            expect(validation.validateZipcode('').errorType).toBe('no_value');
        });
        it('ErrorType for zip code with invalid value is invalid', () => {
            expect(validation.validateZipcode('00000 0000').errorType).toBe('invalid');
        });
    });

    
    describe('validate card type coversion to nice type', () => {
        it('Should return American Express ', () => {
            expect(translatePsTypeToNiceType('AmericanExpress')).toBe('American Express');
        });
        it('Should return Mastercard ', () => {
            expect(translatePsTypeToNiceType('MasterCard')).toBe('Mastercard');
        });
        it('Should return Diners Club ', () => {
            expect(translatePsTypeToNiceType('DinersClub')).toBe('Diners Club');
        });
        it('Should return UnionPay ', () => {
            expect(translatePsTypeToNiceType('ChinaUnionPay')).toBe('UnionPay');
        });

    });
    describe('validate value', () => {
        it('Should return false for type undefined ', () => {
            expect(validation.isValidValue(undefined)).toBe(false);
        });
        it('Should return false for undefined string ', () => {
            expect(validation.isValidValue('undefined')).toBe(false);
        });
        it('Should return false for null ', () => {
            expect(validation.isValidValue(null)).toBe(false);
        });
        it('Should return false for empty string ', () => {
            expect(validation.isValidValue('')).toBe(false);
        });
        it('Should return true for valid string ', () => {
            expect(validation.isValidValue('Sandeep')).toBe(true);
        });

    });
    describe('setStoredPaymentValidationSelection', () => {
        it('should display Stored payment, checkbox selected on render, cannot be unselected', () => {
          const result = validation.setStoredPaymentValidationSelection(true, true, true, true);
          expect(result).toEqual({
            checkboxSelectedOnload: true,
            displayStorePaymentComponent: true,
          });
        });
      
        it('should display Stored payment, checkbox selected on render, cannot be unselected', () => {
          const result = validation.setStoredPaymentValidationSelection(true, false, true, true);
          expect(result).toEqual({
            checkboxSelectedOnload: true,
            displayStorePaymentComponent: false,
          });
        });
      
        it('should display Stored payment, checkbox selected on render, cannot be unselected', () => {
          const result = validation.setStoredPaymentValidationSelection(false, true, true, true);
          expect(result).toEqual({
            checkboxSelectedOnload: true,
            displayStorePaymentComponent: true,
          });
        });
      
        it('should display Stored payment, checkbox not selected on render, form can be submitted with it checked or not', () => {
          const result = validation.setStoredPaymentValidationSelection(false, true, false, true);
          expect(result).toEqual({
            checkboxSelectedOnload: false,
            displayStorePaymentComponent: true,
            userSelectCheckboxRequired: false,
          });
        });
      
        it('should display Stored payment, checkbox not selected on render, form can be submitted with it checked or not', () => {
          const result = validation.setStoredPaymentValidationSelection(false, true, false, false);
          expect(result).toEqual({
            checkboxSelectedOnload: false,
            displayStorePaymentComponent: true,
            userSelectCheckboxRequired: false,
          });
        });
      
        it('Should display Stored payment, checkbox not selected on render. If form is submitted unchecked a stored_payment form validation message is displayed before this component requiring the user to check it.', () => {
          const result = validation.setStoredPaymentValidationSelection(false, true, true, false);
          expect(result).toEqual({
            checkboxSelectedOnload: false,
            displayStorePaymentComponent: true,
            userSelectCheckboxRequired: true,
          });
        });
      
        it('Should display Stored payment, checkbox not selected on render. Form submitted unchecked a stored_payment form validation message is displayed before this component requiring the user to check it', () => {
          const result = validation.setStoredPaymentValidationSelection(true, true, true, false);
          expect(result).toEqual({
            checkboxSelectedOnload: false,
            displayStorePaymentComponent: true,
            userSelectCheckboxRequired: true,
          });
        });
      
        it('Should not display stored payment or enrollInAutopay', () => {
          const result = validation.setStoredPaymentValidationSelection(false, false, false, false);
          expect(result).toEqual({
            checkboxSelectedOnload: false,
            displayStorePaymentComponent: false,
            userSelectCheckboxRequired: false,
          });
        });
        it('should display Stored payment, checkbox selected on render, can be unselected', () => {
            const result = validation.setStoredPaymentValidationSelection(false, false, false, true);
            expect(result).toEqual({
              checkboxSelectedOnload: true,
              displayStorePaymentComponent: true,
              userSelectCheckboxRequired: false,
            });
          });
      });
});
