package com.comcast.cable.cxt.payment.methodofpayment.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
public class OrderInfo {
    private ChannelCustomData channelCustomData;
    private ArrayList<OrderItem> orderItems;
    private ShipTo shipTo;
}
