package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UrlConfiguration {

    private String requestType;
    private String baseUrl;
    private String channel;
    private String environment;
    private String paymentFrequency;
    private String billingArrangementId;
    private String paymentInstrumentType;
    private String paymentToken;
    private String customerId;
    private String clientId;

}
