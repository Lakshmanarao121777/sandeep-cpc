package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BillTo {

    private Address address;
    private Contact contact;
    private Name name;

}
