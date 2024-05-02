package com.comcast.cable.cxt.payment.methodofpayment.controllers.rest;

import com.comcast.cable.cxt.payment.methodofpayment.config.MethodOfPaymentServiceConfig;
import com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfPaymentService;
import com.comcast.cable.cxt.payment.methodofpayment.services.*;
import com.comcast.cable.cxt.payment.methodofpayment.vo.*;
import com.comcast.xsp.connector.core.rest.RestClient;
import com.comcast.xsp.connector.core.rest.RestClientFactory;

import java.util.Arrays;
import java.util.Map;

import org.junit.Before;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

import org.junit.Test;
import org.junit.runner.RunWith;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import static com.comcast.cable.cxt.payment.methodofpayment.MethodOfServiceTestConstants.*;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.hamcrest.MatcherAssert.assertThat;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class MethodOfPaymentServiceControllerTest{

    @InjectMocks
    private MethodOfPaymentServiceController methodOfPaymentServiceController;

    @InjectMocks
    private AutopayService autopayService;

    @InjectMocks
    private PaymentConfigurationService paymentConfigurationService;

    @InjectMocks
    private PublicKeyService publicKeyService;

    @InjectMocks
    private WalletService walletService;

    @InjectMocks
    private PaymentContractService paymentContractService;

    @Mock
    private RestClientFactory mockRestClientFactory;

    @Mock
    private RestClient mockRestClient;

    @Before
    public void setup() {
        //Set Mocks
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "restClientFactory", mockRestClientFactory);
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "walletService", walletService);
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "publicKeyService", publicKeyService);
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "autopayService", autopayService);
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "paymentConfigurationService", paymentConfigurationService);
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "paymentContractService", paymentContractService);
        //Set Endpoints
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "autopayServiceUrl", autopayServiceEndpoint);
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "paymentConfigurationServiceUrl", paymentConfigurationEndpoint);
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "paymentKeyServiceUrl", paymentKeyServiceEndpoint);
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "walletServiceUrl", walletServiceEndpoint);
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "paymentContractServiceUrl", paymentContractServiceEndpoint);
        //Set Values
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "environment", environment);
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "paymentKeyServiceUrl", paymentKeyServiceEndpoint);
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "bankExclusionChannelList", Arrays.asList("XFINITY_MOBILE_LITE"));
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "cpcChannelAllowList", Arrays.asList("XFINITY_MOBILE_LITE", "TEST_CHANNEL", "CHANNEL-TEST", "test-channel", "channel-test", "testing-channel"));
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "authChannelList", Arrays.asList("test-channel"));
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "unAuthLiteChannelList", Arrays.asList("lite-channel-test"));
        ReflectionTestUtils.setField(methodOfPaymentServiceController, "unAuthBuyFlowChannelList", Arrays.asList("buyflow-channel-test"));

    }

    private AutopayEnrollmentRequest autopayEnrollmentRequest = generateAutopayEnrollmentRequest();

    private HttpClientErrorException  clientErrorException = generateHttpClientErrorException(PAYMENT_SERVICE_ERROR_9999);

    private HttpServerErrorException  serverErrorException = generateHttpServerErrorException(PAYMENT_SERVICE_ERROR_9999);

    private HttpHeaders requestHeader = setUpRequestHeader();

    private ResponseEntity<String> response = null;

    private String autopayServiceEndpoint = "https://test-autopay-service.xfinity.com/autopay/";
    private String invalidEndpoint = "invalid endpoint";
    private String paymentConfigurationEndpoint = "payment configuration service endpoint";
    private String paymentKeyServiceEndpoint = "payment key service endpoint";
    private String walletServiceEndpoint = "wallet service endpoint";

    private String paymentContractServiceEndpoint = "payment contract service endpoint";

    private String environment = "unit-testing";

    private String errorString = "Default Error String";
    private String responseBody = "Default Http Response";

    @Test
    public void shouldGreet()throws Exception {
        Map<String, String> response= new MethodOfPaymentServiceController(mock(MethodOfPaymentServiceConfig.class)).index();
        assertThat(response.get("message"),startsWith("Service Name - "));
        assertThat(response.get("date"),notNullValue());
    }

    @Test
    public void shouldReturnDomainObjectWithDomainId()throws Exception {
        ResponseEntity<MethodOfPaymentService> domainPojo =
            new MethodOfPaymentServiceController(mock(MethodOfPaymentServiceConfig.class)).methodOfPaymentService("methodOfPaymentServiceId");

        assertThat(domainPojo.getStatusCode(),is(HttpStatus.OK));
        assertThat(domainPojo.getBody().getMethodOfPaymentServiceId(),is("methodOfPaymentServiceId"));
    }

    @Test
    public void testGetPublicKeyRequestPath() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetPublicKeyRequest publicKeyRequestTestChannel = generatePublicKeyRequest();
        GetPublicKeyRequest publicKeyRequestChannelTest = generatePublicKeyRequest();
        publicKeyRequestChannelTest.setChannel("CHANNEL-TEST");

        responseBody = GET_PUBLIC_KEY_RESPONSE;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("paymentkeyservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        GetPublicKeyResponse getKeyResponse = methodOfPaymentServiceController.getPaymentPublicKey(requestHeader, publicKeyRequestTestChannel);

        assertEquals("SUCCESS", getKeyResponse.getCpcStatus());

    }

    @Test
    public void testAddToWalletRequestPathAutopayNotSet() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();

        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", true, true);

        responseBody = POST_CARD_TO_WALLET_RESPONSE;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.POST), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AddToWalletResponse addToWallet = methodOfPaymentServiceController.addToWallet(requestHeader, addToWalletRequest);

        assertEquals("SUCCESS", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals("tokenize", addToWallet.getSubmissionDetails().getActionTaken());

    }

    @Test
    public void testAddToWalletRequestPathAutopayFalse() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();

        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", true, false);
        addToWalletRequest.setEnrollInAutopay(false);

        responseBody = POST_CARD_TO_WALLET_RESPONSE;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.POST), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AddToWalletResponse addToWallet = methodOfPaymentServiceController.addToWallet(requestHeader, addToWalletRequest);

        assertEquals("SUCCESS", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals("tokenize", addToWallet.getSubmissionDetails().getActionTaken());

    }

    @Test
    public void testAddToWalletRequestPathWithAutopay() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();

        AddToWalletRequest addToWalletRequest = generateAddToWalletRequest("card", true, true);
        addToWalletRequest.setEnrollInAutopay(true);

        responseBody = AUTOPAY_CARD_ENROLLMENT_RESPONSE;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClientFactory.getClient("paymentcontractservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AddToWalletResponse addToWallet = methodOfPaymentServiceController.addToWallet(requestHeader, addToWalletRequest);

        assertEquals("SUCCESS", addToWallet.getSubmissionDetails().getCpcStatus());
        assertEquals("tokenize_with_autopay", addToWallet.getSubmissionDetails().getActionTaken());

    }

    @Test
    public void testGetAllPaymentInstrumentsRequestPath() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetAllPaymentInstrumentsRequest allPaymentInstrumentsRequest = generateGetAllPaymentInstrumentsRequest();

        responseBody = GET_WALLET_RESPONSE_ALL_INSTRUMENTS;

        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        GetAllPaymentInstrumentsResponse allPaymentInstrumentsResponse =
            methodOfPaymentServiceController.getAllPaymentInstruments(requestHeader, allPaymentInstrumentsRequest);

        assertEquals("SUCCESS", allPaymentInstrumentsResponse.getCpcStatus());

    }

    @Test
    public void testGetExistingPaymentInstrumentRequestPath() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        GetExistingPaymentInstrumentRequest existingPaymentInstrumentRequest = generateGetExistingPaymentInstrumentRequest();

        responseBody = GET_WALLET_RESPONSE_CARD_ONLY;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        GetExistingPaymentInstrumentResponse existingPaymentInstrumentResponse =
            methodOfPaymentServiceController.getExistingPaymentInstrument(requestHeader, existingPaymentInstrumentRequest);

        assertEquals("SUCCESS", existingPaymentInstrumentResponse.getCpcStatus());

    }

    @Test
    public void testUpdateExistingPaymentInstrumentRequestPath() throws Exception {

        HttpHeaders requestHeader = setUpRequestHeader();
        UpdateExistingPaymentInstrumentRequest updateExistingPaymentInstrumentRequest = generateUpdateExistingPaymentInstrumentRequest("bank", true);

        responseBody = PUT_WALLET_RESPONSE_SUCCESS;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        UpdateExistingPaymentInstrumentResponse updateExistingPaymentInstrumentResponse =
            methodOfPaymentServiceController.updateExistingPaymentInstrument(requestHeader, updateExistingPaymentInstrumentRequest);

        assertEquals("SUCCESS", updateExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());

    }

    @Test
    public void testDeleteExistingPaymentInstrumentRequestPath() throws Exception {
        HttpHeaders requestHeader = setUpRequestHeader();

        DeleteExistingPaymentInstrumentRequest deleteExistingPaymentInstrumentRequest = generateDeleteExistingPaymentInstrumentRequest("card");

        responseBody = DELETE_WALLET_RESPONSE_SUCCESS;
        ResponseEntity<String> response = generateResponse(responseBody);

        when(mockRestClientFactory.getClient("walletservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.DELETE), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        DeleteExistingPaymentInstrumentResponse deleteExistingPaymentInstrumentResponse =
            methodOfPaymentServiceController.deleteExistingPaymentInstrument(requestHeader, deleteExistingPaymentInstrumentRequest);

        assertEquals("SUCCESS", deleteExistingPaymentInstrumentResponse.getSubmissionDetails().getCpcStatus());

    }

    @Test
    public void testGetPaymentConfigurationRequestPath() throws Exception {

        response = generateResponse(GET_PAYMENT_CONFIGURATION_CARD_BLOCK_RESPONSE);

        when(mockRestClientFactory.getClient("paymentconfigurationservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        GetPaymentConfigurationResponse paymentConfigurationResponse = methodOfPaymentServiceController.getPaymentConfiguration(requestHeader, generateGetPaymentConfigurationRequest());

        assertEquals("SUCCESS", paymentConfigurationResponse.getPaymentConfigurationDetails().getCpcStatus());

    }

    @Test
    public void testAutopayEnrollmentRequestPath() throws Exception {

        autopayEnrollmentRequest.setCardType("");
        autopayEnrollmentRequest.setBankAccountType("Checking");

        response = generateResponse(AUTOPAY_BANK_ENROLLMENT_RESPONSE);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.PUT), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AutopayEnrollmentResponse autopayEnrollmentResponse = methodOfPaymentServiceController.enrollInAutopay(requestHeader, autopayEnrollmentRequest);

        assertEquals("SUCCESS", autopayEnrollmentResponse.getSubmissionDetails().getCpcStatus());

    }

    @Test
    public void testAutopayWithdrawRequestPath() throws Exception {

        response = generateResponse(AUTOPAY_WITHDRAW_RESPONSE);

        when(mockRestClientFactory.getClient("autopayservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.DELETE), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        AutopayWithdrawResponse autopayWithdrawResponse = methodOfPaymentServiceController.withdrawFromAutopay(requestHeader, generateAutopayWithdrawRequest());

        assertEquals("SUCCESS", autopayWithdrawResponse.getSubmissionDetails().getCpcStatus());

    }

}
