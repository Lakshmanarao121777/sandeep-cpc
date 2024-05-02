import "./App.css";
import React, { Fragment, useState, useEffect } from "react";
import PaymentContainer from "./component/payment-container";
import { BrowserRouter as Router } from "react-router-dom";
import { submitChannelData } from "./data/form.submit";
import { channelInitData } from "./Config/data/channelInitData";

const App = () => {
  // let channelData = Object.assign({});
  const [channelData, setChannelData] = useState(channelInitData);
  const [envDetails, setEnvDetails] = useState({
    env: 'local',
    version: '2.3.2',
    template: 'CardOnlyWithEdit',
    pageCssUrl: 'https://common-payment.int.xfinity.com/1.0.0/hosted-method-of-payment/assets/css/jump-light.css',
    pageWidth: '100%',
    pageHeight: '880px',
    pageBorder: 'none',
    pageLabelCase: 'CapOnlyFirst',
  })

  const storeChannelInfo = (channelInfo) => {
    state.channelInfo = channelInfo;
  };

  let customerInfo = {
    customerName: {
      firstName: "Art",
      lastName: "Vandelay",
    },
    customerAddress: {
      addressLabel: "Xfinity billing address on file",
      address: "3940 Baltimore Avenue",
      addressLine2: "Apt 2B",
      city: "Philadelphia",
      state: "PA",
      zipCode: "19104",
    },
    serviceAddress: {
      addressLabel: "Xfinity service address on file",
      address: "1945 Chapmans Ln",
      addressLine2: "Unit A225",
      city: "Philadelphia",
      state: "PA",
      zipCode: "19114",
    },
    displayAddress: true,
  };

  let currentState = {
    currentPaymentType: envDetails.template, // process.env.REACT_APP_CPC_PAGE_TYPE,
    paymentAmount: "$9.99",
    channelInfo: {},
    isEdit: false,
    storeChannelInfo: storeChannelInfo,
    customerInfo: customerInfo,
  };

  let state = useState(currentState)[0];

  const [isDisabled, setIsDisabled] = useState(false);
  const [buttonDisplayText, setButtonDisplayText] = useState("Review Payment");
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
  // To display loader
  const [isStateLoading, setStateLoading] = useState(true);

  const onEdit = () => {
    console.log("step-1....onedit");
    state.isEdit = true;
    prepareChannelData();
  };

  const onContinuePayment = () => {
    //TODO: api call fails if customerDetails not provided here,
    prepareChannelData();
    //channelData.customerDetails.paymentToken = null;

    var message = {
      channel: "jump-iframe",
      action: "CPC_FORM_SUBMIT",
      cpcPageType: document
        .querySelector("jump-web-component")
        .getAttribute("cpc-page-type"),
      channelData: channelData,  //submitChannelData,
    };
    document
      .querySelector("jump-web-component")
      .shadowRoot.querySelector("iframe")
      .contentWindow.postMessage(JSON.stringify(message), "*");
  };
  const launchModalPopup = (vm) => {
    let modal_title = "Remove Payment Method?";
    let modal_body =
      "You won't be able to use this payment method without adding it again.";

    let modalPopupFooter = document.getElementById("cpcModalFooter");
    let modalPopupBody = document.getElementById("cpcModalBody");
    let modalPopupTitle = document.getElementById("cpcModalTitle");

    modalPopupTitle.innerHTML = modalTitleContainer(modal_title).innerHTML;
    const modalPopupBody_msg = modalBodyContainer(modal_body);
    const style = {
      marginLeft: "35px",
      marginRight: "-10px",
      fontSize: "12px",
    };
    const cardVm = {
      channel: "jump-iframe",
      action: "CPC_REMOVE_WALLET",
      cpcPageType: document
        .querySelector("jump-web-component")
        .getAttribute("cpc-page-type"),
      details: vm.data,
    };
    updateModalBody(
      modalPopupBody,
      modalPopupFooter,
      modalPopupBody_msg,
      modalFooterContainer("CANCEL", "REMOVE", style, "remove-btn"),
      cardVm
    );
  };
  const modalTitleContainer = (title) => {
    const innerSpan = document.createElement("span");
    innerSpan.innerHTML = title;
    return innerSpan;
  };
  const modalBodyContainer = (title) => {
    const parent = document.createElement("div");
    const child = document.createElement("p");
    child.className = "jump-modal-body-text";
    child.innerText = title;
    parent.appendChild(child);
    return parent;
  };
  const modalFooterContainer = (
    cancelButtonText,
    manageButtonText,
    style,
    btnClass
  ) => {
    // Create the parent row div element with class and style attributes
    const parentElement = document.createElement("div");
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    rowDiv.style.marginRight = "-30px";

    // Create the first child col-3 div element
    const col3Div = document.createElement("div");
    col3Div.classList.add("col-3");

    // Create the cancel button element with class, style, and data attributes
    const cancelButton = document.createElement("button");
    cancelButton.classList.add("btn", "wallet-btn");
    cancelButton.style.color = "blue";
    cancelButton.style.background = "white";
    cancelButton.setAttribute("data-bs-dismiss", "modal");
    cancelButton.innerText = cancelButtonText;

    // Append the cancel button element to the col-3 div element
    col3Div.appendChild(cancelButton);

    // Create the second child col-9 div element
    const col9Div = document.createElement("div");
    col9Div.classList.add("col-9");

    // Create the manage auto pay button element with class and style attributes
    const manageAutoPayButton = document.createElement("button");
    manageAutoPayButton.classList.add(
      "btn",
      "btn-primary",
      "wallet-btn",
      btnClass
    );
    manageAutoPayButton.style.marginLeft = style?.marginLeft;
    manageAutoPayButton.style.marginRight = style?.marginRight;
    manageAutoPayButton.innerText = manageButtonText;

    // Append the manage auto pay button element to the col-9 div element
    col9Div.appendChild(manageAutoPayButton);

    // Append the col-3 and col-9 div elements to the parent row div element
    rowDiv.appendChild(col3Div);
    rowDiv.appendChild(col9Div);
    // Append parent row div element to the parentElement
    parentElement.appendChild(rowDiv);

    // Return parentElement
    return parentElement;
  };

  const updateModalBody = (
    modalPopupBody,
    modalPopupFooter,
    bodyRemoveContent,
    footerRemoveContent,
    cardVm
  ) => {
    modalPopupBody.innerHTML = bodyRemoveContent.innerHTML;
    const modal = document.getElementById("cpcModalDialog");
    modal.classList.add("show");
    modal.style.display = "block";
    modal.style.backgroundColor = "rgba(120,120,120, 0.8)";
    if (modalPopupFooter?.firstChild) {
      modalPopupFooter?.removeChild(modalPopupFooter?.firstChild);
    }
    if (modalPopupFooter) {
      modalPopupFooter.innerHTML = footerRemoveContent.innerHTML;
    }
    const modalPaymentButton = document
      .getElementsByClassName("modal")[0]
      .getElementsByClassName("remove-btn")[0];
    modalPaymentButton?.addEventListener("click", () => {
      document
        .querySelector("jump-web-component")
        .shadowRoot.querySelector("iframe")
        .contentWindow.postMessage(JSON.stringify(cardVm), "*");
      modal.classList.remove("show");
      modal.style.display = "none";
    });
  };

  const attachEventListner = (message) => {
    // if(message && message.data && message.data.source && message.data.source.indexOf('react-devtools')>=0 ) {
    //   return;
    // }
    if (
      message &&
      message.data &&
      typeof message.data === "string" &&
      message.data.indexOf('"action":') >= 0
    ) {
      let data = JSON.parse(message.data);
      switch (data.action) {
        case "CPC_MANAGE_PAYMENT_MODAL":
          console.log("CPC_MANAGE_PAYMENT_MODAL Data: ", data);
          break;
        case "CPC_AUTO_PAY_ENROLL":
          console.log("CPC_AUTO_PAY_ENROLL Data: ", data);
          break;
        case "CPC_FORM_SUBMIT_RESPONSE":
          let result = data.cpcData.submissionDetails;
          console.log("result!!!", data);
          if (result.actionTaken.toLowerCase() === "delete") {
            document.location.reload();
          } else if (
            result &&
            (result.actionTaken.toLowerCase() === "tokenize" ||
              result.actionTaken.toLowerCase() === "update" ||
              result.actionTaken.toLowerCase() === "no_change")
          ) {
            setButtonDisplayText("Review Payment");
            setIsDisabled(false);
            setIsApiCallInProgress(false);
            data.gotoPaymentReview = true;
            let message = {};
            message.action = "JUMP-RESPONSE-RECEIVED";
            message.data = data;
            window.postMessage(JSON.stringify(message), "*");
          } else {
            setButtonDisplayText("Review Payment");
            setIsDisabled(false);
            setIsApiCallInProgress(false);
          }
          break;
        case "CPC_CONFIG_READY":
          data.channelData = channelData;
          console.log("step-1....config_ready", channelData, state.channelInfo);
          data.action = "CPC_CONFIG_SUBMIT";
          document
            .querySelector("jump-web-component")
            .shadowRoot.querySelector("iframe")
            .contentWindow.postMessage(JSON.stringify(data), "*");
          state.isEdit = false;
          break;
        case "CPC_FORM_PROCESSING":
          console.log("channel app-CPC_FORM_PROCESSING", data);
          if (data && data.callInProgress) {
            setButtonDisplayText("Loading...");
            setIsDisabled(true);
            setIsApiCallInProgress(true);
          }
          break;
        case "CPC_REMOVE_WALLET_CONFIRM":
          console.log(
            "channeel recived the confirmation for walelt remove",
            data
          );
          launchModalPopup(data);
          break;
        case "CPC_ERROR":
          console.log("channel app-CPC_ERROR", data);
          setIsDisabled(false);
          setIsApiCallInProgress(false);
          setButtonDisplayText("Review Payment");

          // if(data.isFormValid) {
          //   setIsDisabled(false);
          // } else {
          //   setIsDisabled(true);
          // }
          break;
        default:
          break;
      }
    }
  };

  function init() {
    window.addEventListener("message", attachEventListner);
    console.log("step-1....oninit");
    prepareChannelData();
  }

  function prepareChannelData() {
    channelData.paymentAmount = state.paymentAmount;
    channelData.isSubmitPayment = true;
    channelData.requirePaymentMethodSelection = true;
    channelDataEditMode();
  }

  function channelDataEditMode() {
    let info = Object.assign({});
    if (state.isEdit === true) {
      channelData.editForm = Object.assign({});
      let paymentInfo = state.channelInfo;
      info.firstName = paymentInfo.firstName;
      info.lastName = paymentInfo.lastName;
      info.address = paymentInfo.address;
      info.addressLine2 = paymentInfo.addressLine2;
      info.city = paymentInfo.city;
      info.state = paymentInfo.state;
      info.zipCode = paymentInfo.zipCode;
      channelData.editForm = info;
      //state.isEdit = false;
    }
  }



  useEffect(() => {
    init();
    return () => {
      window.removeEventListener("message", attachEventListner);
    };
  }, [channelData]);








  const [jumpUrls, setJumpUrls] = useState([{
    name: 'native-shim',
    value: ''
  }, {
    name: 'jump-web-component-bundle',
    value: ''
  }]);
  const [load, setLoad] = useState(false)
  const loadCPCComponent = () => {
    jumpUrls.map((jumpUrl, i) => {
      let body = document.getElementById("channel-component-body");
      let scripts = document.getElementsByTagName("script")
      console.log(scripts)
      // if (scripts.length < 4) {
      const script = document.createElement("script");
      script.setAttribute("src", jumpUrl.value);
      script.setAttribute("type", "text/javascript");
      script.setAttribute("async", "false");
      if (body) {
        body.appendChild(script);
      }
      // }
    });
    setLoad(true)
  }





  return (
    <Router>
      <Fragment>
        <div
          className="modal fade"
          id="cpcModalDialog"
          tabIndex="-1"
          aria-labelledby="cpcModalTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" id="cpcModalHeader">
                <h5 className="modal-title" id="cpcModalTitle"></h5>
                <button
                  type="button"
                  className="btn-close jump-bs-close-icon"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body" id="cpcModalBody"></div>
              <div className="modal-footer" id="cpcModalFooter">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  channelCustomDataField10
                </button>
              </div>
            </div>
          </div>
        </div>
        <PaymentContainer
          isDisabled={isDisabled}
          buttonDisplayText={buttonDisplayText}
          isApiCallInProgress={isApiCallInProgress}
          paymentAmount={state.paymentAmount}
          onContinuePayment={onContinuePayment}
          storeChannelInfo={storeChannelInfo}
          onEdit={onEdit}
          customerInfo={state.customerInfo}
          isStateLoading={isStateLoading}


          setChannelData={setChannelData}
          channelData={channelInitData}
          setJumpUrls={setJumpUrls}
          jumpUrls={jumpUrls}
          load={load}
          envDetails={envDetails}
          setEnvDetails={setEnvDetails}
          loadCPCComponent={loadCPCComponent}
          initEvents={init}

        ></PaymentContainer>
      </Fragment>
    </Router>
  );
};

export default App;
