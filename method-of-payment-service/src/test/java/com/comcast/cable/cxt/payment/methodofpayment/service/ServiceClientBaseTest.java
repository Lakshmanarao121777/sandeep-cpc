package com.comcast.cable.cxt.payment.methodofpayment.service;

import com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants;
import com.comcast.cable.cxt.payment.methodofpayment.services.*;
import com.comcast.cable.cxt.payment.methodofpayment.vo.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import static com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants.*;
import static com.comcast.cable.cxt.payment.methodofpayment.MethodOfServiceTestConstants.*;
import static org.junit.Assert.assertEquals;

@RunWith(MockitoJUnitRunner.class)
public class ServiceClientBaseTest {

    @InjectMocks
    private ServiceClientBase serviceClientBase;

    @Test
    public void testGetRequestUrlPaymentContractService() throws Exception {

        AddToWalletRequest testAddToWalletRequest = new AddToWalletRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testAddToWalletRequest.getClass().getSimpleName(), paymentContractServiceEndpoint, PAYMENT_CONTRACT_SERVICE);

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://payment-contract-service-test.comcast.net/api/v1/PaymentContractService/recordContract", testUrl);

    }

    @Test
    public void testGetRequestUrlAddPaymentInstrumentToWalletBank() throws Exception {

        AddToWalletRequest testAddToWalletRequest = new AddToWalletRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testAddToWalletRequest.getClass().getSimpleName(), walletServiceEndpoint, WALLET_SERVICE);
        testUrlConfig.setPaymentInstrumentType(BANK);

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://payment-api-gateway-test.comcast.net/wallet/bank", testUrl);

    }

    @Test
    public void testGetRequestUrlAddPaymentInstrumentToWalletCard() throws Exception {

        AddToWalletRequest testAddToWalletRequest = new AddToWalletRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testAddToWalletRequest.getClass().getSimpleName(), walletServiceEndpoint, WALLET_SERVICE);
        testUrlConfig.setPaymentInstrumentType(CARD);

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://payment-api-gateway-test.comcast.net/wallet/card", testUrl);

    }

    @Test
    public void testGetRequestUrlTokenizeWithAutopayBank() throws Exception {

        AddToWalletRequest testAddToWalletRequest = new AddToWalletRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testAddToWalletRequest.getClass().getSimpleName(), autopayServiceEndpoint, AUTOPAY_SERVICE);
        testUrlConfig.setPaymentInstrumentType(BANK);

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://test-autopay-service.xfinity.com/autopay/bank", testUrl);

    }

    @Test
    public void testGetRequestUrlTokenizeWithAutopayCard() throws Exception {

        AddToWalletRequest testAddToWalletRequest = new AddToWalletRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testAddToWalletRequest.getClass().getSimpleName(), autopayServiceEndpoint, AUTOPAY_SERVICE);
        testUrlConfig.setPaymentInstrumentType(CARD);

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://test-autopay-service.xfinity.com/autopay/card", testUrl);

    }

    @Test
    public void testGetRequestUrlEnrollInAutopayBank() throws Exception {

        AutopayEnrollmentRequest testAutopayEnrollmentRequest = new AutopayEnrollmentRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testAutopayEnrollmentRequest.getClass().getSimpleName(), autopayServiceEndpoint, AUTOPAY_SERVICE);
        testUrlConfig.setPaymentInstrumentType(BANK);
        testUrlConfig.setPaymentToken("TEST_TOKEN");

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://test-autopay-service.xfinity.com/autopay/bank/token/TEST_TOKEN", testUrl);

    }

    @Test
    public void testGetRequestUrlEnrollInAutopayCard() throws Exception {

        AutopayEnrollmentRequest testAutopayEnrollmentRequest = new AutopayEnrollmentRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testAutopayEnrollmentRequest.getClass().getSimpleName(), autopayServiceEndpoint, AUTOPAY_SERVICE);
        testUrlConfig.setPaymentInstrumentType(CARD);
        testUrlConfig.setPaymentToken("TEST_TOKEN");

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://test-autopay-service.xfinity.com/autopay/card/token/TEST_TOKEN", testUrl);

    }

    @Test
    public void testGetRequestUrlWithdrawFromAutopay() throws Exception {

        AutopayWithdrawRequest testAutopayWithdrawRequest = new AutopayWithdrawRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testAutopayWithdrawRequest.getClass().getSimpleName(), autopayServiceEndpoint, AUTOPAY_SERVICE);
        testUrlConfig.setBillingArrangementId("8497100099999999");

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://test-autopay-service.xfinity.com/autopay/billingArrangementId/8497100099999999", testUrl);

    }

    @Test
    public void testGetRequestUrlUpdateExistingPaymentInstrument() throws Exception {

        UpdateExistingPaymentInstrumentRequest testUpdateExistingPaymentRequest = new UpdateExistingPaymentInstrumentRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testUpdateExistingPaymentRequest.getClass().getSimpleName(), walletServiceEndpoint, WALLET_SERVICE);
        testUrlConfig.setCustomerId("TEST_CUSTOMER_ID");
        testUrlConfig.setPaymentToken("TEST_TOKEN");

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://payment-api-gateway-test.comcast.net/wallet/customer/TEST_CUSTOMER_ID/token/TEST_TOKEN", testUrl);

    }

    @Test
    public void testGetRequestUrlDeleteExistingPaymentInstrument() throws Exception {

        DeleteExistingPaymentInstrumentRequest testDeleteExistingPaymentRequest = new DeleteExistingPaymentInstrumentRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testDeleteExistingPaymentRequest.getClass().getSimpleName(), walletServiceEndpoint, WALLET_SERVICE);
        testUrlConfig.setCustomerId("TEST_CUSTOMER_ID");
        testUrlConfig.setPaymentToken("TEST_TOKEN");

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://payment-api-gateway-test.comcast.net/wallet/customer/TEST_CUSTOMER_ID/token/TEST_TOKEN", testUrl);

    }

    @Test
    public void testGetRequestUrlGetAllPaymentInstrumentsNoAccountNumber() throws Exception {

        GetAllPaymentInstrumentsRequest testGetAllPaymentInstrumentsRequest = new GetAllPaymentInstrumentsRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testGetAllPaymentInstrumentsRequest.getClass().getSimpleName(), walletServiceEndpoint, WALLET_SERVICE);
        testUrlConfig.setCustomerId("TEST_CUSTOMER_ID");

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://payment-api-gateway-test.comcast.net/wallet/customer/TEST_CUSTOMER_ID", testUrl);

    }

    @Test
    public void testGetRequestUrlGetAllPaymentInstrumentsEmptyAccountNumber() throws Exception {

        GetAllPaymentInstrumentsRequest testGetAllPaymentInstrumentsRequest = new GetAllPaymentInstrumentsRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testGetAllPaymentInstrumentsRequest.getClass().getSimpleName(), walletServiceEndpoint, WALLET_SERVICE);
        testUrlConfig.setCustomerId("TEST_CUSTOMER_ID");
        testUrlConfig.setBillingArrangementId("");

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://payment-api-gateway-test.comcast.net/wallet/customer/TEST_CUSTOMER_ID", testUrl);

    }

    @Test
    public void testGetRequestUrlGetAllPaymentInstrumentsIncludeAccountNumber() throws Exception {

        GetAllPaymentInstrumentsRequest testGetAllPaymentInstrumentsRequest = new GetAllPaymentInstrumentsRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testGetAllPaymentInstrumentsRequest.getClass().getSimpleName(), walletServiceEndpoint, WALLET_SERVICE);
        testUrlConfig.setCustomerId("TEST_CUSTOMER_ID");
        testUrlConfig.setBillingArrangementId("8497100099999999");

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://payment-api-gateway-test.comcast.net/wallet/customer/TEST_CUSTOMER_ID?billingArrangementId=8497100099999999", testUrl);

    }

    @Test
    public void testGetRequestUrlGetExistingPaymentInstrumentNoAccountNumber() throws Exception {

        GetExistingPaymentInstrumentRequest testGetExistingPaymentInstrumentRequest = new GetExistingPaymentInstrumentRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testGetExistingPaymentInstrumentRequest.getClass().getSimpleName(), walletServiceEndpoint, WALLET_SERVICE);
        testUrlConfig.setCustomerId("TEST_CUSTOMER_ID");
        testUrlConfig.setPaymentToken("TEST_TOKEN");

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://payment-api-gateway-test.comcast.net/wallet/customer/TEST_CUSTOMER_ID/token/TEST_TOKEN?view=detail", testUrl);

    }

    @Test
    public void testGetRequestUrlGetExistingPaymentInstrumentEmptyAccountNumber() throws Exception {

        GetExistingPaymentInstrumentRequest testGetExistingPaymentInstrumentRequest = new GetExistingPaymentInstrumentRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testGetExistingPaymentInstrumentRequest.getClass().getSimpleName(), walletServiceEndpoint, WALLET_SERVICE);
        testUrlConfig.setCustomerId("TEST_CUSTOMER_ID");
        testUrlConfig.setPaymentToken("TEST_TOKEN");
        testUrlConfig.setBillingArrangementId("");

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://payment-api-gateway-test.comcast.net/wallet/customer/TEST_CUSTOMER_ID/token/TEST_TOKEN?view=detail", testUrl);

    }

    @Test
    public void testGetRequestUrlGetExistingPaymentInstrumentIncludeAccountNumber() throws Exception {

        GetExistingPaymentInstrumentRequest testGetExistingPaymentInstrumentRequest = new GetExistingPaymentInstrumentRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testGetExistingPaymentInstrumentRequest.getClass().getSimpleName(), walletServiceEndpoint, WALLET_SERVICE);
        testUrlConfig.setCustomerId("TEST_CUSTOMER_ID");
        testUrlConfig.setPaymentToken("TEST_TOKEN");
        testUrlConfig.setBillingArrangementId("8497100099999999");

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://payment-api-gateway-test.comcast.net/wallet/customer/TEST_CUSTOMER_ID/token/TEST_TOKEN?billingArrangementId=8497100099999999&view=detail", testUrl);

    }

    @Test
    public void testGetRequestUrlGetPaymentInstrumentConfiguration() throws Exception {

        GetPaymentConfigurationRequest testGetPaymentConfigurationRequest = new GetPaymentConfigurationRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfigurationtest(testGetPaymentConfigurationRequest.getClass().getSimpleName(), paymentConfigurationServiceEndpoint, PAYMENT_CONFIGURATION_SERVICE);
        testUrlConfig.setPaymentFrequency("onetime");
        testUrlConfig.setBillingArrangementId("8497100099999999");

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://payment-api-gateway-test.comcast.net/payment-configuration/onetime?billingArrangementId=8497100099999999", testUrl);

    }

    @Test
    public void testGetRequestUrlGetPublicKey() throws Exception {

        GetPublicKeyRequest testGetPublicKeyRequest = new GetPublicKeyRequest();
        UrlConfiguration testUrlConfig = setUpUrlConfiguration(testGetPublicKeyRequest.getClass().getSimpleName(), paymentKeyServiceEndpoint, PAYMENT_KEY_SERVICE, true);

        String testUrl = serviceClientBase.getRequestUrl(testUrlConfig);
        assertEquals("https://payment-api-gateway-test.comcast.net/payment-key/public?keyName=FUSION_1701", testUrl);

    }

    @Test
    public void testGetCommonHttpHeaders() throws Exception {

        HttpHeaders testHttpHeaders = setUpRequestHeader();
        HttpHeaders testRequestHeader = serviceClientBase.getCommonHttpHeaders(testHttpHeaders, "CONSUMER_INT");

        assertEquals(MediaType.APPLICATION_JSON, testRequestHeader.getContentType());
        assertEquals(MediaType.APPLICATION_JSON_VALUE, testRequestHeader.get(HttpHeaders.ACCEPT).get(0));
        assertEquals("localhost", testRequestHeader.get(PARAM_SOURCE_SERVER_ID).get(0));
        assertEquals("common-payment", testRequestHeader.get(PARAM_SOURCE_SYSTEM_ID).get(0));
        assertEquals("2021-11-24T01:05:59Z", testRequestHeader.get(PARAM_TIMESTAMP).get(0));
        assertEquals("1_testGetCommonHttpHeaders", testRequestHeader.get(PARAM_TRACKING_ID).get(0));
        assertEquals("CONSUMER_INT", testRequestHeader.get(PARAM_CHANNEL).get(0));
        assertEquals("Comcast", testRequestHeader.get(PARAM_PARTNER_ID).get(0));

    }

}

