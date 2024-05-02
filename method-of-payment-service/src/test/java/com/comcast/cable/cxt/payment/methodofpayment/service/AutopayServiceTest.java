package com.comcast.cable.cxt.payment.methodofpayment.service;

import com.comcast.cable.cxt.payment.methodofpayment.services.AutopayService;
import com.comcast.cable.cxt.payment.methodofpayment.vo.*;
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

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import static com.comcast.cable.cxt.payment.methodofpayment.MethodOfServiceTestConstants.*;

@RunWith(MockitoJUnitRunner.class)
public class AutopayServiceTest {

    @InjectMocks
    private AutopayService autopayService;

    @Mock
    private RestClientFactory mockRestClientFactory;

    @Mock
    private RestClient mockRestClient;

    private AutopayEnrollmentRequest autopayEnrollmentRequest = generateAutopayEnrollmentRequest();

    private HttpClientErrorException clientErrorException = null;

    private HttpServerErrorException serverErrorException = null;

    private HttpHeaders requestHeader = setUpRequestHeader();

    private ResponseEntity<String> response = null;

    private String errorString = "Default Error String";
    private String autopayServiceTestEndpoint = "https://test-autopay-service.xfinity.com/autopay/";
    private String responseBody = "Default Http Response";

    private Map<String, Object> clientConfig = generateTestClientConfig(autopayServiceTestEndpoint);

