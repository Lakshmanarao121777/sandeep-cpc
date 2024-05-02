package com.comcast.cable.cxt.payment.methodofpayment;

import com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants;
import com.comcast.cable.cxt.payment.methodofpayment.vo.*;
import org.junit.jupiter.api.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import java.nio.charset.StandardCharsets;
import java.util.*;

import static com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants.*;

public class MethodOfServiceTestConstants {

    public static final String walletServiceEndpoint = "https://payment-api-gateway-test.comcast.net/wallet/";
    public static final String autopayServiceEndpoint = "https://test-autopay-service.xfinity.com/autopay/";
    public static final String paymentContractServiceEndpoint = "https://payment-contract-service-test.comcast.net/api/v1/PaymentContractService/recordContract";
    public static final String paymentConfigurationServiceEndpoint = "https://payment-api-gateway-test.comcast.net/payment-configuration/";
    public static final String paymentKeyServiceEndpoint = "https://payment-api-gateway-test.comcast.net/payment-key/public";

    public static final String GENERIC_SERVICE_RESPONSE = "{\"Service client response: Success\"}";

    public static final String AUTOPAY_BANK_ENROLLMENT_RESPONSE = "{\"customerId\":\"TEST_CUSTOMER_ID\",\"token\":\"TEST_TOKEN\",\"debitDate\":null,\"maskedAccountNumber\":\"123456******4448\",\"bankAccountType\":\"Checking\",\"bankAccountLast4Digits\":\"1111\",\"autoPayId\":99999999}";

    public static final String AUTOPAY_CARD_ENROLLMENT_RESPONSE = "{\"customerId\":\"TEST_CUSTOMER_ID\",\"token\":\"TEST_TOKEN\",\"maskedAccountNumber\":\"123456******4448\",\"debitDate\":null,\"cardType\":\"Visa\",\"cardLast4Digits\":\"4448\",\"expirationDate\":\"1222\",\"autoPayId\":99999999}";

    public static final String AUTOPAY_WITHDRAW_RESPONSE = "{\"warning\":null,\"result\":\"Success\",\"debitDate\":\"2022-10-02\",\"autoPayStatus\":\"InActive\"}";

    public static final String GET_PAYMENT_CONFIGURATION_CARD_BLOCK_RESPONSE = "{\"cardblockStatus\":true,\"bankblockStatus\":false}";

    public static final String GET_PUBLIC_KEY_RESPONSE = "{\"publicKey\":\"-----BEGIN PUBLIC KEY-----\\nTesTPubLiCKeY\\n-----END PUBLIC KEY-----\"}";

