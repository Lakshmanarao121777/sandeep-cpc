package com.comcast.cable.cxt.payment.methodofpayment.services;

import com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants;
import com.comcast.cable.cxt.payment.methodofpayment.vo.UrlConfiguration;
import com.comcast.cable.cxt.payment.methodofpayment.config.PaymentKeyEnum;
import com.comcast.xsp.connector.core.rest.RestClientFactory;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.HashMap;
import java.util.Map;

import static com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants.*;

@Log4j2
public class ServiceClientBase {

    public Map<String, String> callClient(RestClientFactory restClientFactory, HttpEntity<String> entity, Map<String, Object> clientConfig) {

        ResponseEntity<String> response = null;
        Map<String, String> responseMap = new HashMap<>();

        String clientId = (String) clientConfig.get(CLIENT_ID);
        String clientIdReadable = null;
        String url = (String) clientConfig.get(URL);
        HttpMethod httpMethod = (HttpMethod) clientConfig.get(HTTP_METHOD);

        switch(clientId) {
            case WALLET_SERVICE:
                clientIdReadable = "Wallet Service";
                break;
            case AUTOPAY_SERVICE:
                clientIdReadable = "Autopay Service";
                break;
            case PAYMENT_CONFIGURATION_SERVICE:
                clientIdReadable = "Payment Configuration Service";
                break;
            case PAYMENT_CONTRACT_SERVICE:
                clientIdReadable = "Payment Contract Service";
                break;
            case PAYMENT_KEY_SERVICE:
                clientIdReadable = "Payment Key Service";
                break;
            default:
                clientIdReadable = "Unknown Client";
        }

        try {
            response = restClientFactory.getClient(clientId).exchange(url, httpMethod, entity, String.class);

            HttpStatus statusCode = response.getStatusCode();

            if (statusCode == HttpStatus.OK) {
                responseMap.put(CLIENT_RESPONSE_STATUS, SUCCESS);
                responseMap.put(CLIENT_RESPONSE_MESSAGE, response.getBody());
            }

        } catch (HttpClientErrorException | HttpServerErrorException httpException) {
            responseMap.put(CLIENT_RESPONSE_STATUS, HTTP_ERROR);
            responseMap.put(CLIENT_RESPONSE_MESSAGE, httpException.getResponseBodyAsString());

        } catch (ResourceAccessException resourceAccessException) {

            if(resourceAccessException.getCause() instanceof SocketTimeoutException) {
                responseMap.put(CLIENT_RESPONSE_STATUS, ERROR);
                responseMap.put(CLIENT_RESPONSE_MESSAGE, "Time out exception while calling " + clientIdReadable + ".");
            } else {
                responseMap.put(CLIENT_RESPONSE_STATUS, ERROR);
                responseMap.put(CLIENT_RESPONSE_MESSAGE, "I/O exception while calling " + clientIdReadable + ".");
            }
        } catch (Exception e) {
            responseMap.put(CLIENT_RESPONSE_STATUS, ERROR);
            responseMap.put(CLIENT_RESPONSE_MESSAGE, e.getMessage());
        }

        return responseMap;
    }

    public HttpHeaders getCommonHttpHeaders(HttpHeaders headers, String channel) {

        headers.set(PARAM_TRACKING_ID,
            headers.getOrEmpty(PARAM_TRACKING_ID).get(0) + "_" + new Throwable().getStackTrace()[1].getMethodName());

        HttpHeaders requestHeader = new HttpHeaders();
        requestHeader.setContentType(MediaType.APPLICATION_JSON);
        requestHeader.add(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
        requestHeader.add(PARAM_SOURCE_SERVER_ID, headers.getOrEmpty(MethodOfServiceConstants.PARAM_SOURCE_SERVER_ID).get(0));
        requestHeader.add(PARAM_SOURCE_SYSTEM_ID, headers.getOrEmpty(MethodOfServiceConstants.PARAM_SOURCE_SYSTEM_ID).get(0));
        requestHeader.add(PARAM_TIMESTAMP, headers.getOrEmpty(MethodOfServiceConstants.PARAM_TIMESTAMP).get(0));
        requestHeader.add(PARAM_TRACKING_ID, headers.getOrEmpty(MethodOfServiceConstants.PARAM_TRACKING_ID).get(0));
        requestHeader.add(PARAM_CHANNEL, channel);
        requestHeader.add(PARAM_PARTNER_ID, COMCAST_VALUE);

        return requestHeader;
    }

    public String getRequestUrl(UrlConfiguration urlConfig) {

        String requestUrl = urlConfig.getBaseUrl();

        if(urlConfig.getClientId() != PAYMENT_CONTRACT_SERVICE) {
            switch(urlConfig.getRequestType()) {
                case ADD_TO_WALLET_REQUEST:
                    requestUrl = requestUrl + urlConfig.getPaymentInstrumentType();
                    break;
                case AUTOPAY_ENROLLMENT_REQUEST:
                    requestUrl = requestUrl + urlConfig.getPaymentInstrumentType() + FORWARD_SLASH + PARAM_TOKEN + FORWARD_SLASH + urlConfig.getPaymentToken();
                    break;
                case AUTOPAY_WITHDRAW_REQUEST:
                    requestUrl = requestUrl + BILLING_ARRANGEMENT_ID + FORWARD_SLASH + urlConfig.getBillingArrangementId();
                    break;
                case UPDATE_EXISTING_PAYMENT_INSTRUMENT_REQUEST:
                case DELETE_EXISTING_PAYMENT_INSTRUMENT_REQUEST:
                    requestUrl = requestUrl + PARAM_CUSTOMER + FORWARD_SLASH + urlConfig.getCustomerId() + FORWARD_SLASH + PARAM_TOKEN + FORWARD_SLASH + urlConfig.getPaymentToken();
                    break;
                case GET_ALL_PAYMENT_INSTRUMENTS_REQUEST:
                    requestUrl = requestUrl + PARAM_CUSTOMER + FORWARD_SLASH + urlConfig.getCustomerId();
                    if(urlConfig.getBillingArrangementId() != null && !urlConfig.getBillingArrangementId().isEmpty()) {
                        requestUrl = requestUrl + QUESTION_MARK + BILLING_ARRANGEMENT_ID + EQUALS + urlConfig.getBillingArrangementId();
                    }
                    break;
                case GET_EXISTING_PAYMENT_INSTRUMENT_REQUEST:
                    requestUrl = requestUrl + PARAM_CUSTOMER + FORWARD_SLASH + urlConfig.getCustomerId() + FORWARD_SLASH + PARAM_TOKEN + FORWARD_SLASH + urlConfig.getPaymentToken() +
                        QUESTION_MARK;
                    if(urlConfig.getBillingArrangementId() != null && !urlConfig.getBillingArrangementId().isEmpty()) {
                        requestUrl = requestUrl + BILLING_ARRANGEMENT_ID + EQUALS + urlConfig.getBillingArrangementId() + AMPERSAND;
                    }
                    requestUrl = requestUrl + "view" + EQUALS + "detail";
                    break;
                case GET_PAYMENT_CONFIGURATION_REQUEST:
                    requestUrl = requestUrl + urlConfig.getPaymentFrequency() + QUESTION_MARK + BILLING_ARRANGEMENT_ID + EQUALS + urlConfig.getBillingArrangementId();
                    break;
                case GET_PUBLIC_KEY_REQUEST:
                    requestUrl = requestUrl + QUESTION_MARK + PARAM_KEY_NAME + EQUALS + PaymentKeyEnum.getKeyName(urlConfig.getChannel(), urlConfig.getEnvironment());
            }
        }

        return requestUrl;

    }

}
