package com.comcast.cable.cxt.payment.methodofpayment.services;

import com.comcast.cable.cxt.payment.methodofpayment.vo.ErrorResponse;
import com.comcast.cable.cxt.payment.methodofpayment.vo.GetPublicKeyRequest;
import com.comcast.cable.cxt.payment.methodofpayment.vo.GetPublicKeyResponse;
import com.comcast.cable.cxt.payment.methodofpayment.vo.UrlConfiguration;
import com.comcast.xsp.connector.core.rest.RestClientFactory;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.*;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import static com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants.*;
import static com.comcast.cable.cxt.payment.methodofpayment.utilities.MethodOfPaymentServiceUtilities.channelAuthValidation;

@Log4j2
@Component
public class PublicKeyService extends ServiceClientBase {

    private String paymentPublicKeyName = "publicKey";
    private String channelName;
    private String psErrorCodeKeyName = "psErrorCode";
    private String psErrorMessageKeyName = "psErrorMessage";
    private String OtherExceptionKeyName = "Exception";
    private int cacheTimeToLiveDurationInHours = 24;

    private int minValidKeyLength = 10;

    Cache<String, Map<String, String>> publicKeyCache =
        CacheBuilder.newBuilder()
            .expireAfterWrite(cacheTimeToLiveDurationInHours, TimeUnit.HOURS)
            .build();

    public GetPublicKeyResponse retrievePaymentServicePublicKey(HttpHeaders headers, GetPublicKeyRequest getPublicKeyRequest, Map<String, Object> configuration, RestClientFactory restClientFactory) {

        GetPublicKeyResponse getPublicKeyResponse = new GetPublicKeyResponse();

        Map<String, Object> channelValidation = channelAuthValidation(headers, configuration);

        if(!(Boolean) channelValidation.get(VALID_CHANNEL)) {
            getPublicKeyResponse.setCpcStatus(ERROR);
            getPublicKeyResponse.setPublicKey(null);
            getPublicKeyResponse.setPsErrorCode(null);
            getPublicKeyResponse.setPsErrorMessage((String) channelValidation.get(VALIDATION_RESPONSE_MESSAGE));
        } else {

            Map<String, String> publicKeyResponse = getPublicKeyCache(headers, getPublicKeyRequest, configuration, restClientFactory);

            getPublicKeyResponse =  deriveGetPublicKeyResponse(publicKeyResponse, channelName);

            if(getPublicKeyResponse.getCpcStatus().equalsIgnoreCase(ERROR)){
                publicKeyCache.invalidate(channelName);
            }
        }

        return getPublicKeyResponse;

    }

    public GetPublicKeyResponse deriveGetPublicKeyResponse(Map<String, String> publicKeyResponse, String channelName) {
        GetPublicKeyResponse getPublicKeyResponse = new GetPublicKeyResponse();
        if(publicKeyResponse.containsKey(channelName)) {
            if (publicKeyResponse.get(channelName) != null && publicKeyResponse.get(channelName).length() > minValidKeyLength) {
                getPublicKeyResponse.setCpcStatus(SUCCESS);
            } else {
                getPublicKeyResponse.setCpcStatus(ERROR);
            }
            getPublicKeyResponse.setPublicKey(publicKeyResponse.get(channelName));
            getPublicKeyResponse.setPsErrorCode(null);
            getPublicKeyResponse.setPsErrorMessage(null);
        } else if(publicKeyResponse.containsKey(psErrorMessageKeyName) || publicKeyResponse.containsKey(psErrorCodeKeyName)) {
                     getPublicKeyResponse.setCpcStatus(ERROR);
                     getPublicKeyResponse.setPublicKey(null);
                    if(publicKeyResponse.containsKey(psErrorCodeKeyName)) {
                        getPublicKeyResponse.setPsErrorCode(publicKeyResponse.get(psErrorCodeKeyName));
                    }else{
                        getPublicKeyResponse.setPsErrorCode(null);
                    }
                    if(publicKeyResponse.containsKey(psErrorMessageKeyName)) {
                        getPublicKeyResponse.setPsErrorMessage(publicKeyResponse.get(psErrorMessageKeyName));
                    }else{
                        getPublicKeyResponse.setPsErrorCode(null);
                    }

        }else if(publicKeyResponse.containsKey(OtherExceptionKeyName)) {
                    getPublicKeyResponse.setCpcStatus(ERROR);
                    getPublicKeyResponse.setPublicKey(null);
                    getPublicKeyResponse.setPsErrorCode(null);
                    getPublicKeyResponse.setPsErrorMessage(publicKeyResponse.get(OtherExceptionKeyName));
        }else {
                    getPublicKeyResponse.setCpcStatus(ERROR);
                    getPublicKeyResponse.setPublicKey(null);
                    getPublicKeyResponse.setPsErrorCode(null);
                    getPublicKeyResponse.setPsErrorMessage(null);
        }
        return getPublicKeyResponse;
    }

