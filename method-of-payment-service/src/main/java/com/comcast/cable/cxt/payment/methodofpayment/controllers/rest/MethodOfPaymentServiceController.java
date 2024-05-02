package com.comcast.cable.cxt.payment.methodofpayment.controllers.rest;

import com.comcast.cable.cxt.payment.methodofpayment.config.MethodOfPaymentServiceConfig;
import com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfPaymentService;
import com.comcast.cable.cxt.payment.methodofpayment.services.*;
import com.comcast.cable.cxt.payment.methodofpayment.vo.*;
import com.comcast.xsp.connector.core.rest.RestClientFactory;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import static com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants.*;

@Log4j2
@RestController
public class MethodOfPaymentServiceController {

    private final MethodOfPaymentServiceConfig config;

    @Autowired
    public MethodOfPaymentServiceController(MethodOfPaymentServiceConfig config) {
        this.config = config;
    }

    @Autowired
    private AutopayService autopayService;

    @Autowired
    private PaymentConfigurationService paymentConfigurationService;

    @Autowired
    private PublicKeyService publicKeyService;

    @Autowired
    private WalletService walletService;

    @Autowired
    private PaymentContractService paymentContractService;


    @Resource(name = "factory.restClient")
    public RestClientFactory restClientFactory;

    @Value("${service.environment}")
    private String environment;

    @Value("${restclient.def.autopayservice.endpoint}")
    private String autopayServiceUrl;

    @Value("${restclient.def.paymentkeyservice.endpoint}")
    private String paymentKeyServiceUrl;

    @Value("${restclient.def.paymentconfigurationservice.endpoint}")
    private String paymentConfigurationServiceUrl;

    @Value("${restclient.def.walletservice.endpoint}")
    private String walletServiceUrl;

    @Value("${restclient.def.paymentcontractservice.endpoint}")
    private String paymentContractServiceUrl;

    @Value("#{'${cpc.channel.allowList}'.split(',')}")
    private List<String> cpcChannelAllowList;

    @Value("#{'${cpc.auth.channels}'.split(',')}")
    private List<String> authChannelList;

    @Value("#{'${cpc.unauth.lite.channels}'.split(',')}")
    private List<String> unAuthLiteChannelList;

    @Value("#{'${cpc.unauth.buyflow.channels}'.split(',')}")
    private List<String> unAuthBuyFlowChannelList;

    @Value("#{'${cpc.bankexclude.channels}'.split(',')}")
    private List<String> bankExclusionChannelList;

    private final String ADD_TO_WALLET_REQUEST_PATH = BASE_PATH + FORWARD_SLASH + ADD_TO_WALLET_PATH + FORWARD_SLASH + ASTERISK;
    private final String AUTOPAY_ENROLLMENT_REQUEST_PATH = BASE_PATH + FORWARD_SLASH + AUTOPAY_ENROLL_PATH + FORWARD_SLASH + ASTERISK;
    private final String AUTOPAY_WITHDRAW_REQUEST_PATH = BASE_PATH + FORWARD_SLASH + AUTOPAY_WITHDRAW_PATH + FORWARD_SLASH + ASTERISK;
    private final String DELETE_EXISTING_PAYMENT_INSTRUMENT_REQUEST_PATH = BASE_PATH + FORWARD_SLASH + DELETE_EXISTING_PAYMENT_INSTRUMENT_PATH + FORWARD_SLASH + ASTERISK;
    private final String GET_PAYMENT_CONFIGURATION_REQUEST_PATH = BASE_PATH + FORWARD_SLASH + GET_PAYMENT_CONFIGURATION_PATH + FORWARD_SLASH + ASTERISK;
    private final String GET_PUBLIC_KEY_REQUEST_PATH = BASE_PATH + FORWARD_SLASH + GET_PUBLIC_KEY_PATH + FORWARD_SLASH + ASTERISK;;
    private final String GET_EXISTING_PAYMENT_INSTRUMENT_REQUEST_PATH = BASE_PATH + FORWARD_SLASH + GET_EXISTING_PAYMENT_INSTRUMENT_PATH + FORWARD_SLASH + ASTERISK;
    private final String GET_ALL_PAYMENT_INSTRUMENTS_REQUEST_PATH = BASE_PATH + FORWARD_SLASH + GET_ALL_PAYMENT_INSTRUMENTS_PATH + FORWARD_SLASH + ASTERISK;
    private final String UPDATE_EXISTING_PAYMENT_INSTRUMENT_REQUEST_PATH = BASE_PATH + FORWARD_SLASH + UPDATE_EXISTING_PAYMENT_INSTRUMENT_PATH + FORWARD_SLASH + ASTERISK;