    public static final String GET_WALLET_RESPONSE_ALL_INSTRUMENTS = "{\"wallets\": [{\"banks\":[{\"accountType\":\"Checking\",\"bankAccountLast4Digits\":\"1111\",\"billTo\":{\"address\":" +
        "{\"city\":\"Denver\",\"country\":\"USA\",\"line1\":\"1234 Test Ave\",\"state\":\"Co\",\"zip\":\"80112\"},\"contact\":" +
        "{\"emailAddress\":\"someone@someUrl.com\",\"phone\":\"3031111234\"},\"dateOfBirth\":\"01011900\",\"name\":" +
        "{\"firstName\":\"firstName\",\"lastName\":\"lastName\"}},\"customerDefinedName\":\"firstName lastName\"," +
        "\"defaultInstrument\":false,\"maskedAccountNumber\":\"***9999\",\"paymentMode\":\"OneTimePayment\",\"routingNumber\":\"123456789\",\"token\":\"TEST_BANK_CHECKING_TOKEN\"}," +
        "{\"accountType\":\"Savings\",\"bankAccountLast4Digits\":\"1112\",\"billTo\":{\"address\":{\"city\":\"Denver\",\"country\":\"USA\",\"line1\":\"1234 Test Ave\"," +
        "\"state\":\"Co\",\"zip\":\"80112\"},\"contact\":{\"emailAddress\":\"someone@someUrl.com\",\"phone\":\"3031111234\"},\"dateOfBirth\":\"01011900\",\"name\":" +
        "{\"firstName\":\"firstName\",\"lastName\":\"lastName\"}},\"customerDefinedName\":\"firstName lastName\",\"defaultInstrument\":false," +
        "\"maskedAccountNumber\":\"****1112\",\"paymentMode\":\"OneTimePayment\",\"routingNumber\":\"123456789\",\"token\":\"TEST_BANK_SAVINGS_TOKEN\"}]," +
        "\"paymentCards\":[{\"billTo\":{\"address\":{\"city\":\"Denver\",\"country\":\"USA\",\"line1\":\"1234 Test Ave\",\"state\":\"Co\",\"zip\":\"80112\"}," +
        "\"contact\":{\"emailAddress\":\"someone@someUrl.com\",\"phone\":\"3031111234\"},\"dateOfBirth\":\"01011900\",\"name\":" +
        "{\"firstName\":\"firstName\",\"lastName\":\"lastName\"}},\"cardLast4Digits\":\"4448\",\"cardType\":\"Visa\",\"customerDefinedName\":\"firstName lastName\"," +
        "\"cvv\":\"123\",\"defaultInstrument\":true,\"expirationDate\":\"1222\",\"maskedAccountNumber\":\"123456******4448\",\"paymentMode\":\"OneTimePayment\"," +
        "\"token\":\"TEST_TOKEN\"},{\"billTo\":{\"address\":{\"city\":\"Denver\",\"country\":\"USA\",\"line1\":\"1234 Test Ave\",\"state\":\"Co\",\"zip\":\"80112\"}," +
        "\"contact\":{\"emailAddress\":\"someone@someUrl.com\",\"phone\":\"3031111234\"},\"dateOfBirth\":\"01011900\",\"name\":{\"firstName\":\"firstName\"," +
        "\"lastName\":\"lastName\"}},\"cardLast4Digits\":\"4472\",\"cardType\":\"MasterCard\",\"customerDefinedName\":\"firstName lastName\",\"cvv\":\"124\"," +
        "\"defaultInstrument\":false,\"expirationDate\":\"1222\",\"maskedAccountNumber\":\"123456******4472\",\"paymentMode\":\"OneTimePayment\"," +
        "\"token\":\"TEST_CARD_MASTERCARD_TOKEN\"}],\"walletId\":\"TEST_WALLET\"}]}";

    public static final String GET_WALLET_RESPONSE_BANK_ONLY = "{\"wallets\":[{\"walletId\":\"TEST_WALLET\",\"banks\":[{\"defaultInstrument\":false," +
        "\"customerDefinedName\":\"firstName lastName\",\"token\":\"TEST_BANK_CHECKING_TOKEN\",\"paymentMode\":\"OneTimePayment\",\"billTo\":{\"address\":{\"city\":\"Denver\"," +
        "\"country\":\"USA\",\"line1\":\"1234 Test Ave\",\"state\":\"Co\",\"zip\":\"80112\"},\"name\":{\"firstName\":\"firstName\",\"lastName\":\"lastName\"}}," +
        "\"maskedAccountNumber\":\"***9999\",\"accountType\":\"Checking\",\"expirationDate\":\"9999\",\"routingNumber\":\"12345678\"}]}]}";

    public static final String GET_WALLET_RESPONSE_CARD_ONLY = "{\"wallets\":[{\"walletId\":\"TEST_WALLET\",\"paymentCards\":[{\"defaultInstrument\":true," +
        "\"customerDefinedName\":\"firstName lastName\",\"token\":\"TEST_CARD_VISA_TOKEN\",\"paymentMode\":\"OneTimePayment\",\"billTo\":{\"address\":" +
        "{\"city\":\"Denver\",\"country\":\"USA\",\"line1\":\"1234 Test Ave\",\"state\":\"Co\",\"zip\":\"80112\"},\"name\":{\"firstName\":\"firstName\"," +
        "\"lastName\":\"lastName\"}},\"maskedAccountNumber\":\"123456******4448\",\"cardType\":\"Visa\",\"expirationDate\":\"1222\",\"cardLast4Digits\":\"4448\"}]}]}";

