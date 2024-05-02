package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShipTo {
    private Address address;
    private Contact contact;
    private Name name;
    private String shippingMethod;
}
