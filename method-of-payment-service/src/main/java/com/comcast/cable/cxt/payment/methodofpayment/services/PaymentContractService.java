package com.comcast.cable.cxt.payment.methodofpayment.services;

import com.comcast.cable.cxt.payment.methodofpayment.vo.*;
import com.comcast.xsp.connector.core.rest.RestClientFactory;
import com.google.gson.Gson;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants.*;
import static com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants.HTTP_METHOD;
@Component
public class PaymentContractService extends ServiceClientBase {
    private final String WALLET_TERMS_TYPE = "wallet";
    private final String AUTOPAY_TERMS_TYPE = "autopay";

    public PaymentRecordContractResponse recordContract(HttpHeaders headers, AddToWalletRequest addToWalletRequest, Map<String, Object> configuration, RestClientFactory restClientFactory) {
        HttpHeaders requestHeader = getCommonHttpHeaders(headers, addToWalletRequest.getChannel());
        PaymentRecordContractRequest recordContractRequest = new PaymentRecordContractRequest();
        recordContractRequest.setChannel(addToWalletRequest.getChannel());
        recordContractRequest.setTermsType(deriveTermsType(addToWalletRequest));
       // recordContractRequest.setCustomerGuid(addToWalletRequest.getCustomerId());
        recordContractRequest.setAccountNumber(addToWalletRequest.getBillingInfo().getBillingArrangementId());
        PaymentRecordContractResponse recordContractResponse = new PaymentRecordContractResponse();
        HttpEntity<String> entity = new HttpEntity(recordContractRequest, requestHeader);

        UrlConfiguration urlConfiguration = new UrlConfiguration();
        urlConfiguration.setBaseUrl((String) configuration.get(PAYMENT_CONTRACT_SERVICE_URL));
        urlConfiguration.setClientId(PAYMENT_CONTRACT_SERVICE);

        String url = getRequestUrl(urlConfiguration);

        Map<String,Object> clientParameters = new HashMap<>();
        clientParameters.put(URL, url);
        clientParameters.put(CLIENT_ID, PAYMENT_CONTRACT_SERVICE);
        clientParameters.put(HTTP_METHOD, HttpMethod.POST);

        Map<String, String> response = callClient(restClientFactory, entity, clientParameters);

        if(response.get(CLIENT_RESPONSE_STATUS) == SUCCESS) {
            recordContractResponse = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), PaymentRecordContractResponse.class);
        } else if (response.get(CLIENT_RESPONSE_STATUS) == ERROR) {
            recordContractResponse.setCpcContractStatus(ERROR);
            ErrorDetails errorDetails = new ErrorDetails();
            errorDetails.setMessage(response.get(CLIENT_RESPONSE_MESSAGE));
            recordContractResponse.setContractErrorDetails(errorDetails);
        } else if (response.get(CLIENT_RESPONSE_STATUS) == HTTP_ERROR) {
            recordContractResponse.setCpcContractStatus(ERROR);
            ErrorDetails errorDetails = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), ErrorDetails.class);
            recordContractResponse.setContractErrorDetails(errorDetails);
        }
       return recordContractResponse;
    }

    private String deriveTermsType(AddToWalletRequest addToWalletRequest) {
        String termsType= null;
        if(addToWalletRequest.getEnrollInAutopay()){
            termsType = AUTOPAY_TERMS_TYPE;
        }else{
            termsType = WALLET_TERMS_TYPE;
        }
        return termsType;
    }
}
