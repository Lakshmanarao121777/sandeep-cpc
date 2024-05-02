package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class ErrorResponse {
    private Long timestamp;
    private String type;
    private String id;
    private Map<String, String> messages;
}
