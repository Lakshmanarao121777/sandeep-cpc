
// export interface IErrorMessage{
//     channel:Array<string>;
//     system: ISystem;
//     form:IForm;
//     service:any;
//     communication:any;
// }
// export interface ISystem{
//     default:string;
//     card_block:string;
//     bank_block:string;
//     card_and_bank_block:string;
//     channel_template_block:string;
// }
// export interface IForm{
//     payment_type:IInvalid;
//     bank:IBank;
//     card:ICard;
// }
// interface IInvalid{
//     invalid:string;
//     no_value:string;
// }
// export interface IBank {
//     first_name:IInvalid;
//     last_name:IInvalid;
//     address_line_1:IInvalid;
//     address_line_2:IInvalid;
//     city:IInvalid;
//     state:IInvalid;
//     zip:IInvalid;
//     account_type:IInvalid;
//     bank_account_number:IBankAccNo;
//     routing_number:IRouringNo;    
// }
// export interface ICard {
//     first_name:IInvalid;
//     last_name:IInvalid;
//     address_line_1:IInvalid;
//     address_line_2:IInvalid;
//     city:IInvalid;
//     state:IInvalid;
//     zip:IInvalid;
//     card_number:ICardNo;
//     expiration_month_year:IExpiration;
//     security_code:ISecurityCode; 
// }

// interface IBankAccNo{
//     alpha_characters:IInvalid;
//     no_value:string;
//     too_many_digits:string;
// }
// interface IRouringNo{
//     alpha_characters:string;
//     no_value:string;
//     not_enough_digits:string;
//     too_many_digits:string;
// }
// interface ICardNo{
//     alpha_characters:string;
//     invalid:string;
//     no_value:string;
//     too_many_digits:string;
// }
// interface IExpiration{
//     date_in_past:string;
//     no_value:string;
// }
// interface ISecurityCode{
//     alpha_characters:string;
//     no_value:string;
//     not_enough_digits:{
//         'american-express':string;
//         discover:string;
//         mastercard:string;
//         visa:string;

//     }
// }
