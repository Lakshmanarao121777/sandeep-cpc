package com.comcast.cable.cxt.payment.methodofpayment.services;

import com.comcast.cable.cxt.payment.methodofpayment.config.PaymentKeyEnum;
import com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants;
import com.comcast.cable.cxt.payment.methodofpayment.utilities.MethodOfPaymentServiceUtilities;
import com.comcast.cable.cxt.payment.methodofpayment.vo.*;
import com.comcast.xsp.connector.core.rest.RestClientFactory;
import com.google.gson.Gson;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.*;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants.*;
import static com.comcast.cable.cxt.payment.methodofpayment.utilities.MethodOfPaymentServiceUtilities.channelAuthValidation;

@Log4j2
@Component
public class AutopayService extends ServiceClientBase {

    private int invalidAutopayId = 0;

    public AddToWalletResponse tokenizeWithAutopay(HttpHeaders headers, AddToWalletRequest addToWalletRequest, Map<String, Object> configuration,
                                                                       RestClientFactory restClientFactory) {

        HttpHeaders requestHeader = getCommonHttpHeaders(headers, addToWalletRequest.getChannel());

        AddToWalletResponse addToWalletWithAutopayResponse = new AddToWalletResponse();

        SubmissionDetails submissionDetails = new SubmissionDetails();
        submissionDetails.setCpcStatus(null);
        submissionDetails.setTrackingId(requestHeader.getOrEmpty(PARAM_TRACKING_ID).get(0));
        submissionDetails.setActionTaken(TOKENIZE_WITH_AUTOPAY);
        submissionDetails.setPsErrorCode(null);
        submissionDetails.setPsErrorMessage(null);

        Map<String, Object> channelAuthValidation = channelAuthValidation(headers, configuration);

        if(!(Boolean) channelAuthValidation.get(VALID_CHANNEL)) {

            submissionDetails.setCpcStatus(ERROR);
            submissionDetails.setPsErrorCode(null);
            submissionDetails.setPsErrorMessage((String) channelAuthValidation.get(VALIDATION_RESPONSE_MESSAGE));
            addToWalletWithAutopayResponse.setSubmissionDetails(submissionDetails);

        } else {

            addToWalletWithAutopayResponse.setCustomerDetails(addToWalletRequest.getBillTo().getName());
            addToWalletWithAutopayResponse.setCustomerId(addToWalletRequest.getCustomerId());

            addToWalletWithAutopayResponse.setSubmissionDetails(submissionDetails);

            CpcBankResponse bankDetails = new CpcBankResponse();
            CpcCardResponse cardDetails = new CpcCardResponse();
            CpcAutopayResponse autopayDetails = new CpcAutopayResponse();

            Name customerDetails = new Name();
            if (addToWalletRequest.getBillTo() != null && addToWalletRequest.getBillTo().getName() != null) {
                customerDetails.setFirstName(addToWalletRequest.getBillTo().getName().getFirstName());
                customerDetails.setLastName(addToWalletRequest.getBillTo().getName().getLastName());
            }

            UrlConfiguration urlConfiguration = new UrlConfiguration();
            urlConfiguration.setRequestType(addToWalletRequest.getClass().getSimpleName());
            urlConfiguration.setBaseUrl((String) configuration.get(AUTOPAY_SERVICE_URL));
            urlConfiguration.setClientId(AUTOPAY_SERVICE);

            AutopayTokenizeRequest autopayTokenizeRequest = new AutopayTokenizeRequest();

            autopayTokenizeRequest.setBillingInfo(addToWalletRequest.getBillingInfo());
            autopayTokenizeRequest.setCustomerId(addToWalletRequest.getCustomerId());
            autopayTokenizeRequest.setKeyName(PaymentKeyEnum.getKeyName(addToWalletRequest.getChannel(), (String) configuration.get(ENVIRONMENT)));
            autopayTokenizeRequest.setSecure(true);

            if(addToWalletRequest.getBankDetails() != null) {

                urlConfiguration.setPaymentInstrumentType(BANK);

                Bank bank = new Bank();
                bank.setAccountNumber(addToWalletRequest.getBankDetails().getEncryptedAccountNumber());
                bank.setRoutingNumber(addToWalletRequest.getBankDetails().getRoutingNumber());
                bank.setAccountType(addToWalletRequest.getBankDetails().getAccountType());
                bank.setBillTo(addToWalletRequest.getBillTo());
                bank.setCustomerDefinedName(addToWalletRequest.getAddInstrumentToWallet().getCustomerDefinedName());
                bank.setDefaultInstrument(addToWalletRequest.getAddInstrumentToWallet().getDefaultInstrument());

                autopayTokenizeRequest.setBank(bank);

                submissionDetails.setMethodOfPaymentType(BANK);
            }

            if(addToWalletRequest.getCardDetails() != null) {

                urlConfiguration.setPaymentInstrumentType(CARD);

                PaymentCard card = new PaymentCard();
                card.setBillTo(addToWalletRequest.getBillTo());
                card.setCardNumber(addToWalletRequest.getCardDetails().getEncryptedCardNumber());
                card.setCardType(addToWalletRequest.getCardDetails().getCardType());
                card.setCustomerDefinedName(addToWalletRequest.getAddInstrumentToWallet().getCustomerDefinedName());
                card.setCvv(addToWalletRequest.getCardDetails().getCvv());
                card.setDefaultInstrument(addToWalletRequest.getAddInstrumentToWallet().getDefaultInstrument());
                card.setExpirationDate(addToWalletRequest.getCardDetails().getExpirationDate());

                autopayTokenizeRequest.setPaymentCard(card);

                submissionDetails.setMethodOfPaymentType(CARD);
            }

            String url = getRequestUrl(urlConfiguration);

            HttpEntity<String> entity = new HttpEntity(autopayTokenizeRequest, requestHeader);

            Map<String,Object> clientParameters = new HashMap<>();
            clientParameters.put(URL, url);
            clientParameters.put(CLIENT_ID, AUTOPAY_SERVICE);
            clientParameters.put(HTTP_METHOD, HttpMethod.PUT);

            Map<String, String> response = callClient(restClientFactory, entity, clientParameters);

            if(response.get(CLIENT_RESPONSE_STATUS) == ERROR ||
                response.get(CLIENT_RESPONSE_STATUS) == HTTP_ERROR) {

                submissionDetails.setCpcStatus(ERROR);

                if(response.get(CLIENT_RESPONSE_STATUS) == HTTP_ERROR) {
                    Map<String, String> errorMessages = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), ErrorResponse.class).getMessages();
                    String psErrorCode = errorMessages.keySet().toArray()[0].toString();
                    String psErrorMessage = String.valueOf(errorMessages.get(psErrorCode));

                    submissionDetails.setPsErrorCode(psErrorCode);
                    submissionDetails.setPsErrorMessage(psErrorMessage);
                } else {
                    submissionDetails.setPsErrorCode(null);
                    submissionDetails.setPsErrorMessage(response.get(CLIENT_RESPONSE_MESSAGE));
                }

                addToWalletWithAutopayResponse.setSubmissionDetails(submissionDetails);

            }

