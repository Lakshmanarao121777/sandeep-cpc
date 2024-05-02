package com.comcast.xsp.vault.configuration.util;

/**
 * Created by vthumb001c on 4/16/2020.
 */
public class ServiceConstants {

    public static final String AUTHENTICATION_TYPE = "spring.cloud.config.server.vault.authentication.type";

    public static final String APPROLE_LOGINPATH = "spring.cloud.config.server.vault.authentication.appRole.loginPath";

    public static final String APPROLE_ROLEID = "spring.cloud.config.server.vault.authentication.appRole.roleId";

    public static final String APPROLE_SECRETID = "spring.cloud.config.server.vault.authentication.appRole.secretId";

    public static final String ROLE_ID = "role_id";

    public static final String SECRET_ID = "secret_id";

    public static final String GITHUB_LOGINPATH = "spring.cloud.config.server.vault.authentication.github.loginPath";

    public static final String GITHUB_ACCESSKEY = "spring.cloud.config.server.vault.authentication.github.accessKey";

    public static final String TOKEN = "token";

    public static final String DEFAULT_GITHUB_LOGINPATH = "/v1/auth/github_xsp-core/login";

    public static final String DEFAULT_APPROLE_LOGINPATH = "/v1/auth/approle/login";

}
