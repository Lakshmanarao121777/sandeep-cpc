import "./assets/css/payment-container.css";
import React, { useEffect, useState } from "react";
import PaymentReview from "./payment-review";
import UpdatePaymentReview from "./update-payment-review";
import { Switch, Route } from "react-router-dom";
import PaymentDetail from "./payment-detail";
import { useHistory } from "react-router-dom";

import { Button } from "react-bootstrap";
import { ChannelData } from "../Config";

const PaymentContainer = ({
  paymentAmount,
  onContinuePayment,
  storeChannelInfo,
  onEdit,
  customerInfo,
  isDisabled,
  buttonDisplayText,
  isApiCallInProgress,
  isStateLoading,

  setChannelData,
  channelData,
  setJumpUrls,
  jumpUrls,
  envDetails,
  setEnvDetails,
  loadCPCComponent,
  initEvents,
  load,


}) => {
  console.log("payment-component ", isDisabled);
  useEffect(() => {
    window.addEventListener("message", hostedAppHandler);
    window.addEventListener("popstate", (event) => {
      onEdit();
      history.push("/");
    });

    return () => {
      window.removeEventListener("message", hostedAppHandler);
    };
  });

  const history = useHistory();
  let paymentInfo = Object.assign({});

  const hostedAppHandler = (paymentDetail) => {
    if (
      paymentDetail &&
      paymentDetail.data &&
      paymentDetail.data.namespace === "quantum"
    ) {
      return;
    }
    if (
      paymentDetail &&
      paymentDetail.data &&
      (paymentDetail.data.source === undefined ||
        (paymentDetail.data.source &&
          paymentDetail.data.source.indexOf("react-devtool") < 0))
    ) {
      let pmtDetail = JSON.parse(paymentDetail.data)
      switch (pmtDetail.action) {
        case "JUMP-RESPONSE-RECEIVED":
          console.log('jjjjjjjjjjjj',pmtDetail )
          let submissionDetails = pmtDetail?.data?.cpcData?.submissionDetails;
          //addToWallet
          if (submissionDetails?.actionTaken === "tokenize") {
            paymentInfo = addToWalletResponse(pmtDetail);
            storeChannelInfo(paymentInfo);
          }
          //updateInstrument
          else if (
            submissionDetails?.actionTaken === "update" ||
            submissionDetails?.actionTaken === "no_change"
          ) {
            paymentInfo = updateInstrumentResponse(pmtDetail);
          }

          let apiStatus = submissionDetails?.cpcStatus;
          if (apiStatus.toLowerCase() === "success") {
            if (
              submissionDetails?.actionTaken === "update" ||
              submissionDetails?.actionTaken === "no_change"
            ) {
              console.log(
                "update payment submission success: ",
                submissionDetails?.cpcMessage
              );
              history.push("/update-payment-review");
            } else {
              console.log(
                "payment submission success: ",
                submissionDetails?.cpcStatus
              );
              history.push("/payment-review");
            }
          } else {
            console.log(
              "paymentSubmissionMessage Error: ",
              pmtDetail.data.cpcData.submissionDetails?.cpcMessage
            );
          }
          break;
        case "CPC_AUTO_PAY_ENROLL":
          let submissionDetailsCpcStatus =
            pmtDetail?.data?.cpcData?.submissionDetails?.cpcStatus;
          let autoPaySubmissionDetails =
            pmtDetail?.data?.cpcData?.autoPayResponse?.submissionDetails;
          if (
            autoPaySubmissionDetails?.actionTaken === "autopay-enroll" &&
            submissionDetailsCpcStatus.toLowerCase() === "success"
          ) {
            paymentInfo = addToWalletResponse(pmtDetail);
            storeChannelInfo(paymentInfo);
            history.push("/payment-review");
          }
          break;
        default:
          break;
      }
    }
  };
  function addToWalletResponse(messageData) {
    let paymentInfo = Object.assign({});
    let p = messageData.data.paymentInfo;
    if (!p) {
      p = messageData.data.channelData.customerDetails;
    }
    paymentInfo.firstName = p.firstName;
    paymentInfo.lastName = p.lastName;
    paymentInfo.paymentAmount = messageData.data.channelData.paymentAmount;

    paymentInfo.address = messageData.data.channelData.customerDetails.address;
    paymentInfo.addressLine2 =
      messageData.data.channelData.customerDetails.addressLine2;
    paymentInfo.city = messageData.data.channelData.customerDetails.city;
    paymentInfo.state = messageData.data.channelData.customerDetails.state;
    paymentInfo.zipCode = messageData.data.channelData.customerDetails.zip;

    paymentInfo.cpcData = messageData.data.cpcData;
    return paymentInfo;
  }
  function updateInstrumentResponse(messageData) {
    let paymentInfo = Object.assign({});
    let customerDetail = messageData.data.channelData.customerDetails;
    paymentInfo.firstName = customerDetail.firstName;
    paymentInfo.lastName = customerDetail.lastName;
    paymentInfo.address = customerDetail.address;
    paymentInfo.addressLine2 = customerDetail.addressLine2;
    paymentInfo.city = customerDetail.city;
    paymentInfo.state = customerDetail.state;
    paymentInfo.zipCode = customerDetail.zipCode;
    paymentInfo.cpcData = messageData.data.cpcData;
    paymentInfo.paymentAmount = messageData.data.channelData.paymentAmount;
    paymentInfo.paymentType = messageData.data.channelData.paymentType;
    return paymentInfo;
  }






  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4 col-sm-12" style={{maxHeight:"100vh", overflowX:"hidden"}}>
          <div className="card">
            {/* <i className="bi bi-credit-card-2-front-fill card-img-top cc-img"></i> */}
            <div className="card-body">
              <div className="d-flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="100"
                  fill="currentColor"
                  className="bi bi-credit-card-2-front-fill"
                  // className="card-img-top cc-img bi bi-credit-card-2-front-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-2zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z" />
                </svg>
                <div className="px-3 py-2">
                  <div className="card-text">
                    <strong>TOTAL AMOUNT DUE</strong>
                  </div>
                  <div className="card-text">
                    <strong>$9.99</strong>
                  </div>
                  <div className="card-text">Mobile number ending in 4321</div>
                </div>
              </div>
              <div className="card-text"  style={{maxHeight:"70vh", overflowX:"auto"}}>
                <div>
                <Button disabled={envDetails.template === ''} size='sm' onClick={() => loadCPCComponent()}>Load CPC Component</Button>
                </div>
                <ChannelData setChannelData={setChannelData} channelData={channelData} setJumpUrls={setJumpUrls} jumpUrls={jumpUrls} envDetails={envDetails} setEnvDetails={setEnvDetails} />
              </div>
              {/* <div className="card-text"><a href="#">Sing in</a> for account detail</div> */}
            </div>
          </div>
        </div>
        <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-8 col-sm-12">
          <Switch>
            <Route
              path="/"
              exact
              render={() => (
                <PaymentDetail
                  isDisabled={isDisabled}
                  buttonDisplayText={buttonDisplayText}
                  isApiCallInProgress={isApiCallInProgress}
                  paymentAmount={paymentAmount}
                  onContinuePayment={onContinuePayment}
                  customerInfo={customerInfo}
                  isStateLoading={isStateLoading}


                  envDetails={envDetails}
                  setEnvDetails={setEnvDetails}
                  initEvents={initEvents}
                  load={load}
                />
              )}
            />
            <Route
              path="/payment-review"
              render={() => (
                <PaymentReview paymentInfo={paymentInfo} onEdit={onEdit} />
              )}
            />
            <Route
              path="/update-payment-review"
              render={() => (
                <UpdatePaymentReview
                  paymentInfo={paymentInfo}
                  onEdit={onEdit}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};
export default PaymentContainer;
