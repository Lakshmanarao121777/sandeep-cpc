package com.comcast.cable.cxt.payment.paymentContract;

import com.comcast.xsp.boot.XspApplication;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

public class PaymentContractServiceApplicationTests{

    @Test
    public void shouldExtendXspApplication()throws Exception{
        PaymentContractServiceApplication app= new PaymentContractServiceApplication();
        assertTrue(app.getClass().getAnnotatedSuperclass().getType().getTypeName().equals(XspApplication.class.getTypeName()));

    }
}
