package com.comcast.cable.cxt.payment.methodofpayment.utilities;

import org.junit.Test;
import org.springframework.http.HttpHeaders;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;

import static com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants.*;
import static com.comcast.cable.cxt.payment.methodofpayment.utilities.MethodOfPaymentServiceUtilities.*;

public class MethodOfPaymentServiceUtilitiesTest {

    String autopayServiceUrl = "autopayServiceEndpoint";
    String paymentConfigurationServiceUrl = "paymentConfigurationEndpoint";
    String paymentKeyServiceUrl = "paymentKeyServiceEndpoint";
    String walletServiceUrl = "walletServiceEndpoint";

    private List<String> bankExclusionChannelList = Arrays.asList("XFINITY_MOBILE_LITE");
    private List<String> cpcChannelAllowList = Arrays.asList("XFINITY_MOBILE_LITE", "TEST_CHANNEL", "CHANNEL-TEST", "test-channel", "test-auth-channel",
        "lite-channel-test", "buyflow-channel-test", "testing-channel");
    private List<String> unAuthLiteChannelList = Arrays.asList("lite-channel-test");
    private List<String> unAuthBuyFlowChannelList = Arrays.asList("buyflow-channel-test");
    private List<String> authChannelList = Arrays.asList("test-auth-channel");

    private String environment = "unit-testing";

    @Test
    public void testSetMaskedCardNumber() {

        String cardNumber = "123456******7890";

        String maskedCardNumber = formatMaskedCardNumber(cardNumber);

        assertEquals("************7890", maskedCardNumber);
    }

    @Test
    public void testMaskAmexCvv() {

        String cardType = AMERICAN_EXPRESS_CARD_TYPE;

        String maskedCvv = deriveMaskedCvv(cardType);

        assertEquals("****", maskedCvv);
    }

    @Test
    public void testMaskNonAmexCvv() {

        String cardType = "MasterCard";

        String maskedCvv = deriveMaskedCvv(cardType);

        assertEquals("***", maskedCvv);
    }

    @Test
    public void unauthChannelValid() {

        HttpHeaders requestHeader = setUpRequestHeader("lite-channel-test", false);

        Map<String, Object> configMap = createClientConfig();

        Map<String, Object> validationMap = channelAuthValidation(requestHeader, configMap);

        assertEquals(true, validationMap.get(VALID_CHANNEL));
    }

    @Test
    public void authChannelValid() {

        HttpHeaders requestHeader = setUpRequestHeader("test-auth-channel", true);

        Map<String, Object> configMap = createClientConfig();

        Map<String, Object> validationMap = channelAuthValidation(requestHeader, configMap);

        assertEquals(true, validationMap.get(VALID_CHANNEL));
    }

    @Test
    public void channelValidationNullChannel() {

        HttpHeaders requestHeader = setUpRequestHeader("test-channel", true);
        requestHeader.remove(PARAM_CHANNEL);

        Map<String, Object> configMap = createClientConfig();

        Map<String, Object> validationMap = channelAuthValidation(requestHeader, configMap);

        assertEquals(false, validationMap.get(VALID_CHANNEL));
        assertEquals("Channel header parameter is missing in the request.", validationMap.get(VALIDATION_RESPONSE_MESSAGE));
    }

    @Test
    public void channelValidationEmptyChannel() {

        HttpHeaders requestHeader = setUpRequestHeader("test-channel", true);
        requestHeader.set(PARAM_CHANNEL, "");

        Map<String, Object> configMap = createClientConfig();

        Map<String, Object> validationMap = channelAuthValidation(requestHeader, configMap);

        assertEquals(false, validationMap.get(VALID_CHANNEL));
        assertEquals("Channel header parameter is missing in the request.", validationMap.get(VALIDATION_RESPONSE_MESSAGE));
    }

    @Test
    public void channelValidationUnauthLiteChannelWithAuthHeader() {

        HttpHeaders requestHeader = setUpRequestHeader("lite-channel-test", true);

        Map<String, Object> configMap = createClientConfig();

        Map<String, Object> validationMap = channelAuthValidation(requestHeader, configMap);

        assertEquals(false, validationMap.get(VALID_CHANNEL));
        assertEquals("Channel lite-channel-test has an unexpected problem with authorization.  Please contact system administrator.",
            validationMap.get(VALIDATION_RESPONSE_MESSAGE));
    }

    @Test
    public void channelValidationUnauthBuyFlowChannelWithAuthHeader() {

        HttpHeaders requestHeader = setUpRequestHeader("buyflow-channel-test", true);

        Map<String, Object> configMap = createClientConfig();

        Map<String, Object> validationMap = channelAuthValidation(requestHeader, configMap);

        assertEquals(false, validationMap.get(VALID_CHANNEL));
        assertEquals("Channel buyflow-channel-test has an unexpected problem with authorization.  Please contact system administrator.",
            validationMap.get(VALIDATION_RESPONSE_MESSAGE));
    }

    @Test
    public void channelValidationAuthChannelNoAuthHeader() {

        HttpHeaders requestHeader = setUpRequestHeader("test-auth-channel", true);
        requestHeader.remove(PARAM_AUTHORIZATION);

        Map<String, Object> configMap = createClientConfig();

        Map<String, Object> validationMap = channelAuthValidation(requestHeader, configMap);

        assertEquals(false, validationMap.get(VALID_CHANNEL));
        assertEquals("Authorization header is required for channel test-auth-channel.", validationMap.get(VALIDATION_RESPONSE_MESSAGE));
    }

    private HttpHeaders setUpRequestHeader(String channelName, boolean authHeader) {

        HttpHeaders header = new HttpHeaders();
        header.add(PARAM_SOURCE_SERVER_ID, "localhost");
        header.add(PARAM_SOURCE_SYSTEM_ID,"common-payment");
        header.add(PARAM_TIMESTAMP, "1");
        header.add(PARAM_TRACKING_ID, "1");

        header.add(PARAM_CHANNEL, channelName);

        if(authHeader) {
            header.add(PARAM_AUTHORIZATION, "test-token");
        }

        return header;
    }

    private Map<String, Object> createClientConfig() {
        Map<String,Object> configMap = new HashMap<>() {{
            put(AUTH_CHANNEL_LIST, authChannelList);
            put(BANK_EXCLUSION_CHANNEL_LIST, bankExclusionChannelList);
            put(CPC_CHANNEL_ALLOW_LIST, cpcChannelAllowList);
            put(ENVIRONMENT, environment);
            put(UNAUTH_LITE_CHANNEL_LIST, unAuthLiteChannelList);
            put(UNAUTH_BUYFLOW_CHANNEL_LIST, unAuthBuyFlowChannelList);
        }};

        return configMap;
    }

}