    private Map<String, String> getPublicKeyCache(HttpHeaders headers, GetPublicKeyRequest getPublicKeyRequest, Map<String, Object> configuration, RestClientFactory restClientFactory) {
        channelName = getPublicKeyRequest.getChannel();
        Map<String, String> publicKeyMap = new HashMap<>();

        try {
            publicKeyMap =
                publicKeyCache.get(channelName, new Callable<Map<String, String>>() {
                    @Override
                    public Map<String, String> call() {
                        return getPaymentPublicKey(headers, getPublicKeyRequest, configuration, restClientFactory);
                    }
                });
        } catch (ExecutionException e) {
            publicKeyMap.put(OtherExceptionKeyName, e.getMessage());
        }

        return publicKeyMap;

    }

    public Map<String, String> getPaymentPublicKey(HttpHeaders headers, GetPublicKeyRequest getPublicKeyRequest, Map<String, Object> configuration, RestClientFactory restClientFactory) {
        Map<String, String> publicKeyMap = new HashMap<>();

        HttpHeaders requestHeader = getCommonHttpHeaders(headers, getPublicKeyRequest.getChannel());

        HttpEntity<String> entity = new HttpEntity(requestHeader);

        UrlConfiguration urlConfiguration = new UrlConfiguration();
        urlConfiguration.setRequestType(getPublicKeyRequest.getClass().getSimpleName());
        urlConfiguration.setBaseUrl((String) configuration.get(PAYMENT_KEY_SERVICE_URL));
        urlConfiguration.setClientId(PAYMENT_KEY_SERVICE);
        urlConfiguration.setChannel(getPublicKeyRequest.getChannel());
        urlConfiguration.setEnvironment((String) configuration.get(ENVIRONMENT));

        String url = getRequestUrl(urlConfiguration);

        Map<String,Object> clientParameters = new HashMap<>();
        clientParameters.put(URL, url);
        clientParameters.put(CLIENT_ID, PAYMENT_KEY_SERVICE);
        clientParameters.put(HTTP_METHOD, HttpMethod.GET);

        Map<String, String> response = callClient(restClientFactory, entity, clientParameters);

        if(response.get(CLIENT_RESPONSE_STATUS) == ERROR ||
            response.get(CLIENT_RESPONSE_STATUS) == HTTP_ERROR) {

            if(response.get(CLIENT_RESPONSE_STATUS) == HTTP_ERROR) {
                Map<String, String> errorMessages = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), ErrorResponse.class).getMessages();
                String psErrorCode = errorMessages.keySet().toArray()[0].toString();
                String psErrorMessage = String.valueOf(errorMessages.get(psErrorCode));

                publicKeyMap.put(psErrorCodeKeyName, psErrorCode);
                publicKeyMap.put(psErrorMessageKeyName, psErrorMessage);

            } else {
                publicKeyMap.put(psErrorCodeKeyName, null);
                publicKeyMap.put(psErrorMessageKeyName, response.get(CLIENT_RESPONSE_MESSAGE));
            }
        }

        if(response.get(CLIENT_RESPONSE_STATUS) == SUCCESS) {

            JsonObject jsonResponse = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), JsonObject.class);
            String publicKey = jsonResponse.get(paymentPublicKeyName).getAsString();
            String parsedPublicKey = publicKey.replaceAll("[\\n]","")
                .replace("-----BEGIN PUBLIC KEY-----","")
                .replace("-----END PUBLIC KEY-----", "");

            publicKeyMap.put(channelName, parsedPublicKey);

        }

        return publicKeyMap;

    }

}


