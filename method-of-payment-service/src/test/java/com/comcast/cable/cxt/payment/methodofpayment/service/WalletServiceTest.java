package com.comcast.cable.cxt.payment.methodofpayment.service;

import com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants;
import com.comcast.cable.cxt.payment.methodofpayment.services.WalletService;
import com.comcast.cable.cxt.payment.methodofpayment.vo.*;
import com.comcast.xsp.connector.core.rest.RestClient;
import com.comcast.xsp.connector.core.rest.RestClientFactory;
import com.google.gson.Gson;
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
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.Map;

import static com.comcast.cable.cxt.payment.methodofpayment.MethodOfServiceTestConstants.*;
import static com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants.*;
import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

@RunWith(MockitoJUnitRunner.class)
public class WalletServiceTest {

    @InjectMocks
    private WalletService walletService;

    @Mock
    private RestClientFactory mockRestClientFactory;

    @Mock
    private RestClient mockRestClient;

    private String errorString = "Default Error String";
    private String responseBody = "Default Http Response";
    private String walletServiceEndpoint = "https://test-wallet-service.xfinity.com/";

    private Map<String, Object> clientConfig = generateTestClientConfig(walletServiceEndpoint);

    @Test
    public void testResourceAccessException() throws Exception {

        IOException ioException = new IOException();
        SocketTimeoutException socketTimeoutException = new SocketTimeoutException();
        ResourceAccessException resourceAccessException = new ResourceAccessException("test", socketTimeoutException);

        if(resourceAccessException.getCause() instanceof SocketTimeoutException) {
            System.out.println("Time Out");
        } else if(resourceAccessException.getCause() instanceof IOException) {
            System.out.println(" I/O Error");
        } else {
            System.out.println(resourceAccessException.getMessage());
        }
    }

    @Test
    public void shouldAddCardToWalletUnauthChannel() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        requestHeader.set(MethodOfServiceConstants.PARAM_CHANNEL, "channel-test");
        requestHeader.remove(MethodOfServiceConstants.PARAM_AUTHORIZATION);

        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", true, true);

