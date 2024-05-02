export interface IPayment {
  firstName: string;
  lastName: string;
  paymentAmount: number;
  paymentType: string;
  ccNo: string;
  accNo: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  cpcData: IWalletServiceResponse;
};

export interface CardDetails {
  token: string;
  cardLast4Digits: string;
  cardType: string;
  expirationDate: string;
  avsCode: string;
  maskedCardNumber: string;
};

export interface BankDetails {
  token: string;
  bankAccountLast4Digits: string;
  bankAccountType: string;
  maskedAccountNumber: string;
};

export interface SubmissionDetails {
  actionTaken: string;
  cpcMessage: string;
  cpcStatus: string;
  methodOfPaymentType: string;
  psErrorCode: string;
  psErrorMessage: string;
  trackingId: string;
  }
export interface IWalletServiceResponse {
  cardDetails: CardDetails;
  bankDetails: BankDetails;
  submissionDetails: SubmissionDetails;
};
export interface IAddress {
  address: string;
  addressLine2:string;
  city:string;
  state:string;
  zipCode:string;
}
export enum PaymentType {
  CardOnly = 1,
  AchOnly = 2,
  CardOrBank = 3,
  MinCardOnly = 4,
  MinCardOnlyWithEdit = 5,
  CardOrExisting = 6,
  CardBankOrExisting = 7
}
