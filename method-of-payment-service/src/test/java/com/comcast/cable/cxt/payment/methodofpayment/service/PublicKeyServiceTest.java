package com.comcast.cable.cxt.payment.methodofpayment.service;

import com.comcast.cable.cxt.payment.methodofpayment.services.PublicKeyService;
import com.comcast.cable.cxt.payment.methodofpayment.vo.*;
import com.comcast.xsp.connector.core.rest.RestClient;
import com.comcast.xsp.connector.core.rest.RestClientFactory;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import static com.comcast.cable.cxt.payment.methodofpayment.MethodOfServiceTestConstants.*;

@RunWith(MockitoJUnitRunner.class)
public class PublicKeyServiceTest {

    @InjectMocks
    private PublicKeyService publicKeyService;

    @Mock
    private RestClientFactory mockRestClientFactory;

    @Mock
    private RestClient mockRestClient;

    private GetPublicKeyRequest getPublicKeyRequest = generatePublicKeyRequest();

    private HttpClientErrorException clientErrorException = null;

    private HttpServerErrorException serverErrorException = null;

    private HttpHeaders requestHeader = setUpRequestHeader();

    private ResponseEntity<String> response = null;

    private String errorString = "Default Error String";
    private String publicKeyServiceTestEndpoint = "https://test-api.comcast.net/payment-key-test/public";
    private String responseBody = "Default Http Response";

    private Map<String, Object> clientConfig = generateTestClientConfig(publicKeyServiceTestEndpoint);

