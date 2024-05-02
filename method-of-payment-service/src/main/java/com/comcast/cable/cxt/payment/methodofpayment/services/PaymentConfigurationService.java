package com.comcast.cable.cxt.payment.methodofpayment.services;

import com.comcast.cable.cxt.payment.methodofpayment.vo.*;
import com.comcast.xsp.connector.core.rest.RestClientFactory;
import com.google.gson.Gson;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants.*;
import static com.comcast.cable.cxt.payment.methodofpayment.utilities.MethodOfPaymentServiceUtilities.channelAuthValidation;

@Log4j2
@Component
public class PaymentConfigurationService extends ServiceClientBase {

    private List<String> configErrorOverrideList = Arrays.asList("PAYMENT-8320", "PAYMENT-8321", "PAYMENT-8322");

    public GetPaymentConfigurationResponse getPaymentConfigurationDetails(HttpHeaders headers,
        GetPaymentConfigurationRequest getPaymentConfigurationRequest, Map<String, Object> configuration, RestClientFactory restClientFactory) {

        HttpHeaders requestHeader = getCommonHttpHeaders(headers, getPaymentConfigurationRequest.getChannel());

        GetPaymentConfigurationResponse paymentConfigurationResponse = new GetPaymentConfigurationResponse();

        PaymentConfigurationDetails writeConfigurationDetails = new PaymentConfigurationDetails();
        writeConfigurationDetails.setTrackingId(requestHeader.getOrEmpty(PARAM_TRACKING_ID).get(0));
        writeConfigurationDetails.setBillingArrangementId(getPaymentConfigurationRequest.getBillingArrangementId());
        writeConfigurationDetails.setPaymentFrequency(getPaymentConfigurationRequest.getPaymentFrequency());
        writeConfigurationDetails.setCardblockStatus(false);
        writeConfigurationDetails.setBankblockStatus(false);

        Map<String, Object> channelValidation = channelAuthValidation(headers, configuration);

        if(!(Boolean) channelValidation.get(VALID_CHANNEL)) {
            writeConfigurationDetails.setCpcStatus(ERROR);
            writeConfigurationDetails.setPsErrorCode(null);
            writeConfigurationDetails.setPsErrorMessage((String) channelValidation.get(VALIDATION_RESPONSE_MESSAGE));

        } else {

            HttpEntity<String> entity = new HttpEntity(requestHeader);

            UrlConfiguration urlConfiguration = new UrlConfiguration();
            urlConfiguration.setRequestType(getPaymentConfigurationRequest.getClass().getSimpleName());
            urlConfiguration.setBaseUrl((String) configuration.get(PAYMENT_CONFIGURATION_SERVICE_URL));
            urlConfiguration.setClientId(PAYMENT_CONFIGURATION_SERVICE);
            urlConfiguration.setPaymentFrequency(getPaymentConfigurationRequest.getPaymentFrequency());
            urlConfiguration.setBillingArrangementId(getPaymentConfigurationRequest.getBillingArrangementId());

            String url = getRequestUrl(urlConfiguration);

            Map<String,Object> clientParameters = new HashMap<>();
            clientParameters.put(URL, url);
            clientParameters.put(CLIENT_ID, PAYMENT_CONFIGURATION_SERVICE);
            clientParameters.put(HTTP_METHOD, HttpMethod.GET);

            Map<String, String> response = callClient(restClientFactory, entity, clientParameters);

            if(response.get(CLIENT_RESPONSE_STATUS) == ERROR ||
                response.get(CLIENT_RESPONSE_STATUS) == HTTP_ERROR) {

                writeConfigurationDetails.setCpcStatus(ERROR);

                if(response.get(CLIENT_RESPONSE_STATUS) == HTTP_ERROR) {
                    Map<String, String> errorMessages = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), ErrorResponse.class).getMessages();
                    String psErrorCode = errorMessages.keySet().toArray()[0].toString();
                    String psErrorMessage = String.valueOf(errorMessages.get(psErrorCode));

                    if(configErrorOverrideList.contains(psErrorCode)) {
                        writeConfigurationDetails.setCpcStatus(SUCCESS);
                        writeConfigurationDetails.setPsErrorCode(null);
                        writeConfigurationDetails.setPsErrorMessage(null);
                        writeConfigurationDetails.setCardblockStatus(true);
                        writeConfigurationDetails.setBankblockStatus(true);
                    } else {
                        writeConfigurationDetails.setPsErrorCode(psErrorCode);
                        writeConfigurationDetails.setPsErrorMessage(psErrorMessage);
                    }

                } else {
                    writeConfigurationDetails.setPsErrorCode(null);
                    writeConfigurationDetails.setPsErrorMessage(response.get(CLIENT_RESPONSE_MESSAGE));
                }

            }

            if(response.get(CLIENT_RESPONSE_STATUS) == SUCCESS) {
                PaymentConfigurationDetails readConfigurationDetails = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), PaymentConfigurationDetails.class);

                writeConfigurationDetails.setCpcStatus(SUCCESS);
                writeConfigurationDetails.setPsErrorCode(null);
                writeConfigurationDetails.setPsErrorMessage(null);
                writeConfigurationDetails.setCardblockStatus(readConfigurationDetails.isCardblockStatus());
                writeConfigurationDetails.setBankblockStatus(readConfigurationDetails.isBankblockStatus());

            }

        }

        paymentConfigurationResponse.setPaymentConfigurationDetails(writeConfigurationDetails);

        return paymentConfigurationResponse;
    }
}
