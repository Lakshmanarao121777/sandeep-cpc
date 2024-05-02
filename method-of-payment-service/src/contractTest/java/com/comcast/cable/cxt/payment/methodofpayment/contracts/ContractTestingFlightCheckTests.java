package com.comcast.cable.cxt.payment.methodofpayment.contracts;

import com.comcast.xsp.test.core.config.ServiceTestConfiguration;
import com.comcast.xsp.test.core.logging.LoggingVerificationRule;
import com.comcast.xsp.test.core.security.OauthTestAssistant;
import com.comcast.xsp.test.core.service.RestAssuredAssistant;
import com.comcast.xsp.test.setup.ContractTestAdapter;
import com.comcast.xsp.test.setup.ContractTestConfiguration;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.response.ResponseBody;
import org.apache.http.HttpStatus;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import javax.annotation.Resource;
import static com.github.dreamhead.moco.Moco.and;
import static com.github.dreamhead.moco.Moco.by;
import static com.github.dreamhead.moco.Moco.header;
import static com.github.dreamhead.moco.Moco.status;
import static com.github.dreamhead.moco.Moco.uri;
import static com.github.dreamhead.moco.Moco.with;
import static com.github.dreamhead.moco.Runner.running;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Tests for checking that the xsp-gradle-test-contract plugin is working as expected.
 */
@RunWith(SpringRunner.class)
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.NONE,
    classes = {ContractTestConfiguration.class}
)
public class ContractTestingFlightCheckTests extends ContractTestAdapter {
    @Rule
    public LoggingVerificationRule logRule = new LoggingVerificationRule();

    @Resource(name = "xsp.test.RestAssuredAssistant")
    private RestAssuredAssistant restAssuredAssistant;

    @Resource(name = "xsp.test.OauthAssistant")
    private OauthTestAssistant oauthAssistant;

    @Resource(name = "xsp.test.service.Configuration")
    private ServiceTestConfiguration serviceConfig;

    @Test
    public void shouldCheckServiceCodeLoadsApplicationProperties() throws Exception {
        Response response = restAssuredAssistant.initialize()
            .addOauthToken()
            .shouldLogAll()
            .construct()
            .given().header("sourceSystemId", "functionalTests")
            .and().header("timestamp", "StampedTime")
            .and().header("sourceServerId", "localFunctionalTests")
            .get("/api/flightcheck/propertysources")
            .then()
            .assertThat().statusCode(HttpStatus.SC_OK)
            .extract().response();

        String appPropWorks = response.getBody().jsonPath().getString("applicationProperties");
        assertThat(appPropWorks).isEqualTo("AYBABTU");
    }

    @Test
    public void shouldCheckContractPropsOverrideApplicationProperties() throws Exception {
        Response response = restAssuredAssistant.initialize()
            .addOauthToken()
            .shouldLogAll()
            .construct()
            .given().header("sourceSystemId", "functionalTests")
            .and().header("timestamp", "StampedTime")
            .and().header("sourceServerId", "localFunctionalTests")
            .get("/api/flightcheck/contract/propoveride")
            .then()
            .assertThat().statusCode(HttpStatus.SC_OK)
            .extract().response();

        String appPropWorks = response.getBody().jsonPath().getString("propertyOverride");
        assertThat(appPropWorks).isEqualTo("GhostNappa");
    }

    @Test
    public void shouldHaveAccessToContractTestPropsFromTestContext() throws Exception {
        assertThat(this.serviceConfig.getString("xsp.test.flightcheck.testctxvalue")).isEqualTo("SSGSS");
    }

    @Test
    public void shouldHaveMocoConfigHandleBackendRequests() throws Exception {
        final String endpointPath = this.serviceConfig.getString("remoteservice.contractmococheck.path");
        final String mocoEndpoint = this.serviceConfig.getString("moco.endpoint.contractmococheck.path");
        mocoServer.
            request(and(
                by(uri(mocoEndpoint))
            )).
            response(
//                        with(readFileText("data/mococheckResponse.json")),
                with("{\"tokenMartyStu\": \"Asuna\",\"tokenMarySue\": \"Kirito\",\"message\":\"Everything is fine\"}"),
                header("Content-Type", MediaType.APPLICATION_JSON_UTF8_VALUE),
                status(200));
        running(mocoServer, () -> {
            Response response = restAssuredAssistant.initialize()
                .addOauthToken()
                .shouldLogAll()
                .construct()
                .given().header("sourceSystemId", "functionalTests")
                .and().header("timestamp", "StampedTime")
                .and().header("sourceServerId", "localFunctionalTests")
                .get(endpointPath);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.SC_OK);
            ResponseBody body = response.getBody();
            JsonPath bodyJsonPath = body.jsonPath();
            assertThat(bodyJsonPath.getString("tokenMarySue")).isEqualTo("Kirito");
        });

    }

}