    private final String METHOD_OF_PAYMENT_SERVICE_NAME = "MethodOfPaymentService";

    @RequestMapping (method = {RequestMethod.GET}, value = "/v2/methodOfPaymentService/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MethodOfPaymentService> methodOfPaymentService (@PathVariable String id) {
        return new ResponseEntity<>(new MethodOfPaymentService(id), HttpStatus.OK);
    }

    @RequestMapping(method = {RequestMethod.GET}, value = "/api/v2/methodOfPaymentService/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MethodOfPaymentService> methodOfPaymentServiceSecure(@PathVariable String id) {
        return new ResponseEntity<>(new MethodOfPaymentService(id), HttpStatus.OK);
    }

    @RequestMapping(value = "/api/v2", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> index() {
        return new HashMap<String, String>() {
            private static final long serialVersionUID = -7006213790932083398L;

            {
                put("message", "Service Name - " + config.getServiceName());
                put("date", new java.util.Date().toString());
            }
        };
    }


    @PostMapping(name = METHOD_OF_PAYMENT_SERVICE_NAME, value = GET_PUBLIC_KEY_REQUEST_PATH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public GetPublicKeyResponse getPaymentPublicKey(@RequestHeader HttpHeaders headers, @RequestBody GetPublicKeyRequest publicKeyRequest) {

        Map<String, Object> configMap = createClientConfig(publicKeyRequest.getClass().getSimpleName());

        return publicKeyService.retrievePaymentServicePublicKey(headers, publicKeyRequest, configMap, restClientFactory);
    }

    @PostMapping(name = METHOD_OF_PAYMENT_SERVICE_NAME, value = GET_ALL_PAYMENT_INSTRUMENTS_REQUEST_PATH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public GetAllPaymentInstrumentsResponse getAllPaymentInstruments(@RequestHeader HttpHeaders headers,
                                                                     @RequestBody GetAllPaymentInstrumentsRequest getAllPaymentInstrumentsRequest) {

        Map<String, Object> configMap = createClientConfig(getAllPaymentInstrumentsRequest.getClass().getSimpleName());

        return walletService.getAllPaymentInstruments(headers, getAllPaymentInstrumentsRequest, configMap, restClientFactory);
    }

    @PostMapping(name = METHOD_OF_PAYMENT_SERVICE_NAME, value = GET_EXISTING_PAYMENT_INSTRUMENT_REQUEST_PATH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public GetExistingPaymentInstrumentResponse getExistingPaymentInstrument(@RequestHeader HttpHeaders headers,
                                                                             @RequestBody GetExistingPaymentInstrumentRequest getPaymentInstrumentRequest) {

        Map<String, Object> configMap = createClientConfig(getPaymentInstrumentRequest.getClass().getSimpleName());

        return walletService.getExistingPaymentInstrument(headers, getPaymentInstrumentRequest, configMap, restClientFactory);
    }

    @PostMapping(name = METHOD_OF_PAYMENT_SERVICE_NAME, value = UPDATE_EXISTING_PAYMENT_INSTRUMENT_REQUEST_PATH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public UpdateExistingPaymentInstrumentResponse updateExistingPaymentInstrument(@RequestHeader HttpHeaders headers,
                                                                                   @RequestBody UpdateExistingPaymentInstrumentRequest updatePaymentInstrumentRequest) {

        Map<String, Object> configMap = createClientConfig(updatePaymentInstrumentRequest.getClass().getSimpleName());

        return walletService.updateExistingPaymentInstrument(headers, updatePaymentInstrumentRequest, configMap, restClientFactory);
    }

    @PostMapping(name = METHOD_OF_PAYMENT_SERVICE_NAME, value = DELETE_EXISTING_PAYMENT_INSTRUMENT_REQUEST_PATH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public DeleteExistingPaymentInstrumentResponse deleteExistingPaymentInstrument(@RequestHeader HttpHeaders headers,
                                                                                   @RequestBody DeleteExistingPaymentInstrumentRequest deletePaymentInstrumentRequest) {

        Map<String, Object> configMap = createClientConfig(deletePaymentInstrumentRequest.getClass().getSimpleName());

        return walletService.deleteExistingPaymentInstrument(headers, deletePaymentInstrumentRequest, configMap, restClientFactory);
    }

    @PostMapping(name = METHOD_OF_PAYMENT_SERVICE_NAME, value = GET_PAYMENT_CONFIGURATION_REQUEST_PATH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public GetPaymentConfigurationResponse getPaymentConfiguration(@RequestHeader HttpHeaders headers,
                                                                   @RequestBody GetPaymentConfigurationRequest paymentConfigurationRequest) {

        Map<String, Object> configMap = createClientConfig(paymentConfigurationRequest.getClass().getSimpleName());

        return paymentConfigurationService.getPaymentConfigurationDetails(headers, paymentConfigurationRequest, configMap, restClientFactory);
    }

    @PostMapping(name = METHOD_OF_PAYMENT_SERVICE_NAME, value = AUTOPAY_ENROLLMENT_REQUEST_PATH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public AutopayEnrollmentResponse enrollInAutopay(@RequestHeader HttpHeaders headers, @RequestBody AutopayEnrollmentRequest autopayEnrollmentRequest) {

        Map<String, Object> configMap = createClientConfig(autopayEnrollmentRequest.getClass().getSimpleName());

        return autopayService.enrollInAutopay(headers, autopayEnrollmentRequest, configMap, restClientFactory);
    }

    @PostMapping(name = METHOD_OF_PAYMENT_SERVICE_NAME, value = AUTOPAY_WITHDRAW_REQUEST_PATH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public AutopayWithdrawResponse withdrawFromAutopay(@RequestHeader HttpHeaders headers, @RequestBody AutopayWithdrawRequest autopayWithdrawRequest) {

        Map<String, Object> configMap = createClientConfig(autopayWithdrawRequest.getClass().getSimpleName());

        return autopayService.withdrawFromAutopay(headers, autopayWithdrawRequest, configMap, restClientFactory);
    }

    @RequestMapping(name = METHOD_OF_PAYMENT_SERVICE_NAME, method = {RequestMethod.POST}, value = ADD_TO_WALLET_REQUEST_PATH, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public AddToWalletResponse addToWallet(@RequestHeader HttpHeaders headers, @RequestBody AddToWalletRequest addToWalletRequest) {

        AddToWalletResponse addToWalletResponse = null;
        PaymentRecordContractResponse contractResponse = null;
        Map<String, Object> configMap = null;
        Map<String, Object> contractConfigMap = null;

        if(addToWalletRequest.getEnrollInAutopay() == null || !addToWalletRequest.getEnrollInAutopay()) {
            configMap = createClientConfig(addToWalletRequest.getClass().getSimpleName());
            addToWalletResponse = walletService.addPaymentInstrumentToWallet(headers, addToWalletRequest, configMap, restClientFactory);
        } else {
            configMap = createClientConfig(AUTOPAY_ENROLLMENT_REQUEST);
            addToWalletResponse = autopayService.tokenizeWithAutopay(headers, addToWalletRequest, configMap, restClientFactory);

            if(addToWalletResponse.getSubmissionDetails().getCpcStatus()== SUCCESS) {
                contractConfigMap = createClientConfig(PAYMENT_RECORD_CONTRACT_REQUEST);
                contractResponse = paymentContractService.recordContract(headers, addToWalletRequest, contractConfigMap, restClientFactory);
                addToWalletResponse.setContractDetails(contractResponse);
            }
        }

        return addToWalletResponse;

    }

    private Map<String, Object> createClientConfig(String requestType) {
        Map<String,Object> configMap = new HashMap<>() {{
            put(AUTH_CHANNEL_LIST, authChannelList);
            put(BANK_EXCLUSION_CHANNEL_LIST, bankExclusionChannelList);
            put(CPC_CHANNEL_ALLOW_LIST, cpcChannelAllowList);
            put(ENVIRONMENT, environment);
            put(UNAUTH_LITE_CHANNEL_LIST, unAuthLiteChannelList);
            put(UNAUTH_BUYFLOW_CHANNEL_LIST, unAuthBuyFlowChannelList);
        }};

        switch(requestType) {
            case AUTOPAY_ENROLLMENT_REQUEST:
            case AUTOPAY_WITHDRAW_REQUEST:
                configMap.put(AUTOPAY_SERVICE_URL, autopayServiceUrl);
                break;
            case GET_PAYMENT_CONFIGURATION_REQUEST:
                configMap.put(PAYMENT_CONFIGURATION_SERVICE_URL, paymentConfigurationServiceUrl);
                break;
            case GET_PUBLIC_KEY_REQUEST:
                configMap.put(PAYMENT_KEY_SERVICE_URL, paymentKeyServiceUrl);
                break;
            case PAYMENT_RECORD_CONTRACT_REQUEST:
                configMap.put(PAYMENT_CONTRACT_SERVICE_URL, paymentContractServiceUrl);
                break;
            default:
                configMap.put(WALLET_SERVICE_URL, walletServiceUrl);
        }

        return configMap;
    }
}
