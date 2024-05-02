package com.comcast.cable.cxt.payment.paymentContract.services;

import com.comcast.cable.cxt.payment.paymentContract.domains.PaymentContractServiceConstants;
import com.comcast.xsp.connector.core.rest.RestClientFactory;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.net.SocketTimeoutException;
import java.util.HashMap;
import java.util.Map;

@Log4j2
public class ServiceClientBase {
    public static Map<String, String> callClient(RestClientFactory restClientFactory, HttpEntity<String> entity, Map<String, Object> clientConfig) {


        ResponseEntity<String> response = null;
        Map<String, String> responseMap = new HashMap<>();

        String clientId = (String) clientConfig.get(PaymentContractServiceConstants.CLIENT_ID);
        String url = (String) clientConfig.get(PaymentContractServiceConstants.URL);
        HttpMethod httpMethod = (HttpMethod) clientConfig.get(PaymentContractServiceConstants.HTTP_METHOD);

        try {
            response = restClientFactory.getClient(clientId).exchange(url, httpMethod, entity, String.class);

            HttpStatus statusCode = response.getStatusCode();

            if (statusCode == HttpStatus.OK) {
                responseMap.put(PaymentContractServiceConstants.CLIENT_RESPONSE_STATUS, PaymentContractServiceConstants.SUCCESS);
                responseMap.put(PaymentContractServiceConstants.CLIENT_RESPONSE_MESSAGE, response.getBody());
            }

        } catch (HttpClientErrorException | HttpServerErrorException httpException) {
            responseMap.put(PaymentContractServiceConstants.CLIENT_RESPONSE_MESSAGE, httpException.getResponseBodyAsString());
            responseMap.put(PaymentContractServiceConstants.CLIENT_RESPONSE_STATUS, PaymentContractServiceConstants.HTTP_ERROR);

        } catch (ResourceAccessException resourceAccessException) {

            if (resourceAccessException.getCause() instanceof SocketTimeoutException) {
                responseMap.put(PaymentContractServiceConstants.CLIENT_RESPONSE_STATUS, PaymentContractServiceConstants.ERROR);
                responseMap.put(PaymentContractServiceConstants.CLIENT_RESPONSE_MESSAGE, "Time out exception while calling Contract Management.");
            } else {
                responseMap.put(PaymentContractServiceConstants.CLIENT_RESPONSE_STATUS, PaymentContractServiceConstants.ERROR);
                responseMap.put(PaymentContractServiceConstants.CLIENT_RESPONSE_MESSAGE, "I/O exception while calling Contract Management.");
            }

        } catch (Exception e) {
            responseMap.put(PaymentContractServiceConstants.CLIENT_RESPONSE_STATUS, PaymentContractServiceConstants.ERROR);
            responseMap.put(PaymentContractServiceConstants.CLIENT_RESPONSE_MESSAGE, e.getMessage());
        }

        return responseMap;
    }

    public static HttpHeaders getCommonHttpHeaders(HttpHeaders headers) {
        HttpHeaders requestHeader = new HttpHeaders();
        requestHeader.setContentType(MediaType.APPLICATION_JSON);
        requestHeader.add(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
        requestHeader.add(PaymentContractServiceConstants.PARAM_SOURCE_SERVER_ID, headers.getOrEmpty(PaymentContractServiceConstants.PARAM_SOURCE_SERVER_ID).get(0));
        requestHeader.add(PaymentContractServiceConstants.PARAM_SOURCE_SYSTEM_ID, headers.getOrEmpty(PaymentContractServiceConstants.PARAM_SOURCE_SYSTEM_ID).get(0));
        requestHeader.add(PaymentContractServiceConstants.PARAM_TIMESTAMP, headers.getOrEmpty(PaymentContractServiceConstants.PARAM_TIMESTAMP).get(0));
        requestHeader.add(PaymentContractServiceConstants.PARAM_TRACKING_ID, headers.getOrEmpty(PaymentContractServiceConstants.PARAM_TRACKING_ID).get(0));
        return requestHeader;
    }
}
