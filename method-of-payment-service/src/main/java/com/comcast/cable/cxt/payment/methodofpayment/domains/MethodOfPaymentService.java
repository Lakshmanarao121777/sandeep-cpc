package com.comcast.cable.cxt.payment.methodofpayment.domains;

public final class MethodOfPaymentService{

    private final String methodOfPaymentServiceId;

    public MethodOfPaymentService(String id){
        methodOfPaymentServiceId=id;
    }

    public String getMethodOfPaymentServiceId(){
        return methodOfPaymentServiceId;
    }



}