    public static final String GET_WALLET_RESPONSE_MULTI_USER1 = "{\"wallets\":[{\"paymentCards\":[{\"defaultInstrument\":true,\"customerDefinedName\":" +
        "\"firstName lastName\",\"token\":\"CARD_TEST_TOKEN\",\"paymentMode\":\"RecurringPayment\",\"billTo\":null,\"maskedAccountNumber\":" +
        "\"123456******7890\",\"cardType\":\"Visa\",\"cvv\":null,\"expirationDate\":\"1223\",\"cardLast4Digits\":\"7890\"}],\"banks\":" +
        "[{\"defaultInstrument\":false,\"customerDefinedName\":\"firstName lastName\",\"token\":\"BANK_TEST_TOKEN\",\"paymentMode\":" +
        "\"OneTimePayment\",\"billTo\":null,\"maskedAccountNumber\":\"***5678\",\"accountType\":\"Checking\",\"bankAccountLast4Digits\":" +
        "\"5678\",\"routingNumber\":\"122101191\"}],\"walletId\":\"WALLET_TEST\"}]}";

    public static final String GET_WALLET_RESPONSE_MULTI_USER2 = "{\"wallets\":[{\"paymentCards\":[{\"defaultInstrument\":false,\"customerDefinedName\":" +
        "\"firstName lastName\",\"token\":\"TEST_CARD_TOKEN\",\"paymentMode\":\"OneTimePayment\",\"billTo\":null,\"maskedAccountNumber\":" +
        "\"123456******1234\",\"cardType\":\"MasterCard\",\"cvv\":null,\"expirationDate\": \"1223\",\"cardLast4Digits\":\"1234\"}],\"banks\":" +
        "[{\"defaultInstrument\":false,\"customerDefinedName\":\"firstName lastName\",\"token\":\"TEST_BANK_TOKEN\",\"paymentMode\":" +
        "\"OneTimePayment\",\"billTo\":null,\"maskedAccountNumber\":\"***4321\",\"accountType\":\"Savings\",\"bankAccountLast4Digits\":" +
        "\"4321\",\"routingNumber\":\"123456789\"}],\"walletId\":\"TEST_WALLET\"}]}";

    public static final String GET_WALLET_RESPONSE_NO_CARD_OR_BANK = "{\"wallets\":[{\"walletId\":\"TEST_WALLET\"}]}";

    public static final String POST_CARD_TO_WALLET_RESPONSE = "{\"avsCode\":null,\"cardLast4Digits\":\"4448\",\"cardType\":\"Visa\",\"expirationDate\":\"1222\"," +
        "\"maskedAccountNumber\":\"123456******4448\",\"token\":\"TEST_TOKEN\"}";

    public static final String DELETE_WALLET_RESPONSE_SUCCESS = "{\"result\":\"Success\"}";

    public static final String PUT_WALLET_RESPONSE_ERROR = "{\"status\":\"Error\"}";

    public static final String PUT_WALLET_RESPONSE_SUCCESS = "{\"status\":\"Success\"}";

    public static final String EMPTY_PS_RESPONSE = "{}";
    public static final String WALLET_RESPONSE_EMPTY_WALLET = "{\"wallets\":[]}";
    public static final String WALLET_RESPONSE_NO_PAYMENT_INSTRUMENTS = "{\"wallets\":[{\"paymentCards\":[],\"banks\":" +
        "[],\"walletId\":\"TEST_WALLET\"}]}";

    public static final String PAYMENT_KEY_SERVICE_ERROR = "{\"messages\":{\"PAYMENT-0000\":\"Unable to return key.\"}}";

    public static final String PAYMENT_SERVICE_ERROR_9999 = "{\"messages\":{\"PAYMENT-9999\":\"Failed to process transaction. Please try again later.\"}}";
    public static final String PAYMENT_SERVICE_ERROR_8000 = "{\"messages\":{\"PAYMENT-8000\":\"Unable to communicate with Payment Service.\"}}";