    @Test
    public void shouldReturnPublicKey() throws Exception {

        GetPublicKeyRequest publicKeyRequestTestChannel = generatePublicKeyRequest();
        GetPublicKeyRequest publicKeyRequestChannelTest = generatePublicKeyRequest();
        publicKeyRequestChannelTest.setChannel("CHANNEL-TEST");

        response = generateResponse(GET_PUBLIC_KEY_RESPONSE);

        when(mockRestClientFactory.getClient("paymentkeyservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenReturn(response);

        GetPublicKeyResponse getKeyResponseFromServiceTestChannel = publicKeyService.retrievePaymentServicePublicKey(requestHeader, publicKeyRequestTestChannel, clientConfig, mockRestClientFactory);
        GetPublicKeyResponse getKeyResponseFromCacheTestChannel = publicKeyService.retrievePaymentServicePublicKey(requestHeader, publicKeyRequestTestChannel, clientConfig, mockRestClientFactory);

        GetPublicKeyResponse getKeyResponseFromServiceChannelTest = publicKeyService.retrievePaymentServicePublicKey(requestHeader, publicKeyRequestChannelTest, clientConfig, mockRestClientFactory);
        GetPublicKeyResponse getKeyResponseFromCacheChannelTest = publicKeyService.retrievePaymentServicePublicKey(requestHeader, publicKeyRequestChannelTest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(2)).getClient("paymentkeyservice");
        assertEquals("TesTPubLiCKeY", getKeyResponseFromServiceTestChannel.getPublicKey());
        assertEquals("SUCCESS", getKeyResponseFromServiceTestChannel.getCpcStatus());
        assertEquals("TesTPubLiCKeY", getKeyResponseFromCacheTestChannel.getPublicKey());
        assertEquals("SUCCESS", getKeyResponseFromCacheTestChannel.getCpcStatus());
        assertEquals("TesTPubLiCKeY", getKeyResponseFromServiceChannelTest.getPublicKey());
        assertEquals("SUCCESS", getKeyResponseFromServiceChannelTest.getCpcStatus());
        assertEquals("TesTPubLiCKeY", getKeyResponseFromCacheChannelTest.getPublicKey());
        assertEquals("SUCCESS", getKeyResponseFromCacheChannelTest.getCpcStatus());
    }

    @Test
    public void getPublicKeyHttpClientErrorException() throws Exception {

        clientErrorException = generateHttpClientErrorException(PAYMENT_KEY_SERVICE_ERROR);

        when(mockRestClientFactory.getClient("paymentkeyservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(clientErrorException);

        GetPublicKeyResponse getKeyResponse = publicKeyService.retrievePaymentServicePublicKey(requestHeader, getPublicKeyRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("paymentkeyservice");
        assertEquals("ERROR", getKeyResponse.getCpcStatus());
        assertEquals("PAYMENT-0000", getKeyResponse.getPsErrorCode());
        assertEquals("Unable to return key.", getKeyResponse.getPsErrorMessage());
    }

    @Test
    public void getPublicKeyHttpServerErrorException() throws Exception {

        serverErrorException = generateHttpServerErrorException(PAYMENT_KEY_SERVICE_ERROR);

        when(mockRestClientFactory.getClient("paymentkeyservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(), eq(String.class))).thenThrow(serverErrorException);

        GetPublicKeyResponse getKeyResponse = publicKeyService.retrievePaymentServicePublicKey(requestHeader, getPublicKeyRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("paymentkeyservice");
        assertEquals("ERROR", getKeyResponse.getCpcStatus());
        assertEquals("PAYMENT-0000", getKeyResponse.getPsErrorCode());
        assertEquals("Unable to return key.", getKeyResponse.getPsErrorMessage());
    }

    @Test
    public void getPublicKeyResourceAccessException() throws Exception {

        when(mockRestClientFactory.getClient("paymentkeyservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(),
            eq(String.class))).thenThrow(new ResourceAccessException(errorString, new IOException()));

        GetPublicKeyResponse getKeyResponse = publicKeyService.retrievePaymentServicePublicKey(requestHeader, getPublicKeyRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("paymentkeyservice");
        assertEquals("ERROR", getKeyResponse.getCpcStatus());
        assertEquals("I/O exception while calling Payment Key Service.", getKeyResponse.getPsErrorMessage());
    }

    @Test
    public void getPublicKeyOtherException() throws Exception {

        when(mockRestClientFactory.getClient("paymentkeyservice")).thenReturn(mockRestClient);
        when(mockRestClient.exchange(Mockito.isA(String.class), eq(HttpMethod.GET), Mockito.<HttpEntity<String>> any(),
            eq(String.class))).thenThrow(new RuntimeException(errorString));

        GetPublicKeyResponse getKeyResponse = publicKeyService.retrievePaymentServicePublicKey(requestHeader, getPublicKeyRequest, clientConfig, mockRestClientFactory);

        verify(mockRestClientFactory, times(1)).getClient("paymentkeyservice");
        assertEquals("ERROR", getKeyResponse.getCpcStatus());
        assertEquals("Default Error String", getKeyResponse.getPsErrorMessage());
    }

    @Test
    public void deriveGetPublicKeyResponseSuccessTest(){
        Map<String, String> publicKeyResponse = new HashMap<>();
        String channelName="TEST";
        String publicKey = "MEgCQQCo9+BpMRYQ/dL3DS2CyJxRF+j6ctbT3/Qp84+KeFhnii7NT7fELilKUSnx\nS30WAvQCCo2yU1orfgqr41mM70MBAgMBAAE=";
        publicKeyResponse.put(channelName,publicKey);

        GetPublicKeyResponse response = publicKeyService.deriveGetPublicKeyResponse(publicKeyResponse, channelName);
        assertEquals(publicKey, response.getPublicKey());
        assertEquals("SUCCESS", response.getCpcStatus());
    }

    @Test
    public void deriveGetPublicKeyResponseErrorTest(){
        Map<String, String> publicKeyResponse = new HashMap<>();
        String channelName="TEST";
        String publicKey = "value<10";
        publicKeyResponse.put(channelName,publicKey);

        GetPublicKeyResponse response = publicKeyService.deriveGetPublicKeyResponse(publicKeyResponse, channelName);
        assertEquals(publicKey, response.getPublicKey());
        assertEquals("ERROR", response.getCpcStatus());
    }

    @Test
    public void deriveGetPublicKeyResponsePsErrorMsgTest(){
        Map<String, String> publicKeyResponse = new HashMap<>();
        String channelName="TEST";
        publicKeyResponse.put("psErrorMessage","Some Error occurred");

        GetPublicKeyResponse response = publicKeyService.deriveGetPublicKeyResponse(publicKeyResponse, channelName);
        assertEquals(null, response.getPublicKey());
        assertEquals("ERROR", response.getCpcStatus());
    }

    @Test
    public void deriveGetPublicKeyResponsePsErrorCodeTest(){
        Map<String, String> publicKeyResponse = new HashMap<>();
        String channelName="TEST";
        publicKeyResponse.put("psErrorCode","PS-123");

        GetPublicKeyResponse response = publicKeyService.deriveGetPublicKeyResponse(publicKeyResponse, channelName);
        assertEquals(null, response.getPublicKey());
        assertEquals("ERROR", response.getCpcStatus());
    }

    @Test
    public void deriveGetPublicKeyResponseExceptionTest(){
        Map<String, String> publicKeyResponse = new HashMap<>();
        String channelName="TEST";
        publicKeyResponse.put("Exception","Runtime Exception");

        GetPublicKeyResponse response = publicKeyService.deriveGetPublicKeyResponse(publicKeyResponse, channelName);
        assertEquals(null, response.getPublicKey());
        assertEquals("ERROR", response.getCpcStatus());
    }

    @Test
    public void deriveGetPublicKeyResponseEmptyMapTest(){
        Map<String, String> publicKeyResponse = new HashMap<>();
        String channelName="TEST";
        GetPublicKeyResponse response = publicKeyService.deriveGetPublicKeyResponse(publicKeyResponse, channelName);
        assertEquals(null, response.getPublicKey());
        assertEquals("ERROR", response.getCpcStatus());
    }
}