            if(response.get(CLIENT_RESPONSE_STATUS) == SUCCESS) {

                submissionDetails.setCpcStatus(SUCCESS);

                AutopayEnrollServiceResponse autopayTokenizeResponse = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), AutopayEnrollServiceResponse.class);
                autopayDetails.setAutoPayId(autopayTokenizeResponse.getAutoPayId());
                if(autopayTokenizeResponse.getDebitDate() != null && !autopayTokenizeResponse.getDebitDate().isEmpty()) {
                    autopayDetails.setDebitDate(autopayTokenizeResponse.getDebitDate());
                }

                addToWalletWithAutopayResponse.setAutopayDetails(autopayDetails);

                if (autopayTokenizeRequest.getBank() != null) {

                    bankDetails.setToken(autopayTokenizeResponse.getToken());
                    bankDetails.setBankAccountType(autopayTokenizeResponse.getBankAccountType());
                    bankDetails.setMaskedAccountNumber(autopayTokenizeResponse.getMaskedAccountNumber());
                    bankDetails.setBankAccountLast4Digits(autopayTokenizeResponse.getBankAccountLast4Digits());

                    if(autopayTokenizeRequest.getBank().getDefaultInstrument() != null) {
                        bankDetails.setDefaultInstrument(autopayTokenizeRequest.getBank().getDefaultInstrument());
                    } else {
                        bankDetails.setDefaultInstrument(false);
                    }

                    addToWalletWithAutopayResponse.setBankDetails(bankDetails);

                }

                if (autopayTokenizeRequest.getPaymentCard() != null) {

                    cardDetails.setToken(autopayTokenizeResponse.getToken());
                    cardDetails.setCardLast4Digits(autopayTokenizeResponse.getCardLast4Digits());
                    cardDetails.setCardType(autopayTokenizeResponse.getCardType());
                    cardDetails.setExpirationDate(autopayTokenizeResponse.getExpirationDate());
                    cardDetails.setAvsCode(autopayTokenizeResponse.getAvsCode());
                    cardDetails.setMaskedCardNumber(MethodOfPaymentServiceUtilities.formatMaskedCardNumber(autopayTokenizeResponse.getMaskedAccountNumber()));

                    if(autopayTokenizeRequest.getPaymentCard().getDefaultInstrument() != null) {
                        cardDetails.setDefaultInstrument(autopayTokenizeRequest.getPaymentCard().getDefaultInstrument());
                    } else {
                        cardDetails.setDefaultInstrument(false);
                    }

                    addToWalletWithAutopayResponse.setCardDetails(cardDetails);

                }

                addToWalletWithAutopayResponse.setSubmissionDetails(submissionDetails);

            }

        }

        return addToWalletWithAutopayResponse;

    }

    public AutopayEnrollmentResponse enrollInAutopay(HttpHeaders headers, AutopayEnrollmentRequest autopayEnrollmentRequest,
        Map<String, Object> configuration, RestClientFactory restClientFactory) {

        HttpHeaders requestHeader = getCommonHttpHeaders(headers, autopayEnrollmentRequest.getChannel());

        AutopayEnrollmentResponse enrollmentResponse = new AutopayEnrollmentResponse();
        enrollmentResponse.setToken(autopayEnrollmentRequest.getToken());
        enrollmentResponse.setCustomerId(autopayEnrollmentRequest.getCustomerId());
        enrollmentResponse.setDebitDate(null);

        SubmissionDetails submissionDetails = new SubmissionDetails();
        submissionDetails.setTrackingId(requestHeader.getOrEmpty(PARAM_TRACKING_ID).get(0));
        submissionDetails.setActionTaken(AUTOPAY_ENROLL);
        submissionDetails.setPsErrorCode(null);
        submissionDetails.setPsErrorMessage(null);

        Map<String, Object> channelValidation = channelAuthValidation(headers, configuration);

        if(!(Boolean) channelValidation.get(VALID_CHANNEL)) {

            submissionDetails.setCpcStatus(ERROR);
            submissionDetails.setPsErrorCode(null);
            submissionDetails.setPsErrorMessage((String) channelValidation.get(VALIDATION_RESPONSE_MESSAGE));

            enrollmentResponse.setAutoPayId(invalidAutopayId);
            enrollmentResponse.setSubmissionDetails(submissionDetails);

        } else {

            HttpEntity<String> entity = null;

            UrlConfiguration urlConfiguration = new UrlConfiguration();
            urlConfiguration.setRequestType(autopayEnrollmentRequest.getClass().getSimpleName());
            urlConfiguration.setBaseUrl((String) configuration.get(AUTOPAY_SERVICE_URL));
            urlConfiguration.setClientId(AUTOPAY_SERVICE);
            urlConfiguration.setPaymentToken(autopayEnrollmentRequest.getToken());

            if(autopayEnrollmentRequest.getBankAccountType() != null && !autopayEnrollmentRequest.getBankAccountType().isEmpty()) {
                enrollmentResponse.setBankAccountType(autopayEnrollmentRequest.getBankAccountType());
                enrollmentResponse.setBankAccountLast4Digits(null);

                AutopayServiceBankRequest autopayBankRequest = new AutopayServiceBankRequest();
                autopayBankRequest.setBankAccountType(autopayEnrollmentRequest.getBankAccountType());
                autopayBankRequest.setBillingInfo(autopayEnrollmentRequest.getBillingInfo());
                autopayBankRequest.setCustomerId(autopayEnrollmentRequest.getCustomerId());

                entity = new HttpEntity(autopayBankRequest, requestHeader);
                urlConfiguration.setPaymentInstrumentType(BANK);

                submissionDetails.setMethodOfPaymentType(BANK);
            }

            if(autopayEnrollmentRequest.getCardType() != null && !autopayEnrollmentRequest.getCardType().isEmpty()) {
                enrollmentResponse.setCardType(autopayEnrollmentRequest.getCardType());
                enrollmentResponse.setCardLast4Digits(null);
                enrollmentResponse.setExpirationDate(null);

                AutopayServiceCardRequest autopayCardRequest = new AutopayServiceCardRequest();
                autopayCardRequest.setBillingInfo(autopayEnrollmentRequest.getBillingInfo());
                autopayCardRequest.setCardType(autopayEnrollmentRequest.getCardType());
                autopayCardRequest.setCustomerId(autopayEnrollmentRequest.getCustomerId());

                entity = new HttpEntity(autopayCardRequest, requestHeader);
                urlConfiguration.setPaymentInstrumentType(CARD);

                submissionDetails.setMethodOfPaymentType(CARD);
            }

            String url = getRequestUrl(urlConfiguration);

            Map<String,Object> clientParameters = new HashMap<>();
            clientParameters.put(URL, url);
            clientParameters.put(CLIENT_ID, AUTOPAY_SERVICE);
            clientParameters.put(HTTP_METHOD, HttpMethod.PUT);

            Map<String, String> response = callClient(restClientFactory, entity, clientParameters);

            if(response.get(CLIENT_RESPONSE_STATUS) == ERROR ||
                response.get(CLIENT_RESPONSE_STATUS) == HTTP_ERROR) {

                submissionDetails.setCpcStatus(MethodOfServiceConstants.ERROR);

                enrollmentResponse.setAutoPayId(invalidAutopayId);

                if(response.get(CLIENT_RESPONSE_STATUS) == MethodOfServiceConstants.HTTP_ERROR) {
                    Map<String, String> errorMessages = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), ErrorResponse.class).getMessages();
                    String psErrorCode = errorMessages.keySet().toArray()[0].toString();
                    String psErrorMessage = String.valueOf(errorMessages.get(psErrorCode));

                    submissionDetails.setPsErrorCode(psErrorCode);
                    submissionDetails.setPsErrorMessage(psErrorMessage);
                } else {
                    submissionDetails.setPsErrorCode(null);
                    submissionDetails.setPsErrorMessage(response.get(CLIENT_RESPONSE_MESSAGE));
                }
            }

            if(response.get(CLIENT_RESPONSE_STATUS) == SUCCESS) {
                AutopayEnrollServiceResponse autopayServiceResponse = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), AutopayEnrollServiceResponse.class);

                submissionDetails.setCpcStatus(SUCCESS);

                enrollmentResponse.setAutoPayId(autopayServiceResponse.getAutoPayId());
                enrollmentResponse.setToken(autopayServiceResponse.getToken());
                enrollmentResponse.setCustomerId(autopayServiceResponse.getCustomerId());
                enrollmentResponse.setDebitDate(autopayServiceResponse.getDebitDate());
                enrollmentResponse.setBankAccountType(autopayServiceResponse.getBankAccountType());
                enrollmentResponse.setBankAccountLast4Digits(autopayServiceResponse.getBankAccountLast4Digits());
                enrollmentResponse.setCardType(autopayServiceResponse.getCardType());
                enrollmentResponse.setCardLast4Digits(autopayServiceResponse.getCardLast4Digits());
                enrollmentResponse.setExpirationDate(autopayServiceResponse.getExpirationDate());

            }

            enrollmentResponse.setSubmissionDetails(submissionDetails);
        }

        return enrollmentResponse;
    }

    public AutopayWithdrawResponse withdrawFromAutopay(HttpHeaders headers, AutopayWithdrawRequest autopayWithdrawRequest,
        Map<String, Object> configuration, RestClientFactory restClientFactory) {

        HttpHeaders requestHeader = getCommonHttpHeaders(headers, autopayWithdrawRequest.getChannel());

        AutopayWithdrawResponse withdrawResponse = new AutopayWithdrawResponse();

        SubmissionDetails submissionDetails = new SubmissionDetails();
        submissionDetails.setTrackingId(requestHeader.getOrEmpty(PARAM_TRACKING_ID).get(0));
        submissionDetails.setActionTaken(AUTOPAY_WITHDRAW);
        submissionDetails.setPsErrorCode(null);
        submissionDetails.setPsErrorMessage(null);

        Map<String, Object> channelValidation = channelAuthValidation(headers, configuration);

        if(!(Boolean) channelValidation.get(VALID_CHANNEL)) {

            submissionDetails.setCpcStatus(ERROR);
            submissionDetails.setPsErrorCode(null);
            submissionDetails.setPsErrorMessage((String) channelValidation.get(VALIDATION_RESPONSE_MESSAGE));

            withdrawResponse.setSubmissionDetails(submissionDetails);

        } else {

            HttpEntity<String> entity = new HttpEntity(requestHeader);

            UrlConfiguration urlConfiguration = new UrlConfiguration();
            urlConfiguration.setRequestType(autopayWithdrawRequest.getClass().getSimpleName());
            urlConfiguration.setBaseUrl((String) configuration.get(AUTOPAY_SERVICE_URL));
            urlConfiguration.setClientId(AUTOPAY_SERVICE);
            urlConfiguration.setBillingArrangementId(autopayWithdrawRequest.getBillingInfo().getBillingArrangementId());

            String url = getRequestUrl(urlConfiguration);

            Map<String,Object> clientParameters = new HashMap<>();
            clientParameters.put(URL, url);
            clientParameters.put(CLIENT_ID, AUTOPAY_SERVICE);
            clientParameters.put(HTTP_METHOD, HttpMethod.DELETE);

            Map<String, String> response = callClient(restClientFactory, entity, clientParameters);

            if(response.get(CLIENT_RESPONSE_STATUS) == ERROR ||
                response.get(CLIENT_RESPONSE_STATUS) == HTTP_ERROR) {

                submissionDetails.setCpcStatus(ERROR);

                if(response.get(CLIENT_RESPONSE_STATUS) == MethodOfServiceConstants.HTTP_ERROR) {
                    Map<String, String> errorMessages = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), ErrorResponse.class).getMessages();
                    String psErrorCode = errorMessages.keySet().toArray()[0].toString();
                    String psErrorMessage = String.valueOf(errorMessages.get(psErrorCode));

                    submissionDetails.setPsErrorCode(psErrorCode);
                    submissionDetails.setPsErrorMessage(psErrorMessage);
                } else {
                    submissionDetails.setPsErrorCode(null);
                    submissionDetails.setPsErrorMessage(response.get(CLIENT_RESPONSE_MESSAGE));
                }
            }

            if(response.get(CLIENT_RESPONSE_STATUS) == SUCCESS) {
                AutopayWithdrawServiceResponse autopayServiceResponse = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), AutopayWithdrawServiceResponse.class);

                if(autopayServiceResponse.getResult().equalsIgnoreCase(SUCCESS)) {
                    submissionDetails.setCpcStatus(SUCCESS);
                } else {
                    submissionDetails.setCpcStatus(ERROR);
                    submissionDetails.setPsErrorMessage(autopayServiceResponse.getWarning());
                }

            }

            withdrawResponse.setSubmissionDetails(submissionDetails);
        }

        return withdrawResponse;
    }

}