    public static AddToWalletRequest generateAddToWalletRequest(String paymentType, Boolean setDefaultInstrument, Boolean setLongTermStorage) {

        AddToWalletRequest walletRequest = new AddToWalletRequest();

        walletRequest.setChannel("CONSUMER_INT");

        Address address = new Address();
        address.setCity("Englewood");
        address.setCountry("USA");
        address.setLine1("183 Inverness Dr");
        address.setState("Co");
        address.setZip("80112");

        BillingInfo billingInfo = new BillingInfo();
        billingInfo.setBillingArrangementId("8497100099999999");
        billingInfo.setMarket("TEST_MARKET");
        billingInfo.setRegion("TEST_REGION");

        Name name = new Name();
        name.setFirstName("firstName");
        name.setLastName("lastName");

        Contact contact = new Contact();
        contact.setPhone("3039999999");
        contact.setEmailAddress("test@test.com");

        BillTo billTo = new BillTo();
        billTo.setAddress(address);
        billTo.setContact(contact);
        billTo.setName(name);

        AddInstrumentToWallet addInstrumentToWallet = new AddInstrumentToWallet();
        addInstrumentToWallet.setCustomerDefinedName("firstName lastName");

        addInstrumentToWallet.setDefaultInstrument(setDefaultInstrument);

        ChannelCustomData channelCustomData = new ChannelCustomData();
        channelCustomData.setChannelCustomDataField1("TestField1");
        channelCustomData.setChannelCustomDataField5("TestField5");
        channelCustomData.setChannelCustomDataField17("TestField17");

        OrderItem orderItem1 = new OrderItem();
        orderItem1.setProductCode("testProdcutCode1");
        orderItem1.setProductName("testProduct1");
        orderItem1.setProductSKU("testProductSKU1");
        orderItem1.setQuantity(10);
        orderItem1.setUnitPrice(10.99);

        OrderItem orderItem2 = new OrderItem();
        orderItem2.setProductCode("testProdcutCode2");
        orderItem2.setProductName("testProduct2");
        orderItem2.setProductSKU("testProductSKU2");
        orderItem2.setQuantity(7);
        orderItem2.setUnitPrice(7.99);

        ArrayList<OrderItem> orderItems = new ArrayList<OrderItem>();
        orderItems.add(orderItem1);
        orderItems.add(orderItem2);

        ShipTo shipTo = new ShipTo();
        shipTo.setAddress(address);
        shipTo.setName(name);
        shipTo.setContact(contact);
        shipTo.setShippingMethod("Overnight Air");

        OrderInfo orderInfo = new OrderInfo();
        orderInfo.setChannelCustomData(channelCustomData);
        orderInfo.setOrderItems(orderItems);
        orderInfo.setOrderItems(orderItems);
        orderInfo.setShipTo(shipTo);

        walletRequest.setBillingInfo(billingInfo);
        walletRequest.setBillTo(billTo);
        walletRequest.setAddInstrumentToWallet(addInstrumentToWallet);
        walletRequest.setCustomerId("TEST_CUSTOMER_GUID");
        walletRequest.setOrderInfo(orderInfo);

        if(paymentType == "bank") {
            BankDetails bankDetails = new BankDetails();
            bankDetails.setAccountType("Checking");
            bankDetails.setEncryptedAccountNumber("TEST_ENCRYPTED_BANK_VALUE");
            bankDetails.setRoutingNumber("9999999999");
            walletRequest.setBankDetails(bankDetails);
        }

        if(paymentType == "card") {
            CardDetails cardDetails = new CardDetails();
            cardDetails.setCardType("Visa");
            cardDetails.setEncryptedCardNumber("TEST_ENCRYPTED_CARD_VALUE");
            cardDetails.setExpirationDate("9999");
            cardDetails.setCvv("999");
            cardDetails.setCustomerDefinedName("firstName lastName");
            walletRequest.setCardDetails(cardDetails);
        }

        walletRequest.setEnableDecisionManager(true);
        walletRequest.setDeviceFingerprintId("TEST_DEVICE_FINGERPRINT_ID");
        walletRequest.setIpAddress("test:ip:addr:es");

        walletRequest.setStorePaymentInstrumentLongTerm(setLongTermStorage);

        return walletRequest;
    }

    public static AutopayEnrollmentRequest generateAutopayEnrollmentRequest() {

        AutopayEnrollmentRequest autopayEnrollmentRequest = new AutopayEnrollmentRequest();
        BillingInfo billingInfo = new BillingInfo();

        billingInfo.setBillingArrangementId("8497100099999999");
        billingInfo.setMarket("TEST_MARKET");
        billingInfo.setRegion("TEST_REGION");

        autopayEnrollmentRequest.setChannel("TEST_CHANNEL");
        autopayEnrollmentRequest.setCustomerId("TEST_CUSTOMER_ID");
        autopayEnrollmentRequest.setToken("TEST_TOKEN");
        autopayEnrollmentRequest.setBillingInfo(billingInfo);

        return autopayEnrollmentRequest;

    }

