import React, { Fragment, useEffect } from "react";
import CardOrBank from "./card-or-bank";
import ContinuePaymentButton from "./continue-payment-button";
import MinCardOnly from "./min-card-only";
import MinAchOnly from "./min-ach-only";

const PaymentDetail = ({
  paymentAmount,
  onContinuePayment,
  customerInfo,
  isDisabled,
  buttonDisplayText,
  isApiCallInProgress,
  isStateLoading,
  envDetails,
  setEnvDetails,
  initEvents,
  load
}) => {
  console.log("payment-detail-component ", isDisabled);

  const handleChange = (e) => setEnvDetails({ ...envDetails, template: e.target.value });

  const addPaymentComponent = () => {
    const placeholder = document.getElementById("payment-component");
    if (placeholder) {
      const jumpComponent = document.getElementsByTagName("jump-web-component");
      if (envDetails.template !== "paymentTypeSelection") {
        if (jumpComponent.length > 0) {
          jumpComponent[0].setAttribute("cpc-env", envDetails.env);
          jumpComponent[0].setAttribute("cpc-page-type", envDetails.template);
          jumpComponent[0].setAttribute("cpc-page-label-case", envDetails.pageLabelCase);
          jumpComponent[0].setAttribute("cpc-page-height", envDetails.pageHeight);
          jumpComponent[0].setAttribute("cpc-page-width", envDetails.pageWidth);
          jumpComponent[0].setAttribute("cpc-page-border", envDetails.pageBorder);
        } else {
          const el = document.createElement("jump-web-component");
          el.setAttribute("cpc-env", envDetails.env);
          el.setAttribute("cpc-page-type", envDetails.template);
          el.setAttribute("cpc-page-label-case", envDetails.pageLabelCase);
          el.setAttribute("cpc-page-height", envDetails.pageHeight);
          el.setAttribute("cpc-page-width", envDetails.pageWidth);
          el.setAttribute("cpc-page-border", envDetails.pageBorder);
          placeholder.appendChild(el);
        }
        initEvents();
      }
    }
  };
  useEffect(() => {
    if (load) {
      addPaymentComponent();
    }
  }, [load, envDetails.template]);

  return (
    <Fragment>
      <div className="row gy-5 cc-pad-bottom-20">
        <div className="col-12">
          <strong>
            PAYMENT AMOUNT<br></br>
            {paymentAmount}
          </strong>
        </div>
        {envDetails.template.toLowerCase() === "mincardonly" ? (
          <MinCardOnly customer={customerInfo} />
        ) : envDetails.template === "paymentTypeSelection" ? (
          <CardOrBank parentCallback={handleChange} />
        ) : envDetails.template.toLowerCase() === "minachonly" ? (
          <MinAchOnly customer={customerInfo} />
        ) : null}
      </div>
      <div className="row">
        <div className="col-12" id="payment-component"></div>
      </div>
      <div className="row cc-pad-top-20">
        <div className="col-12">
          <div id="showMessage" className="row"></div>
        </div>
      </div>
      <ContinuePaymentButton
        isDisabled={isDisabled}
        buttonDisplayText={buttonDisplayText}
        isApiCallInProgress={isApiCallInProgress}
        onPaymentClick={onContinuePayment}
        isStateLoading={isStateLoading}
      ></ContinuePaymentButton>
    </Fragment>
  );
};

export default PaymentDetail;
