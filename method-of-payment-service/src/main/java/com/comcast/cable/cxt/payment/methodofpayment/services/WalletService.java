package com.comcast.cable.cxt.payment.methodofpayment.services;

import com.comcast.cable.cxt.payment.methodofpayment.config.PaymentKeyEnum;
import com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants;
import com.comcast.cable.cxt.payment.methodofpayment.utilities.MethodOfPaymentServiceUtilities;
import com.comcast.cable.cxt.payment.methodofpayment.vo.*;
import com.comcast.xsp.connector.core.rest.RestClientFactory;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.http.*;
import org.springframework.stereotype.Component;

import java.util.*;

import static com.comcast.cable.cxt.payment.methodofpayment.domains.MethodOfServiceConstants.*;
import static com.comcast.cable.cxt.payment.methodofpayment.utilities.MethodOfPaymentServiceUtilities.*;

@Log4j2
@Component
public class WalletService extends ServiceClientBase {

    private final String PAYMENT_INSTRUMENT_NOT_RETURNED_ERROR = "Payment instrument(s) not returned for ";

    public AddToWalletResponse addPaymentInstrumentToWallet(HttpHeaders headers, AddToWalletRequest addToWalletRequest, Map<String, Object> configuration,
        RestClientFactory restClientFactory) {

        HttpHeaders requestHeader = getCommonHttpHeaders(headers, addToWalletRequest.getChannel());

        AddToWalletResponse addToWalletResponse = new AddToWalletResponse();
        SubmissionDetails submissionDetails = new SubmissionDetails();
        submissionDetails.setTrackingId(requestHeader.getOrEmpty(PARAM_TRACKING_ID).get(0));
        submissionDetails.setActionTaken(TOKENIZE);
        submissionDetails.setPsErrorCode(null);
        submissionDetails.setPsErrorMessage(null);

        Map<String, Object> channelAuthValidation = channelAuthValidation(headers, configuration);

        if(!(Boolean) channelAuthValidation.get(VALID_CHANNEL)) {

            submissionDetails.setCpcStatus(ERROR);
            submissionDetails.setPsErrorCode(null);
            submissionDetails.setPsErrorMessage((String) channelAuthValidation.get(VALIDATION_RESPONSE_MESSAGE));
            addToWalletResponse.setSubmissionDetails(submissionDetails);

        } else {

//            if(isValidUnAuthChannel(headers, configuration)){
//                addToWalletRequest.setStorePaymentInstrumentLongTerm(false); // override StorePaymentInstrumentLongTerm as false for Lite Flow (UnAuth channel) do not perform pre-authorization.
//            }

            String walletServiceRequestString = getWalletServiceRequest(addToWalletRequest.getClass().getSimpleName(),
                new Gson().toJson(addToWalletRequest).toString(), (String) configuration.get(ENVIRONMENT));

            WalletServiceRequest walletServiceRequest = new Gson().fromJson(walletServiceRequestString, WalletServiceRequest.class);

            if(StringUtils.isNotBlank(walletServiceRequest.getCustomerId())) {
                    UrlConfiguration urlConfiguration = new UrlConfiguration();
                    urlConfiguration.setRequestType(addToWalletRequest.getClass().getSimpleName());
                    urlConfiguration.setBaseUrl((String) configuration.get(WALLET_SERVICE_URL));
                    urlConfiguration.setClientId(WALLET_SERVICE);

                    if(walletServiceRequest.getBank() != null) {
                        urlConfiguration.setPaymentInstrumentType(BANK);
                        submissionDetails.setMethodOfPaymentType(BANK);
                    }

                    if(walletServiceRequest.getPaymentCard() != null) {
                        urlConfiguration.setPaymentInstrumentType(CARD);
                        submissionDetails.setMethodOfPaymentType(CARD);
                    }

                    CpcBankResponse bankDetails = new CpcBankResponse();
                    CpcCardResponse cardDetails = new CpcCardResponse();

                    Name customerDetails = new Name();
                    if (addToWalletRequest.getBillTo() != null && addToWalletRequest.getBillTo().getName() != null) {
                        customerDetails.setFirstName(addToWalletRequest.getBillTo().getName().getFirstName());
                        customerDetails.setLastName(addToWalletRequest.getBillTo().getName().getLastName());
                    }

                    String url = getRequestUrl(urlConfiguration);

                    addToWalletResponse.setCustomerId(walletServiceRequest.getCustomerId());

                    HttpEntity<String> entity = new HttpEntity(walletServiceRequest, requestHeader);

                    Map<String,Object> clientParameters = new HashMap<>();
                    clientParameters.put(URL, url);
                    clientParameters.put(CLIENT_ID, WALLET_SERVICE);
                    clientParameters.put(HTTP_METHOD, HttpMethod.POST);

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

                        addToWalletResponse.setSubmissionDetails(submissionDetails);

                    }

                    if(response.get(CLIENT_RESPONSE_STATUS) == SUCCESS) {

                        submissionDetails.setCpcStatus(SUCCESS);

                        if (walletServiceRequest.getBank() != null) {
                            WalletBankResponse bankDetailsResponse = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), WalletBankResponse.class);

                            bankDetails.setToken(bankDetailsResponse.getToken());
                            bankDetails.setBankAccountType(bankDetailsResponse.getBankAccountType());
                            bankDetails.setMaskedAccountNumber(bankDetailsResponse.getMaskedAccountNumber());
                            bankDetails.setBankAccountLast4Digits(bankDetailsResponse.getBankAccountLast4Digits());

                            bankDetails.setRoutingNumber(addToWalletRequest.getBankDetails().getRoutingNumber());

                            if(walletServiceRequest.getBank().getDefaultInstrument() != null) {
                                bankDetails.setDefaultInstrument(walletServiceRequest.getBank().getDefaultInstrument());
                            } else {
                                bankDetails.setDefaultInstrument(false);
                            }

                        }

                        if (walletServiceRequest.getPaymentCard() != null) {
                            WalletCardResponse cardDetailsResponse = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), WalletCardResponse.class);

