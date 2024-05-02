package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetPublicKeyRequest {

    private String channel;
    @Override
    public String toString() {
        return "GetPublickKeyRequest [channel=" + channel + "]";
    }
}
