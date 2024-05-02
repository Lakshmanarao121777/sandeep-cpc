package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetPublicKeyResponse {

    private String publicKey;
    private String psErrorCode;
    private String psErrorMessage;
    private String cpcStatus;

}
