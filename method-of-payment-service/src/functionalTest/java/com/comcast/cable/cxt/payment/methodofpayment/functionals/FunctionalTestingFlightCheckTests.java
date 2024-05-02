package com.comcast.cable.cxt.payment.methodofpayment.functionals;

import com.comcast.cable.cxt.payment.methodofpayment.MethodOfPaymentServiceApplication;
import ch.qos.logback.classic.spi.LoggingEvent;
import com.comcast.xsp.service.core.config.ServiceConfiguration;
import com.comcast.xsp.test.core.logging.LoggingVerificationRule;
import com.comcast.xsp.test.core.security.OauthTestAssistant;
import com.comcast.xsp.test.core.service.RestAssuredAssistant;
import com.comcast.xsp.test.setup.FunctionalTestAdapter;
import org.apache.http.HttpStatus;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.net.URI;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;

/**
 * Tests for checking that the xsp-gradle-test-functional plugin is working as expected.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    classes = MethodOfPaymentServiceApplication.class
)
public class FunctionalTestingFlightCheckTests extends FunctionalTestAdapter {

    @Rule
    public LoggingVerificationRule logRule = new LoggingVerificationRule();

    @Resource(name = "xsp.test.RestAssuredAssistant")
    private RestAssuredAssistant restAssuredAssistant;

    @Resource(name = "xsp.test.OauthAssistant")
    private OauthTestAssistant oauthAssistant;

    @Resource(name = "xsp.service.Configuration")
    private ServiceConfiguration serviceConfig;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void shouldCheckServiceCodeLoadsApplicationProperties() throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization","Bearer "+this.oauthAssistant.createJwtToken());
        headers.add("sourceSystemId", "functionalTests");
        headers.add("timestamp", "StampedTime");
        headers.add("sourceServerId", "localFunctionalTests");

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = this.restTemplate.exchange(new URI("/api/flightcheck/propertysources"), HttpMethod.GET, entity, String.class);
        String body = response.getBody();
        assertThatJson(body).inPath("$.applicationProperties").isEqualTo("AYBABTU");
    }

    @Test
    public void shouldCheckThatFunctionalPropsOverrideApplicationProperties() throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization","Bearer "+this.oauthAssistant.createJwtToken());
        headers.add("sourceSystemId", "functionalTests");
        headers.add("timestamp", "StampedTime");
        headers.add("sourceServerId", "localFunctionalTests");

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = this.restTemplate.exchange(new URI("/api/flightcheck/functional/propoveride"), HttpMethod.GET, entity, String.class);
        String body = response.getBody();
        assertThatJson(body).inPath("$.propertyOverride").isEqualTo("Goku");
    }

    @Test
    public void shouldHaveAccessToFunctionalTestPropsFromTestContext() throws Exception {
        assertThat(this.serviceConfig.getString("xsp.test.flightcheck.testctxvalue")).isEqualTo("UltraInstinct");
    }

    @Test
    public void shouldAllowVerificationOfLogOutputInServiceAppContext() throws Exception {
        restAssuredAssistant.initialize()
            .addOauthToken()
            .construct()
            .given().header("sourceSystemId", "functionalTests")
            .and().header("timestamp", "StampedTime")
            .and().header("sourceServerId", "localFunctionalTests")
            .post("/api/flightcheck/functional/logVerification").then().assertThat().statusCode(HttpStatus.SC_OK);
        //
        verify(logRule.getAppender()).doAppend(argThat(argument -> ((LoggingEvent)argument).getFormattedMessage().contains("LogVerificationTest_info")));
        verify(logRule.getAppender()).doAppend(argThat(argument -> ((LoggingEvent)argument).getFormattedMessage().contains("ExceptionLogVerification")));
        verify(logRule.getAppender()).doAppend(argThat(argument -> ((LoggingEvent)argument).getFormattedMessage().contains("ExceptionLogVerificationEntry")));
    }
}
