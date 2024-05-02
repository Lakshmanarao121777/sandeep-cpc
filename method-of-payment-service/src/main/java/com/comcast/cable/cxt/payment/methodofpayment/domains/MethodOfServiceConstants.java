package com.comcast.cable.cxt.payment.methodofpayment.domains;

public class MethodOfServiceConstants {

    public static final String BANK = "bank";
    public static final String CARD = "card";
    public static final String PARAM_AUTHORIZATION = "authorization";
    public static final String PARAM_CHANNEL = "channel";
    public static final String PARAM_CUSTOMER = "customer";
    public static final String PARAM_KEY_NAME = "keyName";
    public static final String PARAM_PARTNER_ID = "partnerId";
    public static final String PARAM_SOURCE_SYSTEM_ID = "sourceSystemId";
    public static final String PARAM_SOURCE_SERVER_ID = "sourceServerId";
    public static final String PARAM_TIMESTAMP = "timestamp";
    public static final String PARAM_TOKEN = "token";
    public static final String PARAM_TRACKING_ID = "trackingId";
    public static final String TOKEN = "token";

    public static final String BILLING_ARRANGEMENT_ID = "billingArrangementId";
    public static final String CUSTOMER_ID = "customerId";
    public static final String PAYMENT_TOKEN = "paymentToken";

    public static final String COMCAST_VALUE = "Comcast";
    public static final String SUCCESS = "SUCCESS";
    public static final String ERROR = "ERROR";
    public static final String HTTP_ERROR = "HTTP_ERROR";

    public static final String CIMA_SCOPE = "urn:cpc:scope:method-of-payment-service:all";
    public static final String AMPERSAND = "&";
    public static final String ASTERISK = "*";
    public static final String EQUALS = "=";
    public static final String FORWARD_SLASH = "/";
    public static final String PIPE = "|";
    public static final String SPLIT_PIPE = "\\|";
    public static final String QUESTION_MARK = "?";

    public static final String PRODUCTION_ENVIRONMENT = "prod";

    public static final String CARD_BIN_REPLACEMENT_CHARACTERS = "******";
    public static final String AMEX_MASKED_CVV = "****";
    public static final String DEFAULT_MASKED_CVV = "***";
    public static final String AMERICAN_EXPRESS_CARD_TYPE = "AmericanExpress";
    public static final String GET_FIRST_SIX_NUMBER_REGEX = "^.{6}";

    // Path Values
    public static final String ADD_TO_WALLET_PATH = "addToWallet";
    public static final String AUTOPAY_ENROLL_PATH = "enrollInAutopay";
    public static final String AUTOPAY_WITHDRAW_PATH = "withdrawFromAutopay";
    public static final String BASE_PATH = "/api/v2/MethodOfPaymentService";
    public static final String DELETE_EXISTING_PAYMENT_INSTRUMENT_PATH = "deleteExistingPaymentInstrument";
    public static final String GET_ALL_PAYMENT_INSTRUMENTS_PATH = "getAllPaymentInstruments";
    public static final String GET_EXISTING_PAYMENT_INSTRUMENT_PATH = "getExistingPaymentInstrument";
    public static final String GET_PAYMENT_CONFIGURATION_PATH = "getPaymentConfiguration";
    public static final String GET_PUBLIC_KEY_PATH = "getPublicKey";
    public static final String UPDATE_EXISTING_PAYMENT_INSTRUMENT_PATH = "updateExistingPaymentInstrument";


    // Request Type Values
    public static final String ADD_TO_WALLET_REQUEST = "AddToWalletRequest";
    public static final String AUTOPAY_ENROLLMENT_REQUEST = "AutopayEnrollmentRequest";
    public static final String AUTOPAY_WITHDRAW_REQUEST = "AutopayWithdrawRequest";
    public static final String GET_ALL_PAYMENT_INSTRUMENTS_REQUEST = "GetAllPaymentInstrumentsRequest";
    public static final String GET_EXISTING_PAYMENT_INSTRUMENT_REQUEST = "GetExistingPaymentInstrumentRequest";
    public static final String GET_PAYMENT_CONFIGURATION_REQUEST = "GetPaymentConfigurationRequest";
    public static final String GET_PUBLIC_KEY_REQUEST = "GetPublicKeyRequest";
    public static final String PAYMENT_RECORD_CONTRACT_REQUEST = "PaymentRecordContractRequest";
    public static final String DELETE_EXISTING_PAYMENT_INSTRUMENT_REQUEST = "DeleteExistingPaymentInstrumentRequest";
    public static final String UPDATE_EXISTING_PAYMENT_INSTRUMENT_REQUEST = "UpdateExistingPaymentInstrumentRequest";

    // Map & Object Keys
    public static final String AUTH_CHANNEL_LIST = "authChannelList";
    public static final String AUTHORIZATION_HEADER = "authorizationHeader";
    public static final String AUTOPAY_SERVICE_URL = "autopayServiceUrl";
    public static final String BANK_EXCLUSION_CHANNEL_LIST = "bankExclusionChannelList";
    public static final String CHANNELS = "channels";
    public static final String CLIENT_ID = "clientId";
    public static final String CLIENT_RESPONSE_MESSAGE = "clientResponseMessage";
    public static final String CLIENT_RESPONSE_STATUS = "clientResponseStatus";
    public static final String CPC_CHANNEL_ALLOW_LIST = "cpcChannelAllowList";
    public static final String ENVIRONMENT = "environment";
    public static final String HTTP_METHOD = "httpMethod";
    public static final String PAYMENT_CONFIGURATION_SERVICE_URL = "paymentConfigurationServiceUrl";
    public static final String PAYMENT_KEY_SERVICE_URL = "paymentKeyServiceUrl";

    public static final String PAYMENT_CONTRACT_SERVICE_URL = "paymentContractServiceUrl";
    public static final String REQUEST_TYPE = "requestType";
    public static final String UNAUTH_LITE_CHANNEL_LIST = "unAuthLiteChannelList";
    public static final String UNAUTH_BUYFLOW_CHANNEL_LIST = "unAuthBuyFlowChannelList";
    public static final String URL = "url";
    public static final String VALID_CHANNEL = "validChannel";
    public static final String VALIDATION_RESPONSE_MESSAGE = "validationResponseMessage";
    public static final String WALLET_SERVICE_URL = "walletServiceUrl";

    public static final String BASE_URL = "baseUrl";
    public static final String PAYMENT_INSTRUMENT_TYPE = "paymentInstrumentType";

    // Method of payment action values
    public static final String AUTOPAY_ENROLL = "autopay_enroll";
    public static final String AUTOPAY_WITHDRAW = "autopay_withdraw";
    public static final String DELETE = "delete";
    public static final String TOKENIZE = "tokenize";
    public static final String TOKENIZE_WITH_AUTOPAY = "tokenize_with_autopay";
    public static final String UPDATE = "update";

    // Client ID values
    public static final String AUTOPAY_SERVICE = "autopayservice";
    public static final String PAYMENT_CONFIGURATION_SERVICE = "paymentconfigurationservice";
    public static final String PAYMENT_KEY_SERVICE = "paymentkeyservice";
    public static final String WALLET_SERVICE = "walletservice";
    public static final String PAYMENT_CONTRACT_SERVICE = "paymentcontractservice";

}
