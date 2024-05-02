import React, { Fragment } from "react";
import { IframeLoading } from "../component/iframe-loading";

const ContinuePaymentButton = ({
    onPaymentClick,
    isDisabled,
    buttonDisplayText,
    isApiCallInProgress,
    isStateLoading,
}) => {
    console.log("button-component ", isDisabled);
    function isLoading() {
        if (isStateLoading) {
            return <IframeLoading />;
        }
    }
    function getButton() {
        return isApiCallInProgress === true ? (
            <button
                type="button"
                disabled={isDisabled}
                className="btn btn-primary rounded-pill btn-margin-left-20"
                id="jump-continue-payment"
                onClick={onPaymentClick}
            >
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {buttonDisplayText}
            </button>
        ) : (
            <button
                type="button"
                disabled={isDisabled}
                className="btn btn-primary rounded-pill btn-margin-left-20"
                id="jump-continue-payment"
                onClick={onPaymentClick}
            >
                {buttonDisplayText}
            </button>
        );
    }
    return (
        // <div>
        //       <button id="jump-continue-payment" onClick={onPaymentClick}>Continue Payment</button>
        // </div>
        <Fragment>
            <div className="row cc-pad-bottom-20">
                <div className="col-12">
                    <hr></hr>{" "}
                </div>
            </div>
            <div className="row cc-pad-bottom-20">
                <div className="col-12 btn-text-align-rigth">
                    <button type="button" className="btn btn-light rounded-pill">
                        Cancel {isDisabled}
                    </button>
                    {getButton()}
                    {isLoading()}
                </div>
            </div>
        </Fragment>
    );
};

export default ContinuePaymentButton;
