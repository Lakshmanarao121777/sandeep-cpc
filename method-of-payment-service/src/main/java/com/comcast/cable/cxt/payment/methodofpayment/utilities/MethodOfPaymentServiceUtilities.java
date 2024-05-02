package com.comcast.cable.cxt.payment.methodofpayment.utilities;

import com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants;
import org.springframework.http.HttpHeaders;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants.*;

public class MethodOfPaymentServiceUtilities {

    public static Map<String, Object> channelAuthValidation(HttpHeaders headers, Map<String, Object> configMap) {

        Map<String, Object> channelValidationMap = new HashMap<>();
        String validChannel = VALID_CHANNEL;
        String validationResponseMessage = VALIDATION_RESPONSE_MESSAGE;

        List<String> channels = headers.getOrEmpty(PARAM_CHANNEL);
        List<String> authorizationHeader = headers.getOrEmpty(PARAM_AUTHORIZATION);
        List<String> cpcChannelAllowList = (List<String>) configMap.get(CPC_CHANNEL_ALLOW_LIST);
        List<String> cpcUnauthLiteChannelList = (List<String>) configMap.get(UNAUTH_LITE_CHANNEL_LIST);
        List<String> cpcUnauthBuyFlowChannelList = (List<String>) configMap.get(UNAUTH_BUYFLOW_CHANNEL_LIST);
        List<String> cpcAuthChannelList = (List<String>) configMap.get(AUTH_CHANNEL_LIST);

        if(channels == null || channels.isEmpty() || channels.get(0).isEmpty()) {
            channelValidationMap.put(validChannel, false);
            channelValidationMap.put(validationResponseMessage, "Channel header parameter is missing in the request.");
        } else if(!cpcChannelAllowList.contains(channels.get(0))) {
            channelValidationMap.put(validChannel, false);
            channelValidationMap.put(validationResponseMessage, "Channel " + channels.get(0) + " is not authorized to perform this action.  Please contact system administrator.");
        } else if((cpcUnauthLiteChannelList.contains(channels.get(0)) || cpcUnauthBuyFlowChannelList.contains(channels.get(0))) && authorizationHeader != null && !authorizationHeader.isEmpty()) {
            channelValidationMap.put(validChannel, false);
            channelValidationMap.put(validationResponseMessage, "Channel " + channels.get(0) + " has an unexpected problem with authorization.  Please contact system administrator.");
        } else if(cpcAuthChannelList.contains(channels.get(0)) && (authorizationHeader == null || authorizationHeader.isEmpty())) {
            channelValidationMap.put(validChannel, false);
            channelValidationMap.put(validationResponseMessage, "Authorization header is required for channel " + channels.get(0) + ".");
        } else {
            channelValidationMap.put(validChannel, true);
        }

        return channelValidationMap;
    }

    public static boolean isValidUnAuthChannel(HttpHeaders headers, Map<String, Object> configMap) {

        boolean validUnAuthChannel = false;

        List<String> channels = headers.getOrEmpty(PARAM_CHANNEL);
        List<String> cpcUnauthLiteChannelList = (List<String>) configMap.get(UNAUTH_LITE_CHANNEL_LIST);

        if(cpcUnauthLiteChannelList.contains(channels.get(0))) {
            validUnAuthChannel = true;
        }

        return validUnAuthChannel;

    }

    public static String deriveMaskedCvv(String cardType) {
        String maskedCvv = DEFAULT_MASKED_CVV;
        if(cardType.equalsIgnoreCase(AMERICAN_EXPRESS_CARD_TYPE)) {
            maskedCvv = AMEX_MASKED_CVV;
        }
        return maskedCvv;
    }

    public static String formatMaskedCardNumber(String currentMaskedCardNumber){
        return currentMaskedCardNumber.replaceAll(MethodOfServiceConstants.GET_FIRST_SIX_NUMBER_REGEX, MethodOfServiceConstants.CARD_BIN_REPLACEMENT_CHARACTERS);
    }
}