                            cardDetails.setToken(cardDetailsResponse.getToken());
                            cardDetails.setCardLast4Digits(cardDetailsResponse.getCardLast4Digits());
                            cardDetails.setCardType(StringUtils.deleteWhitespace(cardDetailsResponse.getCardType()));
                            cardDetails.setExpirationDate(cardDetailsResponse.getExpirationDate());
                            cardDetails.setAvsCode(cardDetailsResponse.getAvsCode());
                            cardDetails.setMaskedCardNumber(MethodOfPaymentServiceUtilities.formatMaskedCardNumber(cardDetailsResponse.getMaskedAccountNumber()));

                            if(walletServiceRequest.getPaymentCard().getDefaultInstrument() != null) {
                                cardDetails.setDefaultInstrument(walletServiceRequest.getPaymentCard().getDefaultInstrument());
                            } else {
                                cardDetails.setDefaultInstrument(false);
                            }

                        }

                        addToWalletResponse.setSubmissionDetails(submissionDetails);

                    }
                    addToWalletResponse.setCustomerDetails(customerDetails);
                    addToWalletResponse.setBankDetails(bankDetails);
                    addToWalletResponse.setCardDetails(cardDetails);
            } else {
                submissionDetails.setCpcStatus(ERROR);
                submissionDetails.setPsErrorCode(null);
                submissionDetails.setPsErrorMessage("A valid walletId is required to perform this action.  Please contact system administrator.");
                addToWalletResponse.setSubmissionDetails(submissionDetails);
            }

        }

        return addToWalletResponse;

    }

    public DeleteExistingPaymentInstrumentResponse deleteExistingPaymentInstrument(HttpHeaders headers,
        DeleteExistingPaymentInstrumentRequest deleteExistingPaymentInstrumentRequest, Map<String, Object> configuration, RestClientFactory restClientFactory) {

        HttpHeaders requestHeader = getCommonHttpHeaders(headers, deleteExistingPaymentInstrumentRequest.getChannel());

        DeleteExistingPaymentInstrumentResponse deleteExistingPaymentInstrumentResponse = new DeleteExistingPaymentInstrumentResponse();

        SubmissionDetails submissionDetails = new SubmissionDetails();
        submissionDetails.setActionTaken(DELETE);
        submissionDetails.setTrackingId(requestHeader.getOrEmpty(PARAM_TRACKING_ID).get(0));

        deleteExistingPaymentInstrumentResponse.setCustomerDetails(deleteExistingPaymentInstrumentRequest.getBillTo());

        if(deleteExistingPaymentInstrumentRequest.getBankDetails() != null &&
            StringUtils.isNotBlank(deleteExistingPaymentInstrumentRequest.getBankDetails().getToken())) {

            submissionDetails.setMethodOfPaymentType(BANK);

            CpcBankResponse bankDetails = new CpcBankResponse();
            bankDetails.setToken(deleteExistingPaymentInstrumentRequest.getBankDetails().getToken());
            bankDetails.setBankAccountType(deleteExistingPaymentInstrumentRequest.getBankDetails().getBankAccountType());
            bankDetails.setMaskedAccountNumber(deleteExistingPaymentInstrumentRequest.getBankDetails().getMaskedAccountNumber());
            bankDetails.setBankAccountLast4Digits(deleteExistingPaymentInstrumentRequest.getBankDetails().getBankAccountLast4Digits());

            deleteExistingPaymentInstrumentResponse.setBankDetails(bankDetails);
        }

        if(deleteExistingPaymentInstrumentRequest.getCardDetails() != null &&
            StringUtils.isNotBlank(deleteExistingPaymentInstrumentRequest.getCardDetails().getToken())) {

            submissionDetails.setMethodOfPaymentType(CARD);

            CpcCardResponse cardDetails = new CpcCardResponse();
            cardDetails.setToken(deleteExistingPaymentInstrumentRequest.getCardDetails().getToken());
            cardDetails.setCardType(deleteExistingPaymentInstrumentRequest.getCardDetails().getCardType());
            cardDetails.setMaskedCardNumber(deleteExistingPaymentInstrumentRequest.getCardDetails().getMaskedCardNumber());
            cardDetails.setCardLast4Digits(deleteExistingPaymentInstrumentRequest.getCardDetails().getCardLast4Digits());
            cardDetails.setExpirationDate(deleteExistingPaymentInstrumentRequest.getCardDetails().getExpirationDate());

            deleteExistingPaymentInstrumentResponse.setCardDetails(cardDetails);
        }

        Map<String, Object> channelValidation = channelAuthValidation(headers, configuration);

        if(!(Boolean) channelValidation.get("validChannel")) {

            submissionDetails.setCpcStatus(ERROR);
            submissionDetails.setPsErrorCode(null);
            submissionDetails.setPsErrorMessage((String) channelValidation.get("validationResponseMessage"));
            deleteExistingPaymentInstrumentResponse.setSubmissionDetails(submissionDetails);

        } else {

            HttpEntity<String> entity = new HttpEntity(requestHeader);

            UrlConfiguration urlConfiguration = new UrlConfiguration();
            urlConfiguration.setRequestType(deleteExistingPaymentInstrumentRequest.getClass().getSimpleName());
            urlConfiguration.setBaseUrl((String) configuration.get(WALLET_SERVICE_URL));
            urlConfiguration.setClientId(WALLET_SERVICE);
            urlConfiguration.setCustomerId(deleteExistingPaymentInstrumentRequest.getCustomerId());
            urlConfiguration.setPaymentToken(deleteExistingPaymentInstrumentRequest.getPaymentToken());

            String url = getRequestUrl(urlConfiguration);

            Map<String,Object> clientParameters = new HashMap<>();
            clientParameters.put(URL, url);
            clientParameters.put(CLIENT_ID, WALLET_SERVICE);
            clientParameters.put(HTTP_METHOD, HttpMethod.DELETE);

            Map<String, String> response = callClient(restClientFactory, entity, clientParameters);

            if(response.get(CLIENT_RESPONSE_STATUS) == ERROR ||
                response.get(CLIENT_RESPONSE_STATUS) == HTTP_ERROR) {

                submissionDetails.setCpcStatus(MethodOfServiceConstants.ERROR);

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

                deleteExistingPaymentInstrumentResponse.setSubmissionDetails(submissionDetails);
            }

            if(response.get(CLIENT_RESPONSE_STATUS) == SUCCESS) {
                DeleteExistingTokenResponse deleteExistingTokenResponse = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE),
                    DeleteExistingTokenResponse.class);

                if (deleteExistingTokenResponse.getResult().equalsIgnoreCase(SUCCESS)) {
                    submissionDetails.setCpcStatus(SUCCESS);
                } else {
                    submissionDetails.setCpcStatus(ERROR);
                    submissionDetails.setPsErrorCode(null);
                    submissionDetails.setPsErrorMessage(deleteExistingTokenResponse.getResult());
                }

                deleteExistingPaymentInstrumentResponse.setSubmissionDetails(submissionDetails);
            }

        }

        return deleteExistingPaymentInstrumentResponse;
    }

    public GetAllPaymentInstrumentsResponse getAllPaymentInstruments(HttpHeaders headers,
        GetAllPaymentInstrumentsRequest getAllPaymentInstrumentsRequest, Map<String, Object> configuration, RestClientFactory restClientFactory) {

        HttpHeaders requestHeader = getCommonHttpHeaders(headers, getAllPaymentInstrumentsRequest.getChannel());

        GetAllPaymentInstrumentsResponse getAllPaymentInstrumentsResponse = new GetAllPaymentInstrumentsResponse();
        getAllPaymentInstrumentsResponse.setTrackingId(requestHeader.getOrEmpty(PARAM_TRACKING_ID).get(0));

        CustomerWalletDetails customerWallet = new CustomerWalletDetails();
        Map<String, Map<String, String>> customerErrorMap = new HashMap<>();
        Boolean multiUser = false;

        Map<String, Object> channelValidation = channelAuthValidation(headers, configuration);

        if(!(Boolean) channelValidation.get(VALID_CHANNEL)) {
            getAllPaymentInstrumentsResponse.setCpcStatus(ERROR);
            getAllPaymentInstrumentsResponse.setPsErrorCode(null);
            getAllPaymentInstrumentsResponse.setPsErrorMessage((String) channelValidation.get(VALIDATION_RESPONSE_MESSAGE));

        } else {

            List<String> tmpCustomerIdList = List.of(getAllPaymentInstrumentsRequest.getCustomerId().split(SPLIT_PIPE));
            List<String> customerIdList = new ArrayList<>(new HashSet<>(tmpCustomerIdList));

            if (customerIdList.size() > 1) {
                multiUser = true;
            }

            int successCount = 0;

            String walletId = null;

            List<WalletCardDetails> walletCards = new ArrayList<WalletCardDetails>();
            List<WalletBankDetails> walletBanks = new ArrayList<WalletBankDetails>();

            HttpEntity<String> entity = new HttpEntity(requestHeader);

            UrlConfiguration urlConfiguration = new UrlConfiguration();
            urlConfiguration.setRequestType(getAllPaymentInstrumentsRequest.getClass().getSimpleName());
            urlConfiguration.setBaseUrl((String) configuration.get(WALLET_SERVICE_URL));
            urlConfiguration.setClientId(WALLET_SERVICE);
            urlConfiguration.setBillingArrangementId(getAllPaymentInstrumentsRequest.getBillingArrangementId());

            for (String customerId : customerIdList) {
                urlConfiguration.setCustomerId(customerId);

                String url = getRequestUrl(urlConfiguration);

                Map<String, Object> clientParameters = new HashMap<>();
                clientParameters.put(URL, url);
                clientParameters.put(CLIENT_ID, WALLET_SERVICE);
                clientParameters.put(HTTP_METHOD, HttpMethod.GET);

                Map<String, String> response = callClient(restClientFactory, entity, clientParameters);

                if (response.get(CLIENT_RESPONSE_STATUS) == ERROR ||
                    response.get(CLIENT_RESPONSE_STATUS) == HTTP_ERROR) {

                    if (response.get(CLIENT_RESPONSE_STATUS) == MethodOfServiceConstants.HTTP_ERROR) {

                        Map<String, String> errorMessages = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), ErrorResponse.class).getMessages();
                        String psErrorCode = errorMessages.keySet().toArray()[0].toString();
                        String psErrorMessage = String.valueOf(errorMessages.get(psErrorCode));

                        Map<String, String> errorMap = new HashMap<>();
                        errorMap.put(psErrorCode, psErrorMessage);
                        customerErrorMap.put(customerId, errorMap);
                    } else {

                        Map<String, String> errorMap = new HashMap<>();
                        errorMap.put("CPC_INTERNAL_ERR", response.get(CLIENT_RESPONSE_MESSAGE));
                        customerErrorMap.put(customerId, errorMap);
                    }
                }

                if (response.get(CLIENT_RESPONSE_STATUS) == SUCCESS) {
                    GetWalletInstrument wallets = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), GetWalletInstrument.class);

                    successCount++;

                    if (wallets != null && wallets.getWallets() != null && !wallets.getWallets().isEmpty()) {

                        WalletDetails wallet = wallets.getWallets().get(0);

                        if (!StringUtils.isEmpty(walletId)) {
                            walletId = walletId + PIPE + wallet.getWalletId();
                        } else {
                            walletId = wallet.getWalletId();
                        }

                        if (wallet.getPaymentCards() != null && !wallet.getPaymentCards().isEmpty()) {
                            List<PaymentCardDetails> paymentCards = wallet.getPaymentCards();

                            for (PaymentCardDetails paymentCard : paymentCards) {
                                WalletCardDetails walletCardDetails = new WalletCardDetails();

                                walletCardDetails.setCustomerId(customerId);
                                walletCardDetails.setDefaultInstrument(paymentCard.getDefaultInstrument());
                                walletCardDetails.setCustomerDefinedName(paymentCard.getCustomerDefinedName());
                                walletCardDetails.setToken(paymentCard.getToken());
                                walletCardDetails.setPaymentMode(paymentCard.getPaymentMode());
                                walletCardDetails.setBillTo(paymentCard.getBillTo());
                                walletCardDetails.setMaskedCardNumber(MethodOfPaymentServiceUtilities.formatMaskedCardNumber(paymentCard.getMaskedAccountNumber()));
                                walletCardDetails.setCardType(StringUtils.deleteWhitespace(paymentCard.getCardType()));
                                walletCardDetails.setExpirationDate(paymentCard.getExpirationDate());
                                walletCardDetails.setCardLast4Digits(paymentCard.getCardLast4Digits());
                                walletCardDetails.setMaskedCvv(MethodOfPaymentServiceUtilities.deriveMaskedCvv(paymentCard.getCardType()));

                                walletCards.add(walletCardDetails);
                            }
                        }

                        if (wallet.getBanks() != null && !wallet.getBanks().isEmpty()) {
                            List<PaymentBankDetails> paymentBanks = wallet.getBanks();

                            for (PaymentBankDetails paymentBank : paymentBanks) {
                                WalletBankDetails walletBankDetails = new WalletBankDetails();

                                walletBankDetails.setCustomerId(customerId);
                                walletBankDetails.setDefaultInstrument(paymentBank.getDefaultInstrument());
                                walletBankDetails.setCustomerDefinedName(paymentBank.getCustomerDefinedName());
                                walletBankDetails.setToken(paymentBank.getToken());
                                walletBankDetails.setPaymentMode(paymentBank.getPaymentMode());
                                walletBankDetails.setBillTo(paymentBank.getBillTo());
                                walletBankDetails.setMaskedAccountNumber(paymentBank.getMaskedAccountNumber());
                                walletBankDetails.setAccountType(paymentBank.getAccountType());
                                walletBankDetails.setBankAccountLast4Digits(paymentBank.getBankAccountLast4Digits());
                                walletBankDetails.setRoutingNumber(paymentBank.getRoutingNumber());

                                walletBanks.add(walletBankDetails);
                            }
                        }

                        if ((wallet.getBanks() == null || wallet.getBanks().isEmpty()) &&
                            (wallet.getPaymentCards() == null || wallet.getPaymentCards().isEmpty())) {

                            Map<String, String> errorMap = new HashMap<>();
                            errorMap.put("CPC_INTERNAL_ERR", PAYMENT_INSTRUMENT_NOT_RETURNED_ERROR + "customer id: " + customerId + ".");
                            customerErrorMap.put(customerId, errorMap);

                        }

                    } else {

                        Map<String, String> errorMap = new HashMap<>();
                        errorMap.put("CPC_INTERNAL_ERR", PAYMENT_INSTRUMENT_NOT_RETURNED_ERROR + "customer id: " + customerId + ".");
                        customerErrorMap.put(customerId, errorMap);

                    }

                }

            }

            if (successCount > 0) {
                getAllPaymentInstrumentsResponse.setCpcStatus(SUCCESS);
                customerWallet.setPaymentCards(walletCards);
                customerWallet.setBanks(walletBanks);
                customerWallet.setWalletId(walletId);
                getAllPaymentInstrumentsResponse.setCustomerWalletDetails(customerWallet);
                if (customerErrorMap != null || !customerErrorMap.isEmpty()) {
                    getAllPaymentInstrumentsResponse.setPsErrorCode(null);
                    getAllPaymentInstrumentsResponse.setPsErrorMessage(null);
                    for (String customerId : customerErrorMap.keySet()) {
                        Map<String,String> error = customerErrorMap.get(customerId);
                        String errorCode = error.keySet().toArray()[0].toString();
                        String errorMessage = String.valueOf(error.get(errorCode));
                        if (!StringUtils.isEmpty(getAllPaymentInstrumentsResponse.getPsErrorCode())) {
                            if (!getAllPaymentInstrumentsResponse.getPsErrorCode().equals(errorCode) &&
                                !getAllPaymentInstrumentsResponse.getPsErrorCode().contains(errorCode)) {
                                getAllPaymentInstrumentsResponse.setPsErrorCode(getAllPaymentInstrumentsResponse.getPsErrorCode() + PIPE + errorCode);
                            }
                        } else {
                            getAllPaymentInstrumentsResponse.setPsErrorCode(errorCode);
                        }
                        if (!StringUtils.isEmpty(getAllPaymentInstrumentsResponse.getPsErrorMessage())) {
                            if (errorMessage.contains(customerId)) {
                                getAllPaymentInstrumentsResponse.setPsErrorMessage(getAllPaymentInstrumentsResponse.getPsErrorMessage() + PIPE + errorMessage);
                            } else {
                                getAllPaymentInstrumentsResponse.setPsErrorMessage(getAllPaymentInstrumentsResponse.getPsErrorMessage() + PIPE +
                                    "Customer Id: " + customerId + " - " + errorMessage);
                            }
                        } else {
                            if (errorMessage.contains(customerId)) {
                                getAllPaymentInstrumentsResponse.setPsErrorMessage(errorMessage);
                            } else {
                                getAllPaymentInstrumentsResponse.setPsErrorMessage("Customer Id: " + customerId + " - " + errorMessage);
                            }
                        }
                    }
                    if ((customerWallet.getBanks() == null || customerWallet.getBanks().isEmpty()) &&
                        (customerWallet.getPaymentCards() == null || customerWallet.getPaymentCards().isEmpty())) {
                        getAllPaymentInstrumentsResponse.setCpcStatus(ERROR);
                        getAllPaymentInstrumentsResponse.setCustomerWalletDetails(null);
                    }
                }
            } else {
                getAllPaymentInstrumentsResponse.setCpcStatus(ERROR);
                if (multiUser == false) {
                    for (String customerId : customerErrorMap.keySet()) {
                        Map<String,String> error = customerErrorMap.get(customerId);
                        String errorCode = error.keySet().toArray()[0].toString();
                        String errorMessage = String.valueOf(error.get(errorCode));
                        getAllPaymentInstrumentsResponse.setPsErrorCode(errorCode);
                        getAllPaymentInstrumentsResponse.setPsErrorMessage(errorMessage);
                    }
                } else {
                    getAllPaymentInstrumentsResponse.setPsErrorCode(null);
                    getAllPaymentInstrumentsResponse.setPsErrorMessage(null);
                    for (String customerId : customerErrorMap.keySet()) {
                        Map<String,String> error = customerErrorMap.get(customerId);
                        String errorCode = error.keySet().toArray()[0].toString();
                        String errorMessage = String.valueOf(error.get(errorCode));
                        if (!StringUtils.isEmpty(getAllPaymentInstrumentsResponse.getPsErrorCode())) {
                            if (!getAllPaymentInstrumentsResponse.getPsErrorCode().equals(errorCode) &&
                                !getAllPaymentInstrumentsResponse.getPsErrorCode().contains(errorCode)) {
                                getAllPaymentInstrumentsResponse.setPsErrorCode(getAllPaymentInstrumentsResponse.getPsErrorCode() + PIPE + errorCode);
                            }
                        } else {
                            getAllPaymentInstrumentsResponse.setPsErrorCode(errorCode);
                        }
                        if (!StringUtils.isEmpty(getAllPaymentInstrumentsResponse.getPsErrorMessage())) {
                            if (errorMessage.contains(customerId)) {
                                getAllPaymentInstrumentsResponse.setPsErrorMessage(getAllPaymentInstrumentsResponse.getPsErrorMessage() + PIPE + errorMessage);
                            } else {
                                getAllPaymentInstrumentsResponse.setPsErrorMessage(getAllPaymentInstrumentsResponse.getPsErrorMessage() + PIPE +
                                    "Customer Id: " + customerId + " - " + errorMessage);
                            }
                        } else {
                            if (errorMessage.contains(customerId)) {
                                getAllPaymentInstrumentsResponse.setPsErrorMessage(errorMessage);
                            } else {
                                getAllPaymentInstrumentsResponse.setPsErrorMessage("Customer Id: " + customerId + " - " + errorMessage);
                            }
                        }
                    }
                }
            }
        }

        return getAllPaymentInstrumentsResponse;
    }

    public GetExistingPaymentInstrumentResponse getExistingPaymentInstrument(HttpHeaders headers,
        GetExistingPaymentInstrumentRequest getExistingPaymentInstrumentRequest, Map<String, Object> configuration, RestClientFactory restClientFactory) {

        HttpHeaders requestHeader = getCommonHttpHeaders(headers, getExistingPaymentInstrumentRequest.getChannel());

        GetExistingPaymentInstrumentResponse getPaymentInstrumentResponse = new GetExistingPaymentInstrumentResponse();
        getPaymentInstrumentResponse.setTrackingId(requestHeader.getOrEmpty(PARAM_TRACKING_ID).get(0));

        Map<String, Object> channelValidation = channelAuthValidation(headers, configuration);

        if(!(Boolean) channelValidation.get(VALID_CHANNEL)) {
            getPaymentInstrumentResponse.setCpcStatus(ERROR);
            getPaymentInstrumentResponse.setPsErrorCode(null);
            getPaymentInstrumentResponse.setPsErrorMessage((String) channelValidation.get(VALIDATION_RESPONSE_MESSAGE));
            getPaymentInstrumentResponse.setWalletCardDetails(null);

        } else {

            HttpEntity<String> entity = new HttpEntity(requestHeader);

            UrlConfiguration urlConfiguration = new UrlConfiguration();
            urlConfiguration.setRequestType(getExistingPaymentInstrumentRequest.getClass().getSimpleName());
            urlConfiguration.setBaseUrl((String) configuration.get(WALLET_SERVICE_URL));
            urlConfiguration.setClientId(WALLET_SERVICE);
            urlConfiguration.setCustomerId(getExistingPaymentInstrumentRequest.getCustomerId());
            urlConfiguration.setPaymentToken(getExistingPaymentInstrumentRequest.getPaymentToken());
            urlConfiguration.setBillingArrangementId(getExistingPaymentInstrumentRequest.getBillingArrangementId());

            String url = getRequestUrl(urlConfiguration);

            Map<String,Object> clientParameters = new HashMap<>();
            clientParameters.put(URL, url);
            clientParameters.put(CLIENT_ID, WALLET_SERVICE);
            clientParameters.put(HTTP_METHOD, HttpMethod.GET);

            Map<String, String> response = callClient(restClientFactory, entity, clientParameters);

            if(response.get(CLIENT_RESPONSE_STATUS) == ERROR ||
                response.get(CLIENT_RESPONSE_STATUS) == HTTP_ERROR) {

                getPaymentInstrumentResponse.setCpcStatus(ERROR);
                getPaymentInstrumentResponse.setWalletCardDetails(null);

                if(response.get(CLIENT_RESPONSE_STATUS) == HTTP_ERROR) {
                    Map<String, String> errorMessages = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), ErrorResponse.class).getMessages();
                    String psErrorCode = errorMessages.keySet().toArray()[0].toString();
                    String psErrorMessage = String.valueOf(errorMessages.get(psErrorCode));

                    getPaymentInstrumentResponse.setPsErrorCode(psErrorCode);
                    getPaymentInstrumentResponse.setPsErrorMessage(psErrorMessage);
                } else {
                    getPaymentInstrumentResponse.setPsErrorCode(null);
                    getPaymentInstrumentResponse.setPsErrorMessage(response.get(CLIENT_RESPONSE_MESSAGE));
                }
            }

            if(response.get(CLIENT_RESPONSE_STATUS) == SUCCESS) {
                GetWalletInstrument wallets = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), GetWalletInstrument.class);

                getPaymentInstrumentResponse.setCpcStatus(SUCCESS);
                getPaymentInstrumentResponse.setPsErrorCode(null);
                getPaymentInstrumentResponse.setPsErrorMessage(null);

                if (wallets != null && wallets.getWallets() != null && !wallets.getWallets().isEmpty()) {
                    WalletDetails wallet = wallets.getWallets().get(0);

                    if (wallet.getPaymentCards() != null && !wallet.getPaymentCards().isEmpty()) {
                        PaymentCardDetails paymentCard = wallet.getPaymentCards().get(0);
                        WalletCardDetails walletCardDetails = new WalletCardDetails();

                        walletCardDetails.setDefaultInstrument(paymentCard.getDefaultInstrument());
                        walletCardDetails.setCustomerDefinedName(paymentCard.getCustomerDefinedName());
                        walletCardDetails.setToken(paymentCard.getToken());
                        walletCardDetails.setPaymentMode(paymentCard.getPaymentMode());
                        walletCardDetails.setBillTo(paymentCard.getBillTo());
                        walletCardDetails.setMaskedCardNumber(MethodOfPaymentServiceUtilities.formatMaskedCardNumber(paymentCard.getMaskedAccountNumber()));
                        walletCardDetails.setCardType(StringUtils.deleteWhitespace(paymentCard.getCardType()));
                        walletCardDetails.setExpirationDate(paymentCard.getExpirationDate());
                        walletCardDetails.setCardLast4Digits(paymentCard.getCardLast4Digits());
                        walletCardDetails.setMaskedCvv(MethodOfPaymentServiceUtilities.deriveMaskedCvv(paymentCard.getCardType()));

                        getPaymentInstrumentResponse.setWalletCardDetails(walletCardDetails);

                    } else if (wallet.getBanks() != null && !wallet.getBanks().isEmpty()) {

                        List<String> bankExclusionChannelList = (List<String>) configuration.get(BANK_EXCLUSION_CHANNEL_LIST);

                        if (bankExclusionChannelList.contains(getExistingPaymentInstrumentRequest.getChannel())) {

                            getPaymentInstrumentResponse.setCpcStatus(ERROR);

                        } else {
                            PaymentBankDetails bank = wallet.getBanks().get(0);
                            WalletBankDetails walletBankDetails = new WalletBankDetails();

                            walletBankDetails.setDefaultInstrument(bank.getDefaultInstrument());
                            walletBankDetails.setCustomerDefinedName(bank.getCustomerDefinedName());
                            walletBankDetails.setToken(bank.getToken());
                            walletBankDetails.setPaymentMode(bank.getPaymentMode());
                            walletBankDetails.setBillTo(bank.getBillTo());
                            walletBankDetails.setMaskedAccountNumber(bank.getMaskedAccountNumber());
                            walletBankDetails.setAccountType(bank.getAccountType());
                            walletBankDetails.setBankAccountLast4Digits(bank.getBankAccountLast4Digits());
                            walletBankDetails.setRoutingNumber(bank.getRoutingNumber());

                            getPaymentInstrumentResponse.setWalletBankDetails(walletBankDetails);
                        }
                    } else {
                        getPaymentInstrumentResponse.setCpcStatus(ERROR);
                        getPaymentInstrumentResponse.setPsErrorMessage(PAYMENT_INSTRUMENT_NOT_RETURNED_ERROR +
                            "customer id: " + getExistingPaymentInstrumentRequest.getCustomerId() +
                            ", payment token: " + getExistingPaymentInstrumentRequest.getPaymentToken() + ".");
                    }
                } else {
                    getPaymentInstrumentResponse.setCpcStatus(ERROR);
                    getPaymentInstrumentResponse.setPsErrorMessage(PAYMENT_INSTRUMENT_NOT_RETURNED_ERROR +
                        "customer id: " + getExistingPaymentInstrumentRequest.getCustomerId() +
                        ", payment token: " + getExistingPaymentInstrumentRequest.getPaymentToken() + ".");
                }
            }
        }

        return getPaymentInstrumentResponse;
    }

    public UpdateExistingPaymentInstrumentResponse updateExistingPaymentInstrument(HttpHeaders headers,
        UpdateExistingPaymentInstrumentRequest updatePaymentInstrumentRequest, Map<String, Object> configuration, RestClientFactory restClientFactory) {

        HttpHeaders requestHeader = getCommonHttpHeaders(headers, updatePaymentInstrumentRequest.getChannel());

        SubmissionDetails submissionDetails = new SubmissionDetails();
        submissionDetails.setActionTaken(UPDATE);
        submissionDetails.setTrackingId(requestHeader.getOrEmpty(PARAM_TRACKING_ID).get(0));

        UpdateExistingPaymentInstrumentResponse updateExistingPaymentInstrumentResponse = new UpdateExistingPaymentInstrumentResponse();

        Map<String, Object> channelValidation = channelAuthValidation(headers, configuration);

        if(!(Boolean) channelValidation.get(VALID_CHANNEL)) {
            submissionDetails.setCpcStatus(ERROR);
            submissionDetails.setPsErrorCode(null);
            submissionDetails.setPsErrorMessage((String) channelValidation.get(VALIDATION_RESPONSE_MESSAGE));
            updateExistingPaymentInstrumentResponse.setSubmissionDetails(submissionDetails);

        } else {

            String modifyTokenRequestString = getWalletServiceRequest(updatePaymentInstrumentRequest.getClass().getSimpleName(),
                new Gson().toJson(updatePaymentInstrumentRequest).toString(), (String) configuration.get(ENVIRONMENT));
            ModifyExistingTokenRequest modifyTokenRequest = new Gson().fromJson(modifyTokenRequestString, ModifyExistingTokenRequest.class);

            UrlConfiguration urlConfiguration = new UrlConfiguration();
            urlConfiguration.setRequestType(updatePaymentInstrumentRequest.getClass().getSimpleName());
            urlConfiguration.setBaseUrl((String) configuration.get(WALLET_SERVICE_URL));
            urlConfiguration.setClientId(WALLET_SERVICE);
            urlConfiguration.setCustomerId(updatePaymentInstrumentRequest.getCustomerId());

            updateExistingPaymentInstrumentResponse.setCustomerDetails(updatePaymentInstrumentRequest.getBillTo());

            if (updatePaymentInstrumentRequest.getBankDetails() != null && StringUtils.isNotBlank(updatePaymentInstrumentRequest.getBankDetails().getToken())) {
                urlConfiguration.setPaymentToken(updatePaymentInstrumentRequest.getBankDetails().getToken());

                CpcBankResponse bankDetails = new CpcBankResponse();
                bankDetails.setToken(updatePaymentInstrumentRequest.getBankDetails().getToken());
                bankDetails.setBankAccountType(updatePaymentInstrumentRequest.getBankDetails().getBankAccountType());
                bankDetails.setMaskedAccountNumber(updatePaymentInstrumentRequest.getBankDetails().getMaskedAccountNumber());
                bankDetails.setBankAccountLast4Digits(updatePaymentInstrumentRequest.getBankDetails().getBankAccountLast4Digits());
                updateExistingPaymentInstrumentResponse.setBankDetails(bankDetails);

                submissionDetails.setMethodOfPaymentType(BANK);
            }

            if (updatePaymentInstrumentRequest.getCardDetails() != null && StringUtils.isNotBlank(updatePaymentInstrumentRequest.getCardDetails().getToken())) {
                urlConfiguration.setPaymentToken(updatePaymentInstrumentRequest.getCardDetails().getToken());

                CpcCardResponse cardDetails = new CpcCardResponse();
                cardDetails.setToken(updatePaymentInstrumentRequest.getCardDetails().getToken());
                cardDetails.setCardType(updatePaymentInstrumentRequest.getCardDetails().getCardType());
                cardDetails.setMaskedCardNumber(updatePaymentInstrumentRequest.getCardDetails().getMaskedCardNumber());
                cardDetails.setCardLast4Digits(updatePaymentInstrumentRequest.getCardDetails().getCardLast4Digits());
                updateExistingPaymentInstrumentResponse.setCardDetails(cardDetails);

                submissionDetails.setMethodOfPaymentType(CARD);
            }

            String url = getRequestUrl(urlConfiguration);

            HttpEntity<String> entity = new HttpEntity(modifyTokenRequest, requestHeader);

            Map<String,Object> clientParameters = new HashMap<>();
            clientParameters.put(URL, url);
            clientParameters.put(CLIENT_ID, WALLET_SERVICE);
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

                updateExistingPaymentInstrumentResponse.setSubmissionDetails(submissionDetails);
            }

            if(response.get(CLIENT_RESPONSE_STATUS) == SUCCESS) {
                ModifyExistingTokenResponse modifyExistingTokenResponse = new Gson().fromJson(response.get(CLIENT_RESPONSE_MESSAGE), ModifyExistingTokenResponse.class);

                if (modifyExistingTokenResponse.getStatus().equalsIgnoreCase(SUCCESS)) {
                    updateExistingPaymentInstrumentResponse.setCustomerDetails(updatePaymentInstrumentRequest.getBillTo());

                    if(submissionDetails.getMethodOfPaymentType() == BANK) {
                        if(modifyTokenRequest.getDefaultInstrument() != null) {
                            updateExistingPaymentInstrumentResponse.getBankDetails().setDefaultInstrument(
                                modifyTokenRequest.getDefaultInstrument());
                        }
                    }

                    if(submissionDetails.getMethodOfPaymentType() == CARD) {
                        updateExistingPaymentInstrumentResponse.getCardDetails().setExpirationDate(
                            updatePaymentInstrumentRequest.getCardDetails().getExpirationDate());

                        if(modifyTokenRequest.getDefaultInstrument() != null) {
                            updateExistingPaymentInstrumentResponse.getCardDetails().setDefaultInstrument(
                                modifyTokenRequest.getDefaultInstrument());
                        }
                    }

                    submissionDetails.setCpcStatus(SUCCESS);
                    updateExistingPaymentInstrumentResponse.setSubmissionDetails(submissionDetails);

                } else {
                    submissionDetails.setCpcStatus(ERROR);
                    submissionDetails.setPsErrorCode(null);
                    submissionDetails.setPsErrorMessage(modifyExistingTokenResponse.getStatus());
                    updateExistingPaymentInstrumentResponse.setSubmissionDetails(submissionDetails);
                }

                updateExistingPaymentInstrumentResponse.setSubmissionDetails(submissionDetails);

            }

        }

        return updateExistingPaymentInstrumentResponse;

    }

    public String getWalletServiceRequest(String requestType, String request, String environment) {

        String[] booleanKeys = {"defaultInstrument", "enableDecisionManager", "storePaymentInstrumentLongTerm"};
        String[] objectKeys = {"addInstrumentToWallet", "billingInfo", "orderInfo", "billTo", "cardDetails", "bankDetails"};
        String[] stringKeys = {"accountType", "cardType", "channel", "customerId", "customerDefinedName", "cvv", "deviceFingerprintId", "encryptedAccountNumber",
            "encryptedCardNumber","expirationDate", "routingNumber", "ipAddress"};

        ArrayList<String> expectedStringKeys = new ArrayList<>();
        for(int i = 0; i < stringKeys.length; i++) {
            expectedStringKeys.add(stringKeys[i]);
        }

        ArrayList<String> expectedBooleanKeys = new ArrayList<>();
        for(int i = 0; i < booleanKeys.length; i++) {
            expectedBooleanKeys.add(booleanKeys[i]);
        }

        ArrayList<String> expectedObjectKeys = new ArrayList<>();
        for(int i = 0; i < objectKeys.length; i++) {
            expectedObjectKeys.add(objectKeys[i]);
        }

        JsonObject frontEndRequestObject = new Gson().fromJson(request, JsonObject.class);
        JsonObject requestObject = new JsonObject();
        JsonObject requestBankObject = new JsonObject();
        JsonObject requestPaymentCardObject = new JsonObject();

        frontEndRequestObject.keySet().forEach(keyStr ->
            {
                if(requestType.equals(UPDATE_EXISTING_PAYMENT_INSTRUMENT_REQUEST)) {
                    if(expectedStringKeys.contains(keyStr)) {
                        requestObject.add(keyStr, new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsString()));
                    }
                    if(expectedObjectKeys.contains(keyStr)) {
                        if (keyStr.equals("billTo")) {
                            requestObject.add(keyStr, new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsJsonObject()));
                        }
                        if(keyStr.equals("bankDetails")) {
                            frontEndRequestObject.get(keyStr).getAsJsonObject().keySet().forEach(subKeyStr ->
                                {
                                    if(subKeyStr.equals("defaultInstrument")) {
                                        requestObject.add(subKeyStr, new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsJsonObject().get(subKeyStr).getAsBoolean()));
                                    }
                                }
                            );
                        }
                        if(keyStr.equals("cardDetails")) {
                            frontEndRequestObject.get(keyStr).getAsJsonObject().keySet().forEach(subKeyStr ->
                                {
                                    if(subKeyStr.equals("defaultInstrument")) {
                                        requestObject.add(subKeyStr, new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsJsonObject().get(subKeyStr).getAsString()));
                                    }
                                    if(subKeyStr.equals("expirationDate")) {
                                        requestObject.add(subKeyStr, new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsJsonObject().get(subKeyStr).getAsString()));
                                    }
                                }
                            );
                        }
                    }
                }

                if(requestType.equals(ADD_TO_WALLET_REQUEST)) {
                    requestObject.add("secure", new Gson().toJsonTree(true));

                    if(frontEndRequestObject.has("bankDetails")) {
                        requestObject.add("bank", requestBankObject);
                    }
                    if(frontEndRequestObject.has("cardDetails")) {
                        requestObject.add("paymentCard", requestPaymentCardObject);
                    }

                    if(expectedStringKeys.contains(keyStr)) {
                        if(keyStr.equals("channel")) {
                            requestObject.add("keyName", new Gson().toJsonTree(
                                PaymentKeyEnum.getKeyName(frontEndRequestObject.get(keyStr).getAsString(), environment)
                            ));
                        } else {
                            requestObject.add(keyStr, new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsString()));
                        }
                    }
                    if(expectedBooleanKeys.contains(keyStr)) {
                        if(keyStr.equals("storePaymentInstrumentLongTerm")) {
                            Boolean longTermStorage = frontEndRequestObject.get(keyStr).getAsBoolean();
                                if (!longTermStorage) {
                                    requestObject.add("preAuthorization", new Gson().toJsonTree(false));
                                } else {
                                    requestObject.add("preAuthorization", new Gson().toJsonTree(true));
                                }
                        } else {
                            requestObject.add(keyStr, new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsBoolean()));
                        }
                    }
                    if(expectedObjectKeys.contains(keyStr)) {
                        if(keyStr.equals("addInstrumentToWallet")) {
                            frontEndRequestObject.get(keyStr).getAsJsonObject().keySet().forEach(subKeyStr ->
                                {
                                    if(subKeyStr.equals("defaultInstrument")) {
                                        if(frontEndRequestObject.get(keyStr).getAsJsonObject().get(subKeyStr) != null) {
                                            if(requestObject.has("bank")) {
                                                requestObject.get("bank").getAsJsonObject().add(subKeyStr, new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsJsonObject().get(subKeyStr).getAsBoolean()));
                                            }
                                            if(requestObject.has("paymentCard")) {
                                                requestObject.get("paymentCard").getAsJsonObject().add(subKeyStr, new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsJsonObject().get(subKeyStr).getAsBoolean()));
                                            }
                                        }
                                    }
                                }
                            );
                            if(!frontEndRequestObject.get(keyStr).getAsJsonObject().has("defaultInstrument")) {
                                if(requestObject.has("bank")) {
                                    requestObject.get("bank").getAsJsonObject().add("defaultInstrument", new Gson().toJsonTree(false));
                                }
                                if(requestObject.has("paymentCard")) {
                                    requestObject.get("paymentCard").getAsJsonObject().add("defaultInstrument", new Gson().toJsonTree(false));
                                }
                            }
                        }
                        if(keyStr.equals("bankDetails")) {
                            frontEndRequestObject.get(keyStr).getAsJsonObject().keySet().forEach(subKeyStr ->
                                {
                                    if(subKeyStr.equals("encryptedAccountNumber")) {
                                        requestObject.get("bank").getAsJsonObject().add("accountNumber", new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsJsonObject().get(subKeyStr).getAsString()));
                                    } else {
                                        requestObject.get("bank").getAsJsonObject().add(subKeyStr, new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsJsonObject().get(subKeyStr).getAsString()));
                                    }
                                }
                            );
                        }
                        if(keyStr.equals("billingInfo") || keyStr.equals("orderInfo")) {
                            requestObject.add(keyStr, new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsJsonObject()));
                        }
                        if(keyStr.equals("billTo")) {
                            if(requestObject.has("bank")) {
                                requestObject.get("bank").getAsJsonObject().add(keyStr, new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsJsonObject()));
                            }
                            if(requestObject.has("paymentCard")) {
                                requestObject.get("paymentCard").getAsJsonObject().add(keyStr, new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsJsonObject()));
                            }
                        }
                        if(keyStr.equals("cardDetails")) {
                            frontEndRequestObject.get(keyStr).getAsJsonObject().keySet().forEach(subKeyStr ->
                                {
                                    if(subKeyStr.equals("encryptedCardNumber")) {
                                        requestObject.get("paymentCard").getAsJsonObject().add("cardNumber", new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsJsonObject().get(subKeyStr).getAsString()));
                                    } else {
                                        requestObject.get("paymentCard").getAsJsonObject().add(subKeyStr, new Gson().toJsonTree(frontEndRequestObject.get(keyStr).getAsJsonObject().get(subKeyStr).getAsString()));
                                    }
                                }
                            );
                        }
                    }
                }
            }
        );
        return requestObject.toString();
    }
}
