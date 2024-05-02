package com.comcast.cable.cxt.payment.paymentContract.domains;

public final class PaymentContractService{

    private final String paymentContractServiceId;

    public PaymentContractService(String id){
        paymentContractServiceId=id;
    }

    public String getPaymentContractServiceId(){
        return paymentContractServiceId;
    }
}
