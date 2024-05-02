package com.comcast.cable.cxt.payment.paymentContract.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

@Component
@RefreshScope
public class PaymentContractServiceConfig{

    @Value("${service.name}")
    private String serviceName;

    public String getServiceName(){
        return serviceName;
    }
}