    public static AutopayWithdrawRequest generateAutopayWithdrawRequest() {

        AutopayWithdrawRequest autopayWithdrawRequest = new AutopayWithdrawRequest();
        BillingInfo billingInfo = new BillingInfo();

        billingInfo.setBillingArrangementId("8497100099999999");
        billingInfo.setMarket("TEST_MARKET");
        billingInfo.setRegion("TEST_REGION");

        autopayWithdrawRequest.setChannel("TEST_CHANNEL");
        autopayWithdrawRequest.setBillingInfo(billingInfo);

        return autopayWithdrawRequest;
    }

    public static DeleteExistingPaymentInstrumentRequest generateDeleteExistingPaymentInstrumentRequest(String paymentInstrumentType) {

        DeleteExistingPaymentInstrumentRequest deleteExistingPaymentInstrumentRequest = new DeleteExistingPaymentInstrumentRequest();
        deleteExistingPaymentInstrumentRequest.setChannel("TEST_CHANNEL");
        deleteExistingPaymentInstrumentRequest.setPaymentToken("TEST_TOKEN");
        deleteExistingPaymentInstrumentRequest.setCustomerId("TEST_CUSTOMER_ID");

        BillTo billTo = new BillTo();

        Address address = new Address();
        address.setCity("Englewood");
        address.setCountry("USA");
        address.setLine1("183 Inverness Dr");
        address.setState("Co");
        address.setZip("80112");

        Name name = new Name();
        name.setFirstName("firstName");
        name.setLastName("lastName");

        Contact contact = new Contact();
        contact.setPhone("3039999999");
        contact.setEmailAddress("test@test.com");

        billTo.setAddress(address);
        billTo.setContact(contact);
        billTo.setName(name);

        deleteExistingPaymentInstrumentRequest.setBillTo(billTo);

        if(paymentInstrumentType == "bank") {
            CpcUpdateBankDetails bankDetails = new CpcUpdateBankDetails();

            bankDetails.setDefaultInstrument(true);
            bankDetails.setBankAccountType("Checking");
            bankDetails.setBankAccountLast4Digits("1111");
            bankDetails.setToken("TEST_TOKEN");
            bankDetails.setMaskedAccountNumber("******1111");

            deleteExistingPaymentInstrumentRequest.setBankDetails(bankDetails);

        } else {
            CpcUpdateCardDetails cardDetails = new CpcUpdateCardDetails();

            cardDetails.setDefaultInstrument(true);
            cardDetails.setCardType("Visa");
            cardDetails.setCardLast4Digits("4448");
            cardDetails.setExpirationDate("1222");
            cardDetails.setToken("TEST_TOKEN");
            cardDetails.setMaskedCardNumber("************4448");

            deleteExistingPaymentInstrumentRequest.setCardDetails(cardDetails);
        }

        return deleteExistingPaymentInstrumentRequest;
    }

    public static GetAllPaymentInstrumentsRequest generateGetAllPaymentInstrumentsRequest() {

        GetAllPaymentInstrumentsRequest existingPaymentInstrumentsRequest = new GetAllPaymentInstrumentsRequest();
        existingPaymentInstrumentsRequest.setBillingArrangementId("8497100099999999");
        existingPaymentInstrumentsRequest.setChannel("TEST_CHANNEL");
        existingPaymentInstrumentsRequest.setCustomerId("TEST_CUSTOMER_ID");

        return existingPaymentInstrumentsRequest;
    }

    public static GetAllPaymentInstrumentsRequest generateGetAllPaymentInstrumentsMultiUserRequest() {

        GetAllPaymentInstrumentsRequest existingPaymentInstrumentsRequest = new GetAllPaymentInstrumentsRequest();
        existingPaymentInstrumentsRequest.setBillingArrangementId("8497100099999999");
        existingPaymentInstrumentsRequest.setChannel("TEST_CHANNEL");
        existingPaymentInstrumentsRequest.setCustomerId("TEST_CUSTOMER_ID|CUSTOMER_ID_TEST|CUSTOMER_ID_TEST");

        return existingPaymentInstrumentsRequest;
    }

    public static GetExistingPaymentInstrumentRequest generateGetExistingPaymentInstrumentRequest() {

        GetExistingPaymentInstrumentRequest getExistingPaymentInstrumentRequest = new GetExistingPaymentInstrumentRequest();
        getExistingPaymentInstrumentRequest.setBillingArrangementId("8497100099999999");
        getExistingPaymentInstrumentRequest.setChannel("TEST_CHANNEL");
        getExistingPaymentInstrumentRequest.setCustomerId("TEST_CUSTOMER_ID");
        getExistingPaymentInstrumentRequest.setPaymentToken("TEST_TOKEN");

        return getExistingPaymentInstrumentRequest;
    }

