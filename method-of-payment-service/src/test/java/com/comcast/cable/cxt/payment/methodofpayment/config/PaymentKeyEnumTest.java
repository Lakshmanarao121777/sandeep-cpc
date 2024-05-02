package com.comcast.cable.cxt.payment.methodofpayment.config;

import org.junit.Test;
import static org.junit.Assert.assertEquals;

import static com.comcast.cable.cxt.payment.methodofpayment.config.PaymentKeyEnum.*;

public class PaymentKeyEnumTest {

    private String environment = "unit-testing";

    @Test
    public void getPaymentKey() {

        String keyName = getKeyName("CONSUMER_INT", environment);

        assertEquals("FUSION_1701", keyName);

    }
    @Test
    public void getPaymentKeyNotConfigured() {

        String keyName = getKeyName("test-channel", environment);

        assertEquals("NO_KEY_CONFIGURED", keyName);

    }
}
