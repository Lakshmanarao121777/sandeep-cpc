package com.comcast.cable.cxt.payment.methodofpayment.config;

import com.comcast.xsp.service.core.config.ServiceConfiguration;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.OAuthFlow;
import io.swagger.v3.oas.models.security.OAuthFlows;
import io.swagger.v3.oas.models.security.Scopes;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.Resource;

@Configuration
public class SwaggerConfiguration {
    public static final String PROPNAME_PF_SERVER_URL = "xsp.security.pf.server.url";
    public static final String PROPNAME_SCOPES = "authServer.scope";

    @Resource(name = "xsp.service.Configuration")
    private ServiceConfiguration configuration;

    @Bean
    public OpenAPI customConfiguration() {
        Scopes scopes = new Scopes();
        this.configuration.getStringList(PROPNAME_SCOPES).forEach(scope -> scopes.addString(scope, scope));
        return new OpenAPI()
            .components(new Components()
                .addSecuritySchemes("websec_auth", new SecurityScheme()
                    .type(SecurityScheme.Type.OAUTH2)
                    .flows(new OAuthFlows()
                        .clientCredentials(new OAuthFlow()
                            .tokenUrl(this.configuration.getString(PROPNAME_PF_SERVER_URL))
                            .scopes(scopes)
                        ))))
            .info(new Info()
                .title("Method Of Payment Service API Docs")
                .description("REST API documentation")
                .version("1.0")
                .contact(new Contact()
                    .name("Method of Payment Service")
                ));
    }
}
