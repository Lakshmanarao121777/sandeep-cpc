package com.comcast.cable.cxt.payment.paymentContract.controllers;

import com.comcast.cable.cxt.payment.paymentContract.config.PaymentContractServiceConfig;
import com.comcast.cable.cxt.payment.paymentContract.controllers.rest.PaymentContractServiceController;
import com.comcast.cable.cxt.payment.paymentContract.domains.PaymentContractService;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.mock;

public class PaymentContractServiceControllerTest{

    @Test
    public void shouldGreet()throws Exception{
        Map<String, String> response= new PaymentContractServiceController(mock(PaymentContractServiceConfig.class)).index();
        assertThat(response.get("message"), startsWith("Service Name - "));
        assertThat(response.get("date"),notNullValue());
    }

    @Test
    public void shouldReturnDomainObjectWithDomainId()throws Exception{
        ResponseEntity<PaymentContractService>domainPojo= new PaymentContractServiceController(mock(PaymentContractServiceConfig.class)).paymentContractService("paymentContractServiceId");
        assertThat(domainPojo.getStatusCode(),is(HttpStatus.OK));
        assertThat(domainPojo.getBody().getPaymentContractServiceId(),is("paymentContractServiceId"));
        }
    }
