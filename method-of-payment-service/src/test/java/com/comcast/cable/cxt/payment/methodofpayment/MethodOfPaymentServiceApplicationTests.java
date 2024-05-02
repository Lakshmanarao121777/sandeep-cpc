package com.comcast.cable.cxt.payment.methodofpayment;

import com.comcast.xsp.boot.XspApplication;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

public class MethodOfPaymentServiceApplicationTests{

    @Test
    public void shouldExtendXspApplication()throws Exception{
        MethodOfPaymentServiceApplication app= new MethodOfPaymentServiceApplication();
        assertTrue(app.getClass().getAnnotatedSuperclass().getType().getTypeName().equals(XspApplication.class.getTypeName()));

    }
}
