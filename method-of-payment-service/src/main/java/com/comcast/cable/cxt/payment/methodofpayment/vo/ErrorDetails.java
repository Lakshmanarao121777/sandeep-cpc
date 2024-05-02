package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
public class ErrorDetails {
    private String message;
    private String code;
    private Long timestamp;
    private String type;
    private ArrayList<String> validationMessages;

}