        responseBody = POST_CARD_TO_WALLET_RESPONSE;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.POST), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AddToWalletResponse addToWallet = walletService.addPaymentInstrumentToWallet(requestHeader, addToWalletRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("tokenize", addToWallet.getSubmissionDetails().getActionTaken());
        assertEquals("SUCCESS", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals("card", addToWallet.getSubmissionDetails().getMethodOfPaymentType());
        assertEquals(true, addToWallet.getCardDetails().isDefaultInstrument());
        assertEquals("TEST_TOKEN", addToWallet.getCardDetails().getToken());
        assertEquals("************4448", addToWallet.getCardDetails().getMaskedCardNumber());
        assertEquals("firstName", addToWallet.getCustomerDetails().getFirstName());
        assertEquals("lastName", addToWallet.getCustomerDetails().getLastName());

    }

    @Test
    public void testAddCardToWalletUnauthLiteChannelDefaultToken() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        requestHeader.set(MethodOfServiceConstants.PARAM_CHANNEL, "lite-channel-test");
        requestHeader.remove(MethodOfServiceConstants.PARAM_AUTHORIZATION);

        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", true, false);

        responseBody = POST_CARD_TO_WALLET_RESPONSE;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.POST), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AddToWalletResponse addToWallet = walletService.addPaymentInstrumentToWallet(requestHeader, addToWalletRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("tokenize", addToWallet.getSubmissionDetails().getActionTaken());
        assertEquals("SUCCESS", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals("card", addToWallet.getSubmissionDetails().getMethodOfPaymentType());
        assertEquals(true, addToWallet.getCardDetails().isDefaultInstrument());
        assertEquals("TEST_TOKEN", addToWallet.getCardDetails().getToken());
        assertEquals("************4448", addToWallet.getCardDetails().getMaskedCardNumber());
        assertEquals("firstName", addToWallet.getCustomerDetails().getFirstName());
        assertEquals("lastName", addToWallet.getCustomerDetails().getLastName());

    }

    @Test
    public void shouldAddCardToWalletUnauthChannelNoDefaultInstrumentSet() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        requestHeader.set(MethodOfServiceConstants.PARAM_CHANNEL, "channel-test");
        requestHeader.remove(MethodOfServiceConstants.PARAM_AUTHORIZATION);

        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", false, true);

        responseBody = POST_CARD_TO_WALLET_RESPONSE;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.POST), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AddToWalletResponse addToWallet = walletService.addPaymentInstrumentToWallet(requestHeader, addToWalletRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("tokenize", addToWallet.getSubmissionDetails().getActionTaken());
        assertEquals("SUCCESS", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals("card", addToWallet.getSubmissionDetails().getMethodOfPaymentType());
        assertEquals(false, addToWallet.getCardDetails().isDefaultInstrument());
        assertEquals("TEST_TOKEN", addToWallet.getCardDetails().getToken());
        assertEquals("************4448", addToWallet.getCardDetails().getMaskedCardNumber());
        assertEquals("firstName", addToWallet.getCustomerDetails().getFirstName());
        assertEquals("lastName", addToWallet.getCustomerDetails().getLastName());

    }

    @Test
    public void shouldAddCardToWalletAuthChannelDefaultInstrumentStoreToken() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();

        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", true, true);

        responseBody = POST_CARD_TO_WALLET_RESPONSE;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.POST), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AddToWalletResponse addToWallet = walletService.addPaymentInstrumentToWallet(requestHeader, addToWalletRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("TEST_CUSTOMER_GUID", addToWallet.getCustomerId());
        assertEquals("tokenize", addToWallet.getSubmissionDetails().getActionTaken());
        assertEquals("SUCCESS", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals("card", addToWallet.getSubmissionDetails().getMethodOfPaymentType());
        assertEquals(true, addToWallet.getCardDetails().isDefaultInstrument());
        assertEquals("TEST_TOKEN", addToWallet.getCardDetails().getToken());
        assertEquals("************4448", addToWallet.getCardDetails().getMaskedCardNumber());
        assertEquals("firstName", addToWallet.getCustomerDetails().getFirstName());
        assertEquals("lastName", addToWallet.getCustomerDetails().getLastName());

    }

    @Test
    public void shouldAddCardToWalletAuthChannelDefaultInstrumentTempToken() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();

        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", true, false);

        responseBody = POST_CARD_TO_WALLET_RESPONSE;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.POST), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AddToWalletResponse addToWallet = walletService.addPaymentInstrumentToWallet(requestHeader, addToWalletRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("TEST_CUSTOMER_GUID", addToWallet.getCustomerId());
        assertEquals("tokenize", addToWallet.getSubmissionDetails().getActionTaken());
        assertEquals("SUCCESS", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals("card", addToWallet.getSubmissionDetails().getMethodOfPaymentType());
        assertEquals(true, addToWallet.getCardDetails().isDefaultInstrument());
        assertEquals("TEST_TOKEN", addToWallet.getCardDetails().getToken());
        assertEquals("************4448", addToWallet.getCardDetails().getMaskedCardNumber());
        assertEquals("firstName", addToWallet.getCustomerDetails().getFirstName());
        assertEquals("lastName", addToWallet.getCustomerDetails().getLastName());

    }

    @Test
    public void shouldAddCardToWalletAuthChannelNotDefaultInstrumentStoreToken() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();

        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", false, true);

        responseBody = POST_CARD_TO_WALLET_RESPONSE;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.POST), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AddToWalletResponse addToWallet = walletService.addPaymentInstrumentToWallet(requestHeader, addToWalletRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("TEST_CUSTOMER_GUID", addToWallet.getCustomerId());
        assertEquals("tokenize", addToWallet.getSubmissionDetails().getActionTaken());
        assertEquals("SUCCESS", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals("card", addToWallet.getSubmissionDetails().getMethodOfPaymentType());
        assertEquals(false, addToWallet.getCardDetails().isDefaultInstrument());
        assertEquals("TEST_TOKEN", addToWallet.getCardDetails().getToken());
        assertEquals("************4448", addToWallet.getCardDetails().getMaskedCardNumber());
        assertEquals("firstName", addToWallet.getCustomerDetails().getFirstName());
        assertEquals("lastName", addToWallet.getCustomerDetails().getLastName());

    }

    @Test
    public void shouldAddCardToWalletAuthChannelNotDefaultInstrumentTempToken() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();

        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", false, false);
        addToWalletRequest.setStorePaymentInstrumentLongTerm(false);

        responseBody = POST_CARD_TO_WALLET_RESPONSE;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.POST), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AddToWalletResponse addToWallet = walletService.addPaymentInstrumentToWallet(requestHeader, addToWalletRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("TEST_CUSTOMER_GUID", addToWallet.getCustomerId());
        assertEquals("tokenize", addToWallet.getSubmissionDetails().getActionTaken());
        assertEquals("SUCCESS", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals("card", addToWallet.getSubmissionDetails().getMethodOfPaymentType());
        assertEquals(false, addToWallet.getCardDetails().isDefaultInstrument());
        assertEquals("TEST_TOKEN", addToWallet.getCardDetails().getToken());
        assertEquals("************4448", addToWallet.getCardDetails().getMaskedCardNumber());
        assertEquals("firstName", addToWallet.getCustomerDetails().getFirstName());
        assertEquals("lastName", addToWallet.getCustomerDetails().getLastName());

    }

    @Test
    public void addToWalletHttpClientErrorException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", true, true);

        errorString = PAYMENT_SERVICE_ERROR_9999;

        HttpClientErrorException httpClientErrorException = generateHttpClientErrorException(errorString);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.POST), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(httpClientErrorException);

        AddToWalletResponse addToWallet = walletService.addPaymentInstrumentToWallet(requestHeader, addToWalletRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("tokenize", addToWallet.getSubmissionDetails().getActionTaken());
        assertEquals("ERROR", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals("PAYMENT-9999", addToWallet.getSubmissionDetails().getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", addToWallet.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void addToWalletHttpServerErrorException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", true, true);

        errorString = PAYMENT_SERVICE_ERROR_9999;

        HttpServerErrorException httpServerErrorException = generateHttpServerErrorException(errorString);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.POST), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(httpServerErrorException);

        AddToWalletResponse addToWallet = walletService.addPaymentInstrumentToWallet(requestHeader, addToWalletRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("tokenize", addToWallet.getSubmissionDetails().getActionTaken());
        assertEquals("ERROR", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals("PAYMENT-9999", addToWallet.getSubmissionDetails().getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", addToWallet.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void addToWalletResourceAccessException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", true, true);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.POST), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new ResourceAccessException(errorString, new IOException()));

        AddToWalletResponse addToWallet = walletService.addPaymentInstrumentToWallet(requestHeader, addToWalletRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals("I/O exception while calling Wallet Service.", addToWallet.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void addToWalletOtherException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", true, true);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.POST), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new RuntimeException(errorString));

        AddToWalletResponse addToWallet = walletService.addPaymentInstrumentToWallet(requestHeader, addToWalletRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals("Default Error String", addToWallet.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void addCardToWalletNullCustomerId() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        requestHeader.set(MethodOfServiceConstants.PARAM_CHANNEL, "lite-channel-test");
        requestHeader.remove(MethodOfServiceConstants.PARAM_AUTHORIZATION);

        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", true, true);
        addToWalletRequest.setChannel("lite-channel-test");
        addToWalletRequest.setCustomerId(null);

        AddToWalletResponse addToWallet = walletService.addPaymentInstrumentToWallet(requestHeader, addToWalletRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(0)).getClient("walletservice");
        assertEquals("tokenize", addToWallet.getSubmissionDetails().getActionTaken());
        assertEquals("ERROR", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals(null, addToWallet.getSubmissionDetails().getPsErrorCode());
        assertEquals("A valid walletId is required to perform this action.  Please contact system administrator.",
            addToWallet.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void addCardToWalletEmptyCustomerId() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        requestHeader.set(MethodOfServiceConstants.PARAM_CHANNEL, "lite-channel-test");
        requestHeader.remove(MethodOfServiceConstants.PARAM_AUTHORIZATION);

        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", true, true);
        addToWalletRequest.setChannel("lite-channel-test");
        addToWalletRequest.setCustomerId("");

        AddToWalletResponse addToWallet = walletService.addPaymentInstrumentToWallet(requestHeader, addToWalletRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(0)).getClient("walletservice");
        assertEquals("tokenize", addToWallet.getSubmissionDetails().getActionTaken());
        assertEquals("ERROR", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals(null, addToWallet.getSubmissionDetails().getPsErrorCode());
        assertEquals("A valid walletId is required to perform this action.  Please contact system administrator.",
            addToWallet.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void addCardToWalletUnauthLiteChannelStoreLongTerm() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        requestHeader.set(MethodOfServiceConstants.PARAM_CHANNEL, "lite-channel-test");
        requestHeader.remove(MethodOfServiceConstants.PARAM_AUTHORIZATION);

        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", true, true);
        addToWalletRequest.setChannel("lite-channel-test");

        responseBody = POST_CARD_TO_WALLET_RESPONSE;
        ResponseEntity<String> response = generateResponse(responseBody);

         when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
         when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.POST), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AddToWalletResponse addToWallet = walletService.addPaymentInstrumentToWallet(requestHeader, addToWalletRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("tokenize", addToWallet.getSubmissionDetails().getActionTaken());
        assertEquals("SUCCESS", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals(null, addToWallet.getSubmissionDetails().getPsErrorCode());
        assertEquals(null, addToWallet.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void shouldDeleteExistingCardPaymentInstrument() throws Exception {
        HttpHeaders requestHeader = setUpRequestHeader();

        DeleteExistingPaymentInstrumentRequest deleteExistingPaymentInstrumentRequest = generateDeleteExistingPaymentInstrumentRequest("card");

        responseBody = DELETE_WALLET_RESPONSE_SUCCESS;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.DELETE), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        DeleteExistingPaymentInstrumentResponse deleteExistingPaymentInstrumentResponse =
            walletService.deleteExistingPaymentInstrument(requestHeader, deleteExistingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("delete", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getActionTaken());
        assertEquals("card", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getMethodOfPaymentType());
        assertEquals("SUCCESS", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("TEST_TOKEN", deleteExistingPaymentInstrumentResponse.getCardDetails().getToken());
        assertEquals("Visa", deleteExistingPaymentInstrumentResponse.getCardDetails().getCardType());

    }

    @Test
    public void shouldDeleteExistingBankPaymentInstrument() throws Exception {
        HttpHeaders requestHeader = setUpRequestHeader();

        DeleteExistingPaymentInstrumentRequest deleteExistingPaymentInstrumentRequest = generateDeleteExistingPaymentInstrumentRequest("bank");

        responseBody = DELETE_WALLET_RESPONSE_SUCCESS;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.DELETE), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        DeleteExistingPaymentInstrumentResponse deleteExistingPaymentInstrumentResponse =
            walletService.deleteExistingPaymentInstrument(requestHeader, deleteExistingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("delete", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getActionTaken());
        assertEquals("bank", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getMethodOfPaymentType());
        assertEquals("SUCCESS", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("TEST_TOKEN", deleteExistingPaymentInstrumentResponse.getBankDetails().getToken());
        assertEquals("Checking", deleteExistingPaymentInstrumentResponse.getBankDetails().getBankAccountType());

    }

    @Test
    public void deleteExistingPaymentInstrumentHttpClientErrorException() throws Exception {
        HttpHeaders requestHeader = setUpRequestHeader();
        DeleteExistingPaymentInstrumentRequest deleteExistingPaymentInstrumentRequest = generateDeleteExistingPaymentInstrumentRequest("card");

        errorString = PAYMENT_SERVICE_ERROR_9999;
        HttpClientErrorException httpClientErrorException = generateHttpClientErrorException(errorString);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.DELETE), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(httpClientErrorException);

        DeleteExistingPaymentInstrumentResponse deleteExistingPaymentInstrumentResponse =
            walletService.deleteExistingPaymentInstrument(requestHeader, deleteExistingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("PAYMENT-9999", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void deleteExistingPaymentInstrumentHttpServerErrorException() throws Exception {
        HttpHeaders requestHeader = setUpRequestHeader();
        DeleteExistingPaymentInstrumentRequest deleteExistingPaymentInstrumentRequest = generateDeleteExistingPaymentInstrumentRequest("card");

        errorString = PAYMENT_SERVICE_ERROR_9999;
        HttpServerErrorException httpServerErrorException = generateHttpServerErrorException(errorString);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.DELETE), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(httpServerErrorException);

        DeleteExistingPaymentInstrumentResponse deleteExistingPaymentInstrumentResponse =
            walletService.deleteExistingPaymentInstrument(requestHeader, deleteExistingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("PAYMENT-9999", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void deleteExistingPaymentInstrumentResourceAccessException() throws Exception {
        HttpHeaders requestHeader = setUpRequestHeader();
        DeleteExistingPaymentInstrumentRequest deleteExistingPaymentInstrumentRequest = generateDeleteExistingPaymentInstrumentRequest("card");

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.DELETE), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new ResourceAccessException(errorString, new SocketTimeoutException()));

        DeleteExistingPaymentInstrumentResponse deleteExistingPaymentInstrumentResponse =
            walletService.deleteExistingPaymentInstrument(requestHeader, deleteExistingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("Time out exception while calling Wallet Service.", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void deleteExistingPaymentInstrumentOtherException() throws Exception {
        HttpHeaders requestHeader = setUpRequestHeader();
        DeleteExistingPaymentInstrumentRequest deleteExistingPaymentInstrumentRequest = generateDeleteExistingPaymentInstrumentRequest("card");

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.DELETE), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new RuntimeException(errorString));

        DeleteExistingPaymentInstrumentResponse deleteExistingPaymentInstrumentResponse =
            walletService.deleteExistingPaymentInstrument(requestHeader, deleteExistingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("Default Error String", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void shouldRetrieveAllPaymentInstruments() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetAllPaymentInstrumentsRequest allPaymentInstrumentsRequest = generateGetAllPaymentInstrumentsRequest();

        responseBody = GET_WALLET_RESPONSE_ALL_INSTRUMENTS;

        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        GetAllPaymentInstrumentsResponse allPaymentInstrumentsResponse =
            walletService.getAllPaymentInstruments(requestHeader, allPaymentInstrumentsRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("SUCCESS", allPaymentInstrumentsResponse.getCpcStatus());
        assertEquals("TEST_BANK_CHECKING_TOKEN", allPaymentInstrumentsResponse.getCustomerWalletDetails().getBanks().get(0).getToken());
        assertEquals("Checking", allPaymentInstrumentsResponse.getCustomerWalletDetails().getBanks().get(0).getAccountType());
        assertEquals("***9999", allPaymentInstrumentsResponse.getCustomerWalletDetails().getBanks().get(0).getMaskedAccountNumber());
        assertEquals("TEST_CARD_MASTERCARD_TOKEN", allPaymentInstrumentsResponse.getCustomerWalletDetails().getPaymentCards().get(1).getToken());
        assertEquals("MasterCard", allPaymentInstrumentsResponse.getCustomerWalletDetails().getPaymentCards().get(1).getCardType());
        assertEquals("************4472", allPaymentInstrumentsResponse.getCustomerWalletDetails().getPaymentCards().get(1).getMaskedCardNumber());
        assertEquals("1222", allPaymentInstrumentsResponse.getCustomerWalletDetails().getPaymentCards().get(1).getExpirationDate());

    }

    @Test
    public void shouldRetrieveAllPaymentInstrumentsMultiUser() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetAllPaymentInstrumentsRequest allPaymentInstrumentsMultiUserRequest = generateGetAllPaymentInstrumentsMultiUserRequest();

        String user1ResponseBody = GET_WALLET_RESPONSE_MULTI_USER1;
        String user2ResponseBody = GET_WALLET_RESPONSE_MULTI_USER2;

        ResponseEntity<String> user1Response = generateResponse(user1ResponseBody);
        ResponseEntity<String> user2Response = generateResponse(user2ResponseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(user1Response).thenReturn(user2Response);

        GetAllPaymentInstrumentsResponse allPaymentInstrumentsResponse =
            walletService.getAllPaymentInstruments(requestHeader, allPaymentInstrumentsMultiUserRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(2)).getClient("walletservice");
        assertEquals("SUCCESS", allPaymentInstrumentsResponse.getCpcStatus());
        assertEquals("WALLET_TEST|TEST_WALLET", allPaymentInstrumentsResponse.getCustomerWalletDetails().getWalletId());
        assertEquals("TEST_BANK_TOKEN", allPaymentInstrumentsResponse.getCustomerWalletDetails().getBanks().get(1).getToken());
        assertEquals("Savings", allPaymentInstrumentsResponse.getCustomerWalletDetails().getBanks().get(1).getAccountType());
        assertEquals("***4321", allPaymentInstrumentsResponse.getCustomerWalletDetails().getBanks().get(1).getMaskedAccountNumber());
        assertEquals("TEST_CUSTOMER_ID", allPaymentInstrumentsResponse.getCustomerWalletDetails().getBanks().get(1).getCustomerId());
        assertEquals("CARD_TEST_TOKEN", allPaymentInstrumentsResponse.getCustomerWalletDetails().getPaymentCards().get(0).getToken());
        assertEquals("Visa", allPaymentInstrumentsResponse.getCustomerWalletDetails().getPaymentCards().get(0).getCardType());
        assertEquals("************7890", allPaymentInstrumentsResponse.getCustomerWalletDetails().getPaymentCards().get(0).getMaskedCardNumber());
        assertEquals("1223", allPaymentInstrumentsResponse.getCustomerWalletDetails().getPaymentCards().get(0).getExpirationDate());
        assertEquals("CUSTOMER_ID_TEST", allPaymentInstrumentsResponse.getCustomerWalletDetails().getPaymentCards().get(0).getCustomerId());

    }

    @Test
    public void getAllPaymentInstrumentsMultiUserSuccessAndHttpError() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetAllPaymentInstrumentsRequest allPaymentInstrumentsMultiUserRequest = generateGetAllPaymentInstrumentsMultiUserRequest();

        String responseBody = GET_WALLET_RESPONSE_MULTI_USER1;
        String errorString = PAYMENT_SERVICE_ERROR_8000;

        ResponseEntity<String> user1Response = generateResponse(responseBody);
        HttpClientErrorException httpClientErrorException = generateHttpClientErrorException(errorString);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(user1Response).thenThrow(httpClientErrorException);

        GetAllPaymentInstrumentsResponse allPaymentInstrumentsResponse =
            walletService.getAllPaymentInstruments(requestHeader, allPaymentInstrumentsMultiUserRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(2)).getClient("walletservice");
        assertEquals("SUCCESS", allPaymentInstrumentsResponse.getCpcStatus());
        assertEquals("WALLET_TEST", allPaymentInstrumentsResponse.getCustomerWalletDetails().getWalletId());
        assertEquals("BANK_TEST_TOKEN", allPaymentInstrumentsResponse.getCustomerWalletDetails().getBanks().get(0).getToken());
        assertEquals("Checking", allPaymentInstrumentsResponse.getCustomerWalletDetails().getBanks().get(0).getAccountType());
        assertEquals("***5678", allPaymentInstrumentsResponse.getCustomerWalletDetails().getBanks().get(0).getMaskedAccountNumber());
        assertEquals("CARD_TEST_TOKEN", allPaymentInstrumentsResponse.getCustomerWalletDetails().getPaymentCards().get(0).getToken());
        assertEquals("Visa", allPaymentInstrumentsResponse.getCustomerWalletDetails().getPaymentCards().get(0).getCardType());
        assertEquals("************7890", allPaymentInstrumentsResponse.getCustomerWalletDetails().getPaymentCards().get(0).getMaskedCardNumber());
        assertEquals("1223", allPaymentInstrumentsResponse.getCustomerWalletDetails().getPaymentCards().get(0).getExpirationDate());
        assertEquals("PAYMENT-8000", allPaymentInstrumentsResponse.getPsErrorCode());
        assertEquals("Customer Id: TEST_CUSTOMER_ID - Unable to communicate with Payment Service.", allPaymentInstrumentsResponse.getPsErrorMessage());

    }

    @Test
    public void getAllPaymentInstrumentsMultiUserSuccessAndEmptySuccess() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetAllPaymentInstrumentsRequest allPaymentInstrumentsMultiUserRequest = generateGetAllPaymentInstrumentsMultiUserRequest();

        String responseBody = GET_WALLET_RESPONSE_MULTI_USER1;
        String emptyResponseBody = EMPTY_PS_RESPONSE;

        ResponseEntity<String> user1Response = generateResponse(responseBody);
        ResponseEntity<String> user2Response = generateResponse(emptyResponseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(user1Response).thenReturn(user2Response);

        GetAllPaymentInstrumentsResponse allPaymentInstrumentsResponse =
            walletService.getAllPaymentInstruments(requestHeader, allPaymentInstrumentsMultiUserRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(2)).getClient("walletservice");
        assertEquals("SUCCESS", allPaymentInstrumentsResponse.getCpcStatus());
        assertEquals("WALLET_TEST", allPaymentInstrumentsResponse.getCustomerWalletDetails().getWalletId());
        assertEquals("BANK_TEST_TOKEN", allPaymentInstrumentsResponse.getCustomerWalletDetails().getBanks().get(0).getToken());
        assertEquals("Checking", allPaymentInstrumentsResponse.getCustomerWalletDetails().getBanks().get(0).getAccountType());
        assertEquals("***5678", allPaymentInstrumentsResponse.getCustomerWalletDetails().getBanks().get(0).getMaskedAccountNumber());
        assertEquals("CPC_INTERNAL_ERR", allPaymentInstrumentsResponse.getPsErrorCode());
        assertEquals("Payment instrument(s) not returned for customer id: TEST_CUSTOMER_ID.", allPaymentInstrumentsResponse.getPsErrorMessage());

    }

    @Test
    public void getAllPaymentInstrumentsMultiUserAllEmptySuccess() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetAllPaymentInstrumentsRequest allPaymentInstrumentsMultiUserRequest = generateGetAllPaymentInstrumentsMultiUserRequest();

        String noPaymentInstrumentResponseBody = WALLET_RESPONSE_EMPTY_WALLET;
        String emptyResponseBody = WALLET_RESPONSE_NO_PAYMENT_INSTRUMENTS;

        ResponseEntity<String> user1Response = generateResponse(noPaymentInstrumentResponseBody);
        ResponseEntity<String> user2Response = generateResponse(emptyResponseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(user1Response).thenReturn(user2Response);

        GetAllPaymentInstrumentsResponse allPaymentInstrumentsResponse =
            walletService.getAllPaymentInstruments(requestHeader, allPaymentInstrumentsMultiUserRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(2)).getClient("walletservice");
        assertEquals("ERROR", allPaymentInstrumentsResponse.getCpcStatus());
        assertEquals("CPC_INTERNAL_ERR", allPaymentInstrumentsResponse.getPsErrorCode());
        assertEquals("Payment instrument(s) not returned for customer id: CUSTOMER_ID_TEST.|Payment instrument(s) not returned for customer id: TEST_CUSTOMER_ID.", allPaymentInstrumentsResponse.getPsErrorMessage());

    }

    @Test
    public void getAllPaymentInstrumentsMultiUserAllHttpError() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetAllPaymentInstrumentsRequest allPaymentInstrumentsMultiUserRequest = generateGetAllPaymentInstrumentsMultiUserRequest();

        String errorString1 = PAYMENT_SERVICE_ERROR_9999;
        String errorString2 = PAYMENT_SERVICE_ERROR_8000;

        HttpClientErrorException httpClientErrorException1 = generateHttpClientErrorException(errorString1);
        HttpClientErrorException httpClientErrorException2 = generateHttpClientErrorException(errorString2);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(httpClientErrorException1).thenThrow(httpClientErrorException2);

        GetAllPaymentInstrumentsResponse allPaymentInstrumentsResponse =
            walletService.getAllPaymentInstruments(requestHeader, allPaymentInstrumentsMultiUserRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(2)).getClient("walletservice");
        assertEquals("ERROR", allPaymentInstrumentsResponse.getCpcStatus());
        assertEquals("PAYMENT-9999|PAYMENT-8000", allPaymentInstrumentsResponse.getPsErrorCode());
        assertEquals("Customer Id: CUSTOMER_ID_TEST - Failed to process transaction. Please try again later.|Customer Id: TEST_CUSTOMER_ID - Unable to communicate with Payment Service.", allPaymentInstrumentsResponse.getPsErrorMessage());

    }

    @Test
    public void getAllPaymentInstrumentsMultiUserMultipleErrorTypes() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetAllPaymentInstrumentsRequest allPaymentInstrumentsMultiUserRequest = generateGetAllPaymentInstrumentsMultiUserRequest();

        errorString = PAYMENT_SERVICE_ERROR_9999;

        HttpClientErrorException httpClientErrorException = generateHttpClientErrorException(errorString);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(httpClientErrorException).thenThrow(new ResourceAccessException(errorString));

        GetAllPaymentInstrumentsResponse allPaymentInstrumentsResponse =
            walletService.getAllPaymentInstruments(requestHeader, allPaymentInstrumentsMultiUserRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(2)).getClient("walletservice");
        assertEquals("ERROR", allPaymentInstrumentsResponse.getCpcStatus());
        assertEquals("PAYMENT-9999|CPC_INTERNAL_ERR", allPaymentInstrumentsResponse.getPsErrorCode());
        assertEquals("Customer Id: CUSTOMER_ID_TEST - Failed to process transaction. Please try again later.|Customer Id: TEST_CUSTOMER_ID - I/O exception while calling Wallet Service.", allPaymentInstrumentsResponse.getPsErrorMessage());

    }

    @Test
    public void getAllPaymentInstrumentsMultiUserErrorAndEmptySuccess() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetAllPaymentInstrumentsRequest allPaymentInstrumentsMultiUserRequest = generateGetAllPaymentInstrumentsMultiUserRequest();

        String noPaymentInstrumentResponseBody = WALLET_RESPONSE_EMPTY_WALLET;
        errorString = PAYMENT_SERVICE_ERROR_9999;

        ResponseEntity<String> user1Response = generateResponse(noPaymentInstrumentResponseBody);
        HttpClientErrorException httpClientErrorException = generateHttpClientErrorException(errorString);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(user1Response).thenThrow(httpClientErrorException);

        GetAllPaymentInstrumentsResponse allPaymentInstrumentsResponse =
            walletService.getAllPaymentInstruments(requestHeader, allPaymentInstrumentsMultiUserRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(2)).getClient("walletservice");
        assertEquals("ERROR", allPaymentInstrumentsResponse.getCpcStatus());
        assertEquals("CPC_INTERNAL_ERR|PAYMENT-9999", allPaymentInstrumentsResponse.getPsErrorCode());
        assertEquals("Payment instrument(s) not returned for customer id: CUSTOMER_ID_TEST.|Customer Id: TEST_CUSTOMER_ID - Failed to process transaction. Please try again later.", allPaymentInstrumentsResponse.getPsErrorMessage());

    }

    @Test
    public void getAllPaymentInstrumentsHttpClientErrorException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetAllPaymentInstrumentsRequest allPaymentInstrumentsRequest = generateGetAllPaymentInstrumentsRequest();

        errorString = PAYMENT_SERVICE_ERROR_9999;
        HttpClientErrorException httpClientErrorException = generateHttpClientErrorException(errorString);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(httpClientErrorException);

        GetAllPaymentInstrumentsResponse allPaymentInstrumentsResponse =
            walletService.getAllPaymentInstruments(requestHeader, allPaymentInstrumentsRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", allPaymentInstrumentsResponse.getCpcStatus());
        assertEquals("PAYMENT-9999", allPaymentInstrumentsResponse.getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", allPaymentInstrumentsResponse.getPsErrorMessage());

    }

    @Test
    public void getAllPaymentInstrumentsHttpServerErrorException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetAllPaymentInstrumentsRequest allPaymentInstrumentsRequest = generateGetAllPaymentInstrumentsRequest();

        errorString = PAYMENT_SERVICE_ERROR_9999;
        HttpServerErrorException httpServerErrorException = generateHttpServerErrorException(errorString);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(httpServerErrorException);

        GetAllPaymentInstrumentsResponse allPaymentInstrumentsResponse =
            walletService.getAllPaymentInstruments(requestHeader, allPaymentInstrumentsRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", allPaymentInstrumentsResponse.getCpcStatus());
        assertEquals("PAYMENT-9999", allPaymentInstrumentsResponse.getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", allPaymentInstrumentsResponse.getPsErrorMessage());

    }

    @Test
    public void getAllPaymentInstrumentsResourceAccessException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetAllPaymentInstrumentsRequest allPaymentInstrumentsRequest = generateGetAllPaymentInstrumentsRequest();

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new ResourceAccessException(errorString));

        GetAllPaymentInstrumentsResponse getAllPaymentInstrumentsResponse =
            walletService.getAllPaymentInstruments(requestHeader, allPaymentInstrumentsRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", getAllPaymentInstrumentsResponse.getCpcStatus());
        assertEquals("I/O exception while calling Wallet Service.", getAllPaymentInstrumentsResponse.getPsErrorMessage());

    }

    @Test
    public void getAllPaymentInstrumentsOtherException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetAllPaymentInstrumentsRequest allPaymentInstrumentsRequest = generateGetAllPaymentInstrumentsRequest();

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new RuntimeException(errorString));

        GetAllPaymentInstrumentsResponse getAllPaymentInstrumentsResponse =
            walletService.getAllPaymentInstruments(requestHeader, allPaymentInstrumentsRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", getAllPaymentInstrumentsResponse.getCpcStatus());
        assertEquals("Default Error String", getAllPaymentInstrumentsResponse.getPsErrorMessage());

    }

    @Test
    public void shouldRetrieveExistingCardPaymentInstrument() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetExistingPaymentInstrumentRequest existingPaymentInstrumentRequest = generateGetExistingPaymentInstrumentRequest();

        responseBody = GET_WALLET_RESPONSE_CARD_ONLY;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        GetExistingPaymentInstrumentResponse existingPaymentInstrumentResponse =
            walletService.getExistingPaymentInstrument(requestHeader, existingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("SUCCESS", existingPaymentInstrumentResponse.getCpcStatus());
        assertEquals("TEST_CARD_VISA_TOKEN", existingPaymentInstrumentResponse.getWalletCardDetails().getToken());
        assertEquals("Visa", existingPaymentInstrumentResponse.getWalletCardDetails().getCardType());
        assertEquals("************4448", existingPaymentInstrumentResponse.getWalletCardDetails().getMaskedCardNumber());
        assertEquals("1222", existingPaymentInstrumentResponse.getWalletCardDetails().getExpirationDate());

    }

    @Test
    public void shouldRetrieveExistingBankPaymentInstrument() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetExistingPaymentInstrumentRequest existingPaymentInstrumentRequest = generateGetExistingPaymentInstrumentRequest();

        responseBody = GET_WALLET_RESPONSE_BANK_ONLY;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        GetExistingPaymentInstrumentResponse existingPaymentInstrumentResponse =
            walletService.getExistingPaymentInstrument(requestHeader, existingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("SUCCESS", existingPaymentInstrumentResponse.getCpcStatus());
        assertEquals("TEST_BANK_CHECKING_TOKEN", existingPaymentInstrumentResponse.getWalletBankDetails().getToken());
        assertEquals("Checking", existingPaymentInstrumentResponse.getWalletBankDetails().getAccountType());
        assertEquals("***9999", existingPaymentInstrumentResponse.getWalletBankDetails().getMaskedAccountNumber());

    }

    @Test
    public void getExistingBankPaymentInstrumentBankExclusion() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        requestHeader.set(MethodOfServiceConstants.PARAM_CHANNEL, "test-bank-exclude-channel");
        GetExistingPaymentInstrumentRequest existingPaymentInstrumentRequest = generateGetExistingPaymentInstrumentRequest();
        existingPaymentInstrumentRequest.setChannel("test-bank-exclude-channel");

        responseBody = GET_WALLET_RESPONSE_BANK_ONLY;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        GetExistingPaymentInstrumentResponse existingPaymentInstrumentResponse =
            walletService.getExistingPaymentInstrument(requestHeader, existingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", existingPaymentInstrumentResponse.getCpcStatus());

    }

    @Test
    public void getExistingPaymentInstrumentNoCardOrBank() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetExistingPaymentInstrumentRequest existingPaymentInstrumentRequest = generateGetExistingPaymentInstrumentRequest();

        responseBody = GET_WALLET_RESPONSE_NO_CARD_OR_BANK;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        GetExistingPaymentInstrumentResponse existingPaymentInstrumentResponse =
            walletService.getExistingPaymentInstrument(requestHeader, existingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", existingPaymentInstrumentResponse.getCpcStatus());

    }

    @Test
    public void getExistingPaymentInstrumentHttpClientErrorException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetExistingPaymentInstrumentRequest existingPaymentInstrumentRequest = generateGetExistingPaymentInstrumentRequest();

        errorString = PAYMENT_SERVICE_ERROR_9999;
        HttpClientErrorException httpClientErrorException = generateHttpClientErrorException(errorString);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(httpClientErrorException);

        GetExistingPaymentInstrumentResponse existingPaymentInstrumentResponse =
            walletService.getExistingPaymentInstrument(requestHeader, existingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", existingPaymentInstrumentResponse.getCpcStatus());
        assertEquals("PAYMENT-9999", existingPaymentInstrumentResponse.getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", existingPaymentInstrumentResponse.getPsErrorMessage());

    }

    @Test
    public void getExistingPaymentInstrumentHttpServerErrorException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetExistingPaymentInstrumentRequest existingPaymentInstrumentRequest = generateGetExistingPaymentInstrumentRequest();

        errorString = PAYMENT_SERVICE_ERROR_9999;
        HttpServerErrorException httpServerErrorException = generateHttpServerErrorException(errorString);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(httpServerErrorException);

        GetExistingPaymentInstrumentResponse existingPaymentInstrumentResponse =
            walletService.getExistingPaymentInstrument(requestHeader, existingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", existingPaymentInstrumentResponse.getCpcStatus());
        assertEquals("PAYMENT-9999", existingPaymentInstrumentResponse.getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", existingPaymentInstrumentResponse.getPsErrorMessage());

    }

    @Test
    public void getExistingPaymentInstrumentResourceAccessException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetExistingPaymentInstrumentRequest existingPaymentInstrumentRequest = generateGetExistingPaymentInstrumentRequest();

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new ResourceAccessException(errorString, new IOException()));

        GetExistingPaymentInstrumentResponse existingPaymentInstrumentResponse =
            walletService.getExistingPaymentInstrument(requestHeader, existingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", existingPaymentInstrumentResponse.getCpcStatus());
        assertEquals("I/O exception while calling Wallet Service.", existingPaymentInstrumentResponse.getPsErrorMessage());

    }

    @Test
    public void getExistingPaymentInstrumentOtherException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetExistingPaymentInstrumentRequest existingPaymentInstrumentRequest = generateGetExistingPaymentInstrumentRequest();

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new RuntimeException(errorString));

        GetExistingPaymentInstrumentResponse existingPaymentInstrumentResponse =
            walletService.getExistingPaymentInstrument(requestHeader, existingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", existingPaymentInstrumentResponse.getCpcStatus());
        assertEquals("Default Error String", existingPaymentInstrumentResponse.getPsErrorMessage());

    }

    @Test
    public void shouldUpdateExistingBankPaymentInstrument() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        UpdateExistingPaymentInstrumentRequest updateExistingPaymentInstrumentRequest = generateUpdateExistingPaymentInstrumentRequest("bank", true);

        responseBody = PUT_WALLET_RESPONSE_SUCCESS;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        UpdateExistingPaymentInstrumentResponse updateExistingPaymentInstrumentResponse =
            walletService.updateExistingPaymentInstrument(requestHeader, updateExistingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("update", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getActionTaken());
        assertEquals("SUCCESS", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("Checking", updateExistingPaymentInstrumentResponse.getBankDetails().getBankAccountType());
        assertEquals(true, updateExistingPaymentInstrumentResponse.getBankDetails().isDefaultInstrument());
        assertEquals("1111", updateExistingPaymentInstrumentResponse.getBankDetails().getBankAccountLast4Digits());
        assertEquals("183 Inverness Dr", updateExistingPaymentInstrumentResponse.getCustomerDetails().getAddress().getLine1());
        assertEquals("firstName", updateExistingPaymentInstrumentResponse.getCustomerDetails().getName().getFirstName());

    }

    @Test
    public void shouldUpdateExistingCardPaymentInstrument() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        UpdateExistingPaymentInstrumentRequest updateExistingPaymentInstrumentRequest = generateUpdateExistingPaymentInstrumentRequest("card", true);

        responseBody = PUT_WALLET_RESPONSE_SUCCESS;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        UpdateExistingPaymentInstrumentResponse updateExistingPaymentInstrumentResponse =
            walletService.updateExistingPaymentInstrument(requestHeader, updateExistingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("update", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getActionTaken());
        assertEquals("SUCCESS", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("Visa", updateExistingPaymentInstrumentResponse.getCardDetails().getCardType());
        assertEquals(true, updateExistingPaymentInstrumentResponse.getCardDetails().isDefaultInstrument());
        assertEquals("4448", updateExistingPaymentInstrumentResponse.getCardDetails().getCardLast4Digits());
        assertEquals("1222", updateExistingPaymentInstrumentResponse.getCardDetails().getExpirationDate());
        assertEquals("183 Inverness Dr", updateExistingPaymentInstrumentResponse.getCustomerDetails().getAddress().getLine1());
        assertEquals("firstName", updateExistingPaymentInstrumentResponse.getCustomerDetails().getName().getFirstName());

    }

    @Test
    public void shouldFailToUpdateExistingPaymentInstrument() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        UpdateExistingPaymentInstrumentRequest updateExistingPaymentInstrumentRequest = generateUpdateExistingPaymentInstrumentRequest("card", true);

        responseBody = PUT_WALLET_RESPONSE_ERROR;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        UpdateExistingPaymentInstrumentResponse updateExistingPaymentInstrumentResponse =
            walletService.updateExistingPaymentInstrument(requestHeader, updateExistingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("update", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getActionTaken());
        assertEquals("ERROR", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());

    }

    @Test
    public void updateExistingPaymentInstrumentHttpClientErrorException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        UpdateExistingPaymentInstrumentRequest updateExistingPaymentInstrumentRequest = generateUpdateExistingPaymentInstrumentRequest("bank", true);

        errorString = PAYMENT_SERVICE_ERROR_9999;
        HttpClientErrorException httpClientErrorException = generateHttpClientErrorException(errorString);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(httpClientErrorException);

        UpdateExistingPaymentInstrumentResponse updateExistingPaymentInstrumentResponse =
            walletService.updateExistingPaymentInstrument(requestHeader, updateExistingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("update", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getActionTaken());
        assertEquals("ERROR", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("PAYMENT-9999", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void updateExistingPaymentInstrumentHttpServerErrorException() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        UpdateExistingPaymentInstrumentRequest updateExistingPaymentInstrumentRequest = generateUpdateExistingPaymentInstrumentRequest("bank", true);

        errorString = PAYMENT_SERVICE_ERROR_9999;
        HttpServerErrorException httpServerErrorException = generateHttpServerErrorException(errorString);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(httpServerErrorException);

        UpdateExistingPaymentInstrumentResponse updateExistingPaymentInstrumentResponse =
            walletService.updateExistingPaymentInstrument(requestHeader, updateExistingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("update", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getActionTaken());
        assertEquals("ERROR", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("PAYMENT-9999", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getPsErrorCode());
        assertEquals("Failed to process transaction. Please try again later.", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void updateExistingPaymentInstrumentResourceAccessException() throws Exception {
        HttpHeaders requestHeader = setUpRequestHeader();
        UpdateExistingPaymentInstrumentRequest updateExistingPaymentInstrumentRequest = generateUpdateExistingPaymentInstrumentRequest("card", true);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new ResourceAccessException(errorString, new SocketTimeoutException()));

        UpdateExistingPaymentInstrumentResponse updateExistingPaymentInstrumentResponse =
            walletService.updateExistingPaymentInstrument(requestHeader, updateExistingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("Time out exception while calling Wallet Service.", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void updateExistingPaymentInstrumentOtherException() throws Exception {
        HttpHeaders requestHeader = setUpRequestHeader();
        UpdateExistingPaymentInstrumentRequest updateExistingPaymentInstrumentRequest = generateUpdateExistingPaymentInstrumentRequest("card", true);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(new RuntimeException(errorString));

        UpdateExistingPaymentInstrumentResponse updateExistingPaymentInstrumentResponse =
            walletService.updateExistingPaymentInstrument(requestHeader, updateExistingPaymentInstrumentRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("walletservice");
        assertEquals("ERROR", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());
        assertEquals("Default Error String", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getPsErrorMessage());

    }

    @Test
    public void testGetAddToWalletServiceRequest() throws Exception {

        AddToWalletRequest testRequest = generateAddToWalletRequest(CARD, true, true);
        String testRequestType = testRequest.getClass().getSimpleName();
        String testEnvironment = "dev";
        String testRequestString = new Gson().toJson(testRequest).toString();

        String requestString = walletService.getWalletServiceRequest(testRequestType, testRequestString, testEnvironment);
        WalletServiceRequest walletServiceRequest = new Gson().fromJson(requestString, WalletServiceRequest.class);

        assertEquals(true, walletServiceRequest.getSecure());
        assertEquals(true, walletServiceRequest.getPaymentCard().getDefaultInstrument());
        assertEquals("TEST_ENCRYPTED_CARD_VALUE", walletServiceRequest.getPaymentCard().getCardNumber());
        assertEquals("Visa", walletServiceRequest.getPaymentCard().getCardType());
        assertEquals("999", walletServiceRequest.getPaymentCard().getCvv());
        assertEquals("9999", walletServiceRequest.getPaymentCard().getExpirationDate());
        assertEquals("firstName lastName", walletServiceRequest.getPaymentCard().getCustomerDefinedName());
        assertEquals("Englewood", walletServiceRequest.getPaymentCard().getBillTo().getAddress().getCity());
        assertEquals("USA", walletServiceRequest.getPaymentCard().getBillTo().getAddress().getCountry());
        assertEquals("183 Inverness Dr", walletServiceRequest.getPaymentCard().getBillTo().getAddress().getLine1());
        assertEquals("Co", walletServiceRequest.getPaymentCard().getBillTo().getAddress().getState());
        assertEquals("80112", walletServiceRequest.getPaymentCard().getBillTo().getAddress().getZip());
        assertEquals("firstName", walletServiceRequest.getPaymentCard().getBillTo().getName().getFirstName());
        assertEquals("lastName", walletServiceRequest.getPaymentCard().getBillTo().getName().getLastName());
        assertEquals("3039999999", walletServiceRequest.getPaymentCard().getBillTo().getContact().getPhone());
        assertEquals("test@test.com", walletServiceRequest.getPaymentCard().getBillTo().getContact().getEmailAddress());
        assertEquals("FUSION_1701", walletServiceRequest.getKeyName());
        assertEquals("8497100099999999", walletServiceRequest.getBillingInfo().getBillingArrangementId());
        assertEquals("TEST_MARKET", walletServiceRequest.getBillingInfo().getMarket());
        assertEquals("TEST_REGION", walletServiceRequest.getBillingInfo().getRegion());
        assertEquals("TestField1", walletServiceRequest.getOrderInfo().getChannelCustomData().getChannelCustomDataField1());
        assertEquals("TestField5", walletServiceRequest.getOrderInfo().getChannelCustomData().getChannelCustomDataField5());
        assertEquals("TestField17", walletServiceRequest.getOrderInfo().getChannelCustomData().getChannelCustomDataField17());
        assertEquals("testProdcutCode1", walletServiceRequest.getOrderInfo().getOrderItems().get(0).getProductCode());
        assertEquals("testProduct1", walletServiceRequest.getOrderInfo().getOrderItems().get(0).getProductName());
        assertEquals("testProductSKU1", walletServiceRequest.getOrderInfo().getOrderItems().get(0).getProductSKU());
        assertEquals(10, walletServiceRequest.getOrderInfo().getOrderItems().get(0).getQuantity());
        assertEquals(10.99, walletServiceRequest.getOrderInfo().getOrderItems().get(0).getUnitPrice(), 0);
        assertEquals("testProdcutCode2", walletServiceRequest.getOrderInfo().getOrderItems().get(1).getProductCode());
        assertEquals("testProduct2", walletServiceRequest.getOrderInfo().getOrderItems().get(1).getProductName());
        assertEquals("testProductSKU2", walletServiceRequest.getOrderInfo().getOrderItems().get(1).getProductSKU());
        assertEquals(7, walletServiceRequest.getOrderInfo().getOrderItems().get(1).getQuantity());
        assertEquals(7.99, walletServiceRequest.getOrderInfo().getOrderItems().get(1).getUnitPrice(), 0);
        assertEquals("Englewood", walletServiceRequest.getOrderInfo().getShipTo().getAddress().getCity());
        assertEquals("USA", walletServiceRequest.getOrderInfo().getShipTo().getAddress().getCountry());
        assertEquals("183 Inverness Dr", walletServiceRequest.getOrderInfo().getShipTo().getAddress().getLine1());
        assertEquals("Co", walletServiceRequest.getOrderInfo().getShipTo().getAddress().getState());
        assertEquals("80112", walletServiceRequest.getOrderInfo().getShipTo().getAddress().getZip());
        assertEquals("test@test.com", walletServiceRequest.getOrderInfo().getShipTo().getContact().getEmailAddress());
        assertEquals("3039999999", walletServiceRequest.getOrderInfo().getShipTo().getContact().getPhone());
        assertEquals("firstName", walletServiceRequest.getOrderInfo().getShipTo().getName().getFirstName());
        assertEquals("lastName", walletServiceRequest.getOrderInfo().getShipTo().getName().getLastName());
        assertEquals("Overnight Air", walletServiceRequest.getOrderInfo().getShipTo().getShippingMethod());
        assertEquals("TEST_CUSTOMER_GUID", walletServiceRequest.getCustomerId());
        assertEquals(true, walletServiceRequest.getEnableDecisionManager());
        assertEquals("TEST_DEVICE_FINGERPRINT_ID", walletServiceRequest.getDeviceFingerprintId());
        assertEquals("test:ip:addr:es", walletServiceRequest.getIpAddress());
        assertEquals(true, walletServiceRequest.getPreAuthorization());

    }

    @Test
    public void testGetUpdateInstrumentWalletServiceRequest() throws Exception {

        UpdateExistingPaymentInstrumentRequest testUpdateExistingPaymentInstrumentRequest = generateUpdateExistingPaymentInstrumentRequest(CARD,true);
        String testRequestType = testUpdateExistingPaymentInstrumentRequest.getClass().getSimpleName();
        String testEnvironment = "dev";
        String testRequestString = new Gson().toJson(testUpdateExistingPaymentInstrumentRequest).toString();

        String testRequest = walletService.getWalletServiceRequest(testRequestType, testRequestString, testEnvironment);
        ModifyExistingTokenRequest testModifyExistingTokenRequest = new Gson().fromJson(testRequest, ModifyExistingTokenRequest.class);

        assertEquals("TEST_CUSTOMER_ID",  testModifyExistingTokenRequest.getCustomerId());
        assertEquals("firstName lastName",  testModifyExistingTokenRequest.getCustomerDefinedName());
        assertEquals(true, testModifyExistingTokenRequest.getDefaultInstrument());
        assertEquals("1222", testModifyExistingTokenRequest.getExpirationDate());
        assertEquals("183 Inverness Dr", testModifyExistingTokenRequest.getBillTo().getAddress().getLine1());
        assertEquals("Englewood", testModifyExistingTokenRequest.getBillTo().getAddress().getCity());
        assertEquals("Co", testModifyExistingTokenRequest.getBillTo().getAddress().getState());
        assertEquals("80112", testModifyExistingTokenRequest.getBillTo().getAddress().getZip());
        assertEquals("USA", testModifyExistingTokenRequest.getBillTo().getAddress().getCountry());
        assertEquals("firstName", testModifyExistingTokenRequest.getBillTo().getName().getFirstName());
        assertEquals("lastName", testModifyExistingTokenRequest.getBillTo().getName().getLastName());
        assertEquals("3039999999", testModifyExistingTokenRequest.getBillTo().getContact().getPhone());
        assertEquals("test@test.com", testModifyExistingTokenRequest.getBillTo().getContact().getEmailAddress());

    }

}
