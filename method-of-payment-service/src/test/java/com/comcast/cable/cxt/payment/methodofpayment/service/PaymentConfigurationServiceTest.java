package com.comcast.cable.cxt.payment.methodofpayment.service;

import com.comcast.xsp.connector.core.rest.RestClient;
import com.comcast.xsp.connector.core.rest.RestClientFactory;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.net.SocketTimeoutException;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import com.comcast.cable.cxt.payment.methodofpayment.services.PaymentConfigurationService;
import com.comcast.cable.cxt.payment.methodofpayment.vo.GetPaymentConfigurationResponse;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import static com.comcast.cable.cxt.payment.methodofpayment.MethodOfServiceTestConstants.*;

@RunWith(MockitoJUnitRunner.class)
public class PaymentConfigurationServiceTest {

    @InjectMocks
    private PaymentConfigurationService paymentConfigurationService;

    @Mock
    private RestClientFactory mockRestClientFactory;

    @Mock
    private RestClient mockRestClient;

    private HttpClientErrorException clientErrorException = null;

    private HttpServerErrorException serverErrorException = null;

    private HttpHeaders requestHeader = setUpRequestHeader();

    private ResponseEntity<String> response = null;

    private String errorString = "Default Error String";
    private String paymentConfigurationServiceTestEndpoint = "https://test-api.comcast.net/payment-configuration-test/";
    private String responseBody = "Default Http Response";
    private String paymentConfigurationServiceOverrideError = "{\"messages\":{\"PAYMENT-8322\":\"Customer is blocked from making both credit cards as well as bank accounts payments.\"}}";


    private Map<String, Object> clientConfig = generateTestClientConfig(paymentConfigurationServiceTestEndpoint);

    @Test
    public void getPaymentConfigurationDetailsSuccess() throws Exception {

        response = generateResponse(GET_PAYMENT_CONFIGURATION_CARD_BLOCK_RESPONSE);

        when(mockRestClientFactory.getClient("paymentconfigurationservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        GetPaymentConfigurationResponse paymentConfigurationResponse = paymentConfigurationService.getPaymentConfigurationDetails(requestHeader,
            generateGetPaymentConfigurationRequest(), clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("paymentconfigurationservice");
        assertEquals("SUCCESS", paymentConfigurationResponse.getPaymentConfigurationDetails().getCpcStatus());
        assertEquals(true, paymentConfigurationResponse.getPaymentConfigurationDetails().isCardblockStatus());
        assertEquals(false, paymentConfigurationResponse.getPaymentConfigurationDetails().isBankblockStatus());

    }

    @Test
    public void getPaymentConfigurationDetailsHttpClientErrorException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        Map<String, Object> clientConfig = generateTestClientConfig(paymentConfigurationServiceTestEndpoint);

        clientErrorException = generateHttpClientErrorException(PAYMENT_SERVICE_ERROR_9999);

        when(mockRestClientFactory.getClient("paymentconfigurationservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(clientErrorException);

        GetPaymentConfigurationResponse paymentConfigurationResponse = paymentConfigurationService.getPaymentConfigurationDetails(requestHeader,
            generateGetPaymentConfigurationRequest(), clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("paymentconfigurationservice");
        assertEquals("ERROR", paymentConfigurationResponse.getPaymentConfigurationDetails().getCpcStatus());
        assertEquals("PAYMENT-9999", paymentConfigurationResponse.getPaymentConfigurationDetails().getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", paymentConfigurationResponse.getPaymentConfigurationDetails().getPsErrorMessage());

    }

    @Test
    public void getPaymentConfigurationDetailsHttpClientErrorExceptionOverride() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        Map<String, Object> clientConfig = generateTestClientConfig(paymentConfigurationServiceTestEndpoint);

        clientErrorException = generateHttpClientErrorException(paymentConfigurationServiceOverrideError);

        when(mockRestClientFactory.getClient("paymentconfigurationservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(clientErrorException);

        GetPaymentConfigurationResponse paymentConfigurationResponse = paymentConfigurationService.getPaymentConfigurationDetails(requestHeader,
            generateGetPaymentConfigurationRequest(), clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("paymentconfigurationservice");
        assertEquals("SUCCESS", paymentConfigurationResponse.getPaymentConfigurationDetails().getCpcStatus());
        assertEquals(true, paymentConfigurationResponse.getPaymentConfigurationDetails().isCardblockStatus());
        assertEquals(true, paymentConfigurationResponse.getPaymentConfigurationDetails().isBankblockStatus());

    }

    @Test
    public void getPaymentConfigurationHttpServerErrorException() throws Exception {

        serverErrorException = generateHttpServerErrorException(PAYMENT_SERVICE_ERROR_9999);

        when(mockRestClientFactory.getClient("paymentconfigurationservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(serverErrorException);

        GetPaymentConfigurationResponse paymentConfigurationResponse = paymentConfigurationService.getPaymentConfigurationDetails(requestHeader,
            generateGetPaymentConfigurationRequest(), clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("paymentconfigurationservice");
        assertEquals("ERROR", paymentConfigurationResponse.getPaymentConfigurationDetails().getCpcStatus());
        assertEquals("PAYMENT-9999", paymentConfigurationResponse.getPaymentConfigurationDetails().getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", paymentConfigurationResponse.getPaymentConfigurationDetails().getPsErrorMessage());

    }

    @Test
    public void getPaymentConfigurationResourceAccessException() throws Exception {

        when(mockRestClientFactory.getClient("paymentconfigurationservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new ResourceAccessException(errorString, new SocketTimeoutException()));

        GetPaymentConfigurationResponse paymentConfigurationResponse = paymentConfigurationService.getPaymentConfigurationDetails(requestHeader,
            generateGetPaymentConfigurationRequest(), clientConfig,mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("paymentconfigurationservice");
        assertEquals("ERROR", paymentConfigurationResponse.getPaymentConfigurationDetails().getCpcStatus());
        assertEquals("Time out exception while calling Payment Configuration Service.", paymentConfigurationResponse.getPaymentConfigurationDetails().getPsErrorMessage());

    }

    @Test
    public void getPaymentConfigurationOtherException() throws Exception {

        when(mockRestClientFactory.getClient("paymentconfigurationservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new RuntimeException(errorString));

        GetPaymentConfigurationResponse paymentConfigurationResponse = paymentConfigurationService.getPaymentConfigurationDetails(requestHeader,
            generateGetPaymentConfigurationRequest(), clientConfig,mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("paymentconfigurationservice");
        assertEquals("ERROR", paymentConfigurationResponse.getPaymentConfigurationDetails().getCpcStatus());
        assertEquals("Default Error String", paymentConfigurationResponse.getPaymentConfigurationDetails().getPsErrorMessage());

    }

}
