package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItem {
    private String productCode;
    private String productName;
    private String productSKU;
    private long quantity;
    private double unitPrice;
}
