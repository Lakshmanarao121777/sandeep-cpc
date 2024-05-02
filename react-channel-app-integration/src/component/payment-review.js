import React, { Fragment } from "react";
import { useHistory } from "react-router";
import ContinuePaymentButton from './continue-payment-button';

const PaymentReview = ({paymentInfo, onEdit}) => {  
  let cpcInfo= paymentInfo?.cpcData;
  const history = useHistory();
  function onEditLocal() {    
    onEdit();
    history.push('/');
  }
  function ccDetail(){
      return (
        <div className="col-8 fs-5">
        {cpcInfo?.cardDetails?.cardType}  ending in{" "} {cpcInfo?.cardDetails?.cardLast4Digits}
        </div>
      );    
  }
  function bankDetail(){
    return (
      <div className="col-8 fs-5">
        {cpcInfo?.bankDetails?.bankAccountType}  ending in{" "} {cpcInfo?.bankDetails?.maskedAccountNumber}
      </div>
    );
  }
  return (
    <Fragment>
      <div className="row gy-3 padding-bottom-30">
        <div className="col-12 fs-3">
          Your card will be charged {paymentInfo.paymentAmount}
        </div>
        <div className="col-12">Payment Date: {new Date().toLocaleDateString()}</div>
      </div>
      <div className="row padding-bottom-30">
        <div className="col-12">
          <div className="row gy-3 cc-pad-bottom-20 padding-container border border-3">
            <div className="col-2">
              <svg
                _ngcontent-lib-c21=""
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="card-img-detail card-img-top cc-img bi bi-credit-card-2-front-fill">
                <path
                  _ngcontent-lib-c21=""
                  d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-2zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"
                ></path>
              </svg>
            </div>            
            {cpcInfo?.cardDetails?.cardType ? ccDetail():cpcInfo?.bankDetails?.bankAccountType? bankDetail() : ''}
            
            <div className="col-2 text-end">
              <a onClick={onEditLocal} >Edit</a>              
            </div>
            <div className="col-2"></div>
            <div className="col-10">
              {paymentInfo?.firstName + " " + paymentInfo?.lastName}
              <br />
              {paymentInfo?.address} {paymentInfo?.addressLine2}
              <br />
              {paymentInfo?.city} {paymentInfo?.state}, {paymentInfo?.zipCode}
            </div>
            <div className="col-2"></div>
            <div className="col-10">
              <hr />
            </div>
            <div className="col-2"></div>
            <div className="col-10">
              By submitting a payment you authorize Xfinity monile to charge
              your credit card or debit card for the total amount on the date
              shown above. Xfinity mobile is not liable and will not issue
              refund for inacurate or invalid payment information delays in
              payment processing or any loses incur as a result of erroneous
              statement or balance information.
            </div>
          </div>
        </div>
      </div>
      <div className="row gy-5 padding-bottom-30">
        <div className="col-6">
          <label className="form-label fw-bold">
            EMAIL CONFIRMATION (OPTIONAL)
          </label>
          <input
            name="email"
            type="text"
            className="form-control"
            aria-label="Email"
          />
        </div>
      </div>
      <ContinuePaymentButton  buttonDisplayText="Submit Payment"></ContinuePaymentButton>
    </Fragment>
  );
};

export default PaymentReview;