    @Test
    public void shouldTokenizeWithAutopayBank() throws Exception {

        AddToWalletRequest autopayTokenizeRequest = generateAddToWalletRequest("bank", true, true);
        autopayTokenizeRequest.setEnrollInAutopay(true);

        response = generateResponse(AUTOPAY_BANK_ENROLLMENT_RESPONSE);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AddToWalletResponse autopayTokenizeResponse = autopayService.tokenizeWithAutopay(requestHeader, autopayTokenizeRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("SUCCESS", autopayTokenizeResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("tokenize_with_autopay", autopayTokenizeResponse.getSubmissionDetails().getActionTaken());
        assertEquals(99999999, autopayTokenizeResponse.getAutopayDetails().getAutoPayId());
        assertEquals("TEST_TOKEN", autopayTokenizeResponse.getBankDetails().getToken());
        assertEquals("Checking",autopayTokenizeResponse.getBankDetails().getBankAccountType());

    }

    @Test
    public void shouldTokenizeWithAutopayCard() throws Exception {

        AddToWalletRequest autopayTokenizeRequest = generateAddToWalletRequest("card", true, true);
        autopayTokenizeRequest.setEnrollInAutopay(true);

        response = generateResponse(AUTOPAY_CARD_ENROLLMENT_RESPONSE);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AddToWalletResponse autopayTokenizeResponse = autopayService.tokenizeWithAutopay(requestHeader, autopayTokenizeRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("SUCCESS", autopayTokenizeResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("tokenize_with_autopay", autopayTokenizeResponse.getSubmissionDetails().getActionTaken());
        assertEquals(99999999, autopayTokenizeResponse.getAutopayDetails().getAutoPayId());
        assertEquals("TEST_TOKEN", autopayTokenizeResponse.getCardDetails().getToken());
        assertEquals("Visa",autopayTokenizeResponse.getCardDetails().getCardType());

    }

    @Test
    public void tokenizeWithAutopayHttpClientErrorException() throws Exception {

        AddToWalletRequest autopayTokenizeRequest = generateAddToWalletRequest("card", true, true);
        autopayTokenizeRequest.setEnrollInAutopay(true);

        clientErrorException = generateHttpClientErrorException(PAYMENT_SERVICE_ERROR_9999);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(clientErrorException);

        AddToWalletResponse autopayTokenizeResponse = autopayService.tokenizeWithAutopay(requestHeader, autopayTokenizeRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("tokenize_with_autopay", autopayTokenizeResponse.getSubmissionDetails().getActionTaken());
        assertEquals("ERROR", autopayTokenizeResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("PAYMENT-9999", autopayTokenizeResponse.getSubmissionDetails().getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", autopayTokenizeResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void tokenizeWithAutopayHttpServerErrorException() throws Exception {

        AddToWalletRequest autopayTokenizeRequest = generateAddToWalletRequest("card", true, true);
        autopayTokenizeRequest.setEnrollInAutopay(true);

        serverErrorException = generateHttpServerErrorException(PAYMENT_SERVICE_ERROR_9999);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(serverErrorException);

        AddToWalletResponse autopayTokenizeResponse = autopayService.tokenizeWithAutopay(requestHeader, autopayTokenizeRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("tokenize_with_autopay", autopayTokenizeResponse.getSubmissionDetails().getActionTaken());
        assertEquals("ERROR", autopayTokenizeResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("PAYMENT-9999", autopayTokenizeResponse.getSubmissionDetails().getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", autopayTokenizeResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void tokenizeWithAutopayResourceAccessException() throws Exception {

        AddToWalletRequest autopayTokenizeRequest = generateAddToWalletRequest("card", true, true);
        autopayTokenizeRequest.setEnrollInAutopay(true);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new ResourceAccessException(errorString, new SocketTimeoutException()));

        AddToWalletResponse autopayTokenizeResponse = autopayService.tokenizeWithAutopay(requestHeader, autopayTokenizeRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("ERROR", autopayTokenizeResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("Time out exception while calling Autopay Service.", autopayTokenizeResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void tokenizeWithAutopayOtherException() throws Exception {

        AddToWalletRequest autopayTokenizeRequest = generateAddToWalletRequest("card", true, true);
        autopayTokenizeRequest.setEnrollInAutopay(true);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new RuntimeException(errorString));

        AddToWalletResponse autopayTokenizeResponse = autopayService.tokenizeWithAutopay(requestHeader, autopayTokenizeRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("ERROR", autopayTokenizeResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("Default Error String", autopayTokenizeResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void shouldEnrollBankAutopay() throws Exception {

        autopayEnrollmentRequest.setCardType("");
        autopayEnrollmentRequest.setBankAccountType("Checking");

        response = generateResponse(AUTOPAY_BANK_ENROLLMENT_RESPONSE);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AutopayEnrollmentResponse autopayEnrollmentResponse = autopayService.enrollInAutopay(requestHeader, autopayEnrollmentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("SUCCESS", autopayEnrollmentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("autopay_enroll", autopayEnrollmentResponse.getSubmissionDetails().getActionTaken());
        assertEquals(99999999, autopayEnrollmentResponse.getAutoPayId());
        assertEquals("TEST_TOKEN", autopayEnrollmentResponse.getToken());
        assertEquals("Checking",autopayEnrollmentResponse.getBankAccountType());

    }

    @Test
    public void shouldEnrollCardAutopay() throws Exception {

        autopayEnrollmentRequest.setBankAccountType("");
        autopayEnrollmentRequest.setCardType("Visa");

        response = generateResponse(AUTOPAY_CARD_ENROLLMENT_RESPONSE);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AutopayEnrollmentResponse autopayEnrollmentResponse = autopayService.enrollInAutopay(requestHeader, autopayEnrollmentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("SUCCESS", autopayEnrollmentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("autopay_enroll", autopayEnrollmentResponse.getSubmissionDetails().getActionTaken());
        assertEquals(99999999, autopayEnrollmentResponse.getAutoPayId());
        assertEquals("TEST_TOKEN", autopayEnrollmentResponse.getToken());
        assertEquals("Visa",autopayEnrollmentResponse.getCardType());

    }

    @Test
    public void enrollInAutopayHttpClientErrorException() throws Exception {

        autopayEnrollmentRequest.setCardType("");
        autopayEnrollmentRequest.setBankAccountType("Savings");

        clientErrorException = generateHttpClientErrorException(PAYMENT_SERVICE_ERROR_9999);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(clientErrorException);

        AutopayEnrollmentResponse autopayEnrollmentResponse = autopayService.enrollInAutopay(requestHeader, autopayEnrollmentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("autopay_enroll", autopayEnrollmentResponse.getSubmissionDetails().getActionTaken());
        assertEquals("ERROR", autopayEnrollmentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("PAYMENT-9999", autopayEnrollmentResponse.getSubmissionDetails().getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", autopayEnrollmentResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void enrollInAutopayHttpServerErrorException() throws Exception {

        autopayEnrollmentRequest.setBankAccountType("");
        autopayEnrollmentRequest.setCardType("MasterCard");

        serverErrorException = generateHttpServerErrorException(PAYMENT_SERVICE_ERROR_9999);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(serverErrorException);

        AutopayEnrollmentResponse autopayEnrollmentResponse = autopayService.enrollInAutopay(requestHeader, autopayEnrollmentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("autopay_enroll", autopayEnrollmentResponse.getSubmissionDetails().getActionTaken());
        assertEquals("ERROR", autopayEnrollmentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("PAYMENT-9999", autopayEnrollmentResponse.getSubmissionDetails().getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", autopayEnrollmentResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void enrollInAutopayResourceAccessException() throws Exception {

        autopayEnrollmentRequest.setCardType("");
        autopayEnrollmentRequest.setBankAccountType("Checking");

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new ResourceAccessException(errorString, new IOException()));

        AutopayEnrollmentResponse autopayEnrollmentResponse = autopayService.enrollInAutopay(requestHeader, autopayEnrollmentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("ERROR", autopayEnrollmentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("I/O exception while calling Autopay Service.", autopayEnrollmentResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void enrollInAutopayOtherException() throws Exception {

        autopayEnrollmentRequest.setCardType("");
        autopayEnrollmentRequest.setBankAccountType("Checking");

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new RuntimeException(errorString));

        AutopayEnrollmentResponse autopayEnrollmentResponse = autopayService.enrollInAutopay(requestHeader, autopayEnrollmentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("ERROR", autopayEnrollmentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("Default Error String", autopayEnrollmentResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void shouldWithdrawFromAutopay() throws Exception {

        ResponseEntity<String> response = generateResponse(AUTOPAY_WITHDRAW_RESPONSE);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.DELETE), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AutopayWithdrawResponse autopayWithdrawResponse = autopayService.withdrawFromAutopay(requestHeader, generateAutopayWithdrawRequest(), clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("SUCCESS", autopayWithdrawResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("autopay_withdraw", autopayWithdrawResponse.getSubmissionDetails().getActionTaken());

    }

    @Test
    public void withdrawFromAutopayHttpClientErrorException() throws Exception {

        errorString = PAYMENT_SERVICE_ERROR_9999;
        clientErrorException = generateHttpClientErrorException(errorString);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.DELETE), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(clientErrorException);

        AutopayWithdrawResponse autopayWithdrawResponse = autopayService.withdrawFromAutopay(requestHeader, generateAutopayWithdrawRequest(), clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("autopay_withdraw", autopayWithdrawResponse.getSubmissionDetails().getActionTaken());
        assertEquals("ERROR", autopayWithdrawResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("PAYMENT-9999", autopayWithdrawResponse.getSubmissionDetails().getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", autopayWithdrawResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void withdrawFromAutopayHttpServerErrorException() throws Exception {

        serverErrorException = generateHttpServerErrorException(PAYMENT_SERVICE_ERROR_9999);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.DELETE), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(serverErrorException);

        AutopayWithdrawResponse autopayWithdrawResponse = autopayService.withdrawFromAutopay(requestHeader, generateAutopayWithdrawRequest(), clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("autopay_withdraw", autopayWithdrawResponse.getSubmissionDetails().getActionTaken());
        assertEquals("ERROR", autopayWithdrawResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("PAYMENT-9999", autopayWithdrawResponse.getSubmissionDetails().getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", autopayWithdrawResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void withdrawFromAutopayResourceAccessException() throws Exception {

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.DELETE), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new ResourceAccessException(errorString));

        AutopayWithdrawResponse autopayWithdrawResponse = autopayService.withdrawFromAutopay(requestHeader, generateAutopayWithdrawRequest(), clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("ERROR", autopayWithdrawResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("I/O exception while calling Autopay Service.", autopayWithdrawResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void withdrawFromAutopayOtherException() throws Exception {

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.DELETE), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new RuntimeException(errorString));

        AutopayWithdrawResponse autopayWithdrawResponse = autopayService.withdrawFromAutopay(requestHeader, generateAutopayWithdrawRequest(), clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("autopayservice");
        assertEquals("ERROR", autopayWithdrawResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("Default Error String", autopayWithdrawResponse.getSubmissionDetails().getPsErrorMessage());

    }

}