    public static GetPaymentConfigurationRequest generateGetPaymentConfigurationRequest() {

        GetPaymentConfigurationRequest paymentConfigurationRequest = new GetPaymentConfigurationRequest();
        paymentConfigurationRequest.setChannel("TEST_CHANNEL");
        paymentConfigurationRequest.setBillingArrangementId("8497100099999999");
        paymentConfigurationRequest.setPaymentFrequency("TEST_PAYMENT_FREQUENCY");

        return paymentConfigurationRequest;

    }

    public static HttpClientErrorException generateHttpClientErrorException(String errorString) {

        byte[] errorArray = errorString.getBytes(StandardCharsets.UTF_8);

        return new HttpClientErrorException(HttpStatus.BAD_REQUEST,"Bad Request",errorArray,StandardCharsets.UTF_8);
    }

    public static HttpServerErrorException generateHttpServerErrorException(String errorString) {

        byte[] errorArray = errorString.getBytes(StandardCharsets.UTF_8);

        return new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR,"Internal Server Error",errorArray,StandardCharsets.UTF_8);
    }

    public static GetPublicKeyRequest generatePublicKeyRequest() {

        GetPublicKeyRequest publicKeyRequest = new GetPublicKeyRequest();
        publicKeyRequest.setChannel("TEST_CHANNEL");

        return publicKeyRequest;
    }

    public static ResponseEntity<String> generateResponse(String responseBody) {

        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.set("TestResponseHeader", "TestValue");

        return new ResponseEntity<String>(responseBody, responseHeader, HttpStatus.OK);
    }

    public static Map<String, Object> generateTestClientConfig(String endpoint) {

        List<String> cpcChannelAllowList =
            Arrays.asList("XFINITY_MOBILE_LITE", "TEST_CHANNEL", "CHANNEL-TEST", "test-channel", "channel-test", "testing-channel", "test-auth-channel",
                "test-bank-exclude-channel", "lite-channel-test", "buyflow-channel-test");
        List<String> cpcBankExcludeList = Arrays.asList("test-bank-exclude-channel");
        List<String> unAuthLiteChannelList = Arrays.asList("lite-channel-test");
        List<String> unAuthBuyFlowChannelList = Arrays.asList("buyflow-channel-test");
        List<String> authChannelList = Arrays.asList("test-auth-channel");

        String environment = "unit-testing";

        Map<String, Object> clientConfig = new HashMap<>() {{
            put(AUTH_CHANNEL_LIST, authChannelList);
            put(BANK_EXCLUSION_CHANNEL_LIST, cpcBankExcludeList);
            put(CPC_CHANNEL_ALLOW_LIST, cpcChannelAllowList);
            put(ENVIRONMENT, environment);
            put(UNAUTH_LITE_CHANNEL_LIST, unAuthLiteChannelList);
            put(UNAUTH_BUYFLOW_CHANNEL_LIST, unAuthBuyFlowChannelList);
        }};

        switch(endpoint) {
            case "https://test-api.comcast.net/autopay-test":
                clientConfig.put(AUTOPAY_SERVICE_URL, endpoint);
                break;
            case "https://test-api.comcast.net/payment-configuration-test/":
                clientConfig.put(PAYMENT_CONFIGURATION_SERVICE_URL, endpoint);
                break;
            case "https://test-api.comcast.net/payment-key-test/public":
                clientConfig.put(PAYMENT_KEY_SERVICE_URL, endpoint);
                break;
            default:
                clientConfig.put(WALLET_SERVICE_URL, endpoint);
        }

        return clientConfig;
    }

    public static UpdateExistingPaymentInstrumentRequest generateUpdateExistingPaymentInstrumentRequest(String paymentInstrumentType, Boolean setDefaultInstrument) {

        UpdateExistingPaymentInstrumentRequest updateExistingPaymentInstrumentRequest = new UpdateExistingPaymentInstrumentRequest();
        updateExistingPaymentInstrumentRequest.setChannel("TEST_CHANNEL");
        updateExistingPaymentInstrumentRequest.setCustomerDefinedName("firstName lastName");
        updateExistingPaymentInstrumentRequest.setCustomerId("TEST_CUSTOMER_ID");

        BillTo billTo = new BillTo();

        Address address = new Address();
        address.setCity("Englewood");
        address.setCountry("USA");
        address.setLine1("183 Inverness Dr");
        address.setState("Co");
        address.setZip("80112");

        Name name = new Name();
        name.setFirstName("firstName");
        name.setLastName("lastName");

        Contact contact = new Contact();
        contact.setPhone("3039999999");
        contact.setEmailAddress("test@test.com");

        billTo.setAddress(address);
        billTo.setContact(contact);
        billTo.setName(name);

        updateExistingPaymentInstrumentRequest.setBillTo(billTo);

        if(paymentInstrumentType == "bank") {
            CpcUpdateBankDetails bankDetails = new CpcUpdateBankDetails();
            CpcUpdateCardDetails cardDetails = new CpcUpdateCardDetails();

            bankDetails.setBankAccountType("Checking");
            bankDetails.setMaskedAccountNumber("******1111");
            bankDetails.setBankAccountLast4Digits("1111");
            bankDetails.setToken("TEST_TOKEN");

            if(setDefaultInstrument == true) {
                bankDetails.setDefaultInstrument(true);
            }

            updateExistingPaymentInstrumentRequest.setBankDetails(bankDetails);
            updateExistingPaymentInstrumentRequest.setCardDetails(cardDetails);

        } else {
            CpcUpdateCardDetails cardDetails = new CpcUpdateCardDetails();
            CpcUpdateBankDetails bankDetails = new CpcUpdateBankDetails();

            cardDetails.setCardType("Visa");
            cardDetails.setMaskedCardNumber("************4448");
            cardDetails.setCardLast4Digits("4448");
            cardDetails.setToken("TEST_TOKEN");
            cardDetails.setExpirationDate("1222");

            if(setDefaultInstrument == true) {
                cardDetails.setDefaultInstrument(true);
            }

            updateExistingPaymentInstrumentRequest.setBankDetails(bankDetails);
            updateExistingPaymentInstrumentRequest.setCardDetails(cardDetails);

        }

        return updateExistingPaymentInstrumentRequest;

    }

    public static HttpHeaders setUpRequestHeader() {

        HttpHeaders header = new HttpHeaders();
        header.add(MethodOfServiceConstants.PARAM_SOURCE_SERVER_ID, "localhost");
        header.add(MethodOfServiceConstants.PARAM_SOURCE_SYSTEM_ID,"common-payment");
        header.add(MethodOfServiceConstants.PARAM_TIMESTAMP,  "2021-11-24T01:05:59Z");
        header.add(MethodOfServiceConstants.PARAM_TRACKING_ID,  "1");
        header.add(MethodOfServiceConstants.PARAM_CHANNEL, "test-channel");
        header.add(MethodOfServiceConstants.PARAM_AUTHORIZATION, "test-token");

        return header;
    }

    public static UrlConfiguration setUpUrlConfiguration(String requestType, String baseUrl, String clientId, Boolean includeAccountNumber) {

        UrlConfiguration urlConfig = new UrlConfiguration();
        urlConfig.setChannel("CONSUMER_INT");
        urlConfig.setCustomerId("TEST_CUSTOMER_ID");
        urlConfig.setEnvironment("dev");
        urlConfig.setPaymentFrequency("onetime");
        urlConfig.setPaymentInstrumentType(MethodOfServiceConstants.CARD);
        urlConfig.setPaymentToken("TEST_TOKEN");

        urlConfig.setRequestType(requestType);
        urlConfig.setBaseUrl(baseUrl);
        urlConfig.setClientId(clientId);

        if(includeAccountNumber) {
            urlConfig.setBillingArrangementId("8497100099999999");
        }

        return urlConfig;

    }

    public static UrlConfiguration setUpUrlConfigurationtest(String requestType, String baseUrl, String clientId) {

        UrlConfiguration urlConfig = new UrlConfiguration();
        urlConfig.setChannel("CONSUMER_INT");
        urlConfig.setEnvironment("dev");
        urlConfig.setRequestType(requestType);
        urlConfig.setBaseUrl(baseUrl);
        urlConfig.setClientId(clientId);

        return urlConfig;

    }
}
