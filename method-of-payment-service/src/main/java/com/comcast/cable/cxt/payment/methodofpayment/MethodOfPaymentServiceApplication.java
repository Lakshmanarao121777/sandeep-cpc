package com.comcast.cable.cxt.payment.methodofpayment;

import com.comcast.xsp.boot.XspApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.netflix.ribbon.RibbonAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class, RibbonAutoConfiguration.class})
@ComponentScan({"com.comcast.cable.cxt.payment.methodofpayment"})
public class MethodOfPaymentServiceApplication extends XspApplication {

    public static void main(String[]args) {
        XspApplication.run(MethodOfPaymentServiceApplication.class,args);
    }
}
