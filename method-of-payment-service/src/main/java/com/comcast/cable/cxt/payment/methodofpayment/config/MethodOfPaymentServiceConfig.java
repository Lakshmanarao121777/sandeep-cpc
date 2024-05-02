package com.comcast.cable.cxt.payment.methodofpayment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

@Component
@RefreshScope
public class MethodOfPaymentServiceConfig{

    @Value("${service.name}")
    private String serviceName;

    public String getServiceName(){
        return serviceName;
    }
}
