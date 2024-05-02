# xsp-config-server

[TOC levels=2-4 number]: # "#### Table of Contents"

#### Table of Contents
1. [Overview](#overview)
2. [Setup and Configuration](#setup-and-configuration)
   1. [Github](#github)
      1. [Service Configuration Repository](#service-configuration-repository)
      1. [Shared Configuration Repository](#shared-configuration-repository)
   1. [Vault](#vault)
      1. [Create a Service Account](#create-a-service-account)
      1. [Create a Team Vault Org](#create-a-team-vault-org)
      1. [Authentication Schemes](#authentication-schemes)
      1. [More Details](#more-details)
   1. [Configuration Server](#configuration-server)
   1. [Your Service](#your-service)
      1. [boostrap.yml](#boostrapyml)
      1. [Properties](#properties)
      1. [Manifest](#manifest)
3. [Server Usage](#server-usage)
   1. [Property Encryption](#property-encryption)
4. [Property Refreshing](#property-refreshing)
   1. [Application Deployment Manifest Setup For Properties Refresh](#application-deployment-manifest-setup-for-properties-refresh)
   1. [Bus Properties Refresh](#bus-properties-refresh)
5. [Testing](#testing)
   1. [Config Server](#config-server)
   1. [Client Service](#client-service)
6. [Alternative Configurations](#alternative-configurations)
   1. [Multiple Service Configurations, One Repo](#multiple-service-configurations-one-repo)
      1. [Github](#github-1)
      1. [Configuration Server](#configuration-server-1)
      1. [Your Service](#your-service-1)
7. [A Note About Health](#a-note-about-health)
8. [A Note About Security](#a-note-about-security)
   1. [Config Server Setup](#config-server-setup)
   1. [Config Server Access](#config-server-access)
   1. [Actuator Security](#actuator-security)
9. [Contributing](#contributing)
10. [ChangeLog](#changelog)


## Overview
<img alt="Spring cloud logo" align="right" height="247" width="307" src="doc/images/spring-cloud.png">
Well hello there. It seems you are in need of a configuration source, and you have come to the right place.


This is the XSP Configuration server. This server, as it exists, is fully configurable and is designed to serve properties from a primary service configuration github repository along with a shared configuration repository, with a little Vault secrets management on the side. As an example, you would have your service's properties in one git repository while the properties shared by the services managed by your group would reside in another git repository, and your credentials would be sequestered in your team's vault org.

This kind of setup has several benefits.

1. Each service will be in charge of managing its own properties without the possibility of another service group accidentally changing anything.
1. You could have every configuration repository made private with access given only to the service team and your CII setup. This pleases the Security gods.
1. With a tweak to the configuration repository URI, you can have multiple services, each with their configuration files in separate repositories, using the same configuration server.

Just for reference, here's some cloud config docu that you will want to refer to later in these instructions:

> Where do you want to store the configuration data for the Config Server? The strategy that governs this behaviour is the `EnvironmentRepository`, serving `Environment` objects. This `Environment` is a shallow copy of the domain from the Spring `Environment` (including `propertySources` as the main feature). The`Environment` resources are parametrized by three variables:
```
{application}, which maps to spring.application.name on the client side.
{profile}, which maps to spring.profiles.active on the client (comma-separated list).
{label}, which is a server side feature labelling a "versioned" set of config files.
```

> The HTTP service has resources in the form:
```
/{application}/{profile}[/{label}]
/{application}-{profile}.yml
/{label}/{application}-{profile}.yml
/{application}-{profile}.properties
/{label}/{application}-{profile}.properties
```

And also, the [composite configuration docu](http://cloud.spring.io/spring-cloud-static/spring-cloud-config/2.0.0.RELEASE/single/spring-cloud-config.html#composite-environment-repositories).

## Setup and Configuration
<p align="center">
<img alt="Diagram showing microservice calling configuration server, and the config server calling github and vault for values." height="150.8" width="704.6" src="doc/images/XSPConfigServerArch.png">
</p>
This section describes the standard setup of the configuration server.  This setup is based on the `composite` configuration for Spring Cloud Config Server, which has two or more configuration sources searched in series based on the provided values for "application", "profile", and "label".

> **NOTE:** You should fork this repo into your team's org, but you do NOT need to change anything.  The configuration is fully resolved from your config server's deployment manifests.  No changes to the source code should ever be needed.  Attach your config server's pipeline to your fork's develop branch, and when we come out with a new version, you can pull in our change to your fork's develop branch when you're ready to deploy it. 
<p align="center">
<img alt="Diagram describing how configuration server opens channel to a team's github configuration organization." height="530" width="689" src="doc/images/XSPConfigServer01.png">
</p>

### Github
The configuration for this server is tailored to having one github org specifically for configurations.  For a more complete setup guide for the configuration org and repositories, check out the [xsp-config-repo-templates](https://github.comcast.com/XSP/xsp-config-repo-templates) project repository. For now, in brief...

Given you have serviceStarTrek and serviceStarWars, in the github "configuration org": 

```
Org: xsp-config-org
    repo: serviceStarTrek (private)
    repo: serviceStarWars (private)
    repo: xsp-shared (private)
```   

#### Service Configuration Repository
In service repos (eg. serviceStarTrek), you would have your properties (or yaml) files laid out like this:

```
Root:
serviceStarTrek-dev.yml
serviceStarTrek-int.yml
serviceStarTrek-prd-r2.yml
serviceStarTrek-prd-r3.yml
serviceStarTrek-qa.yml
serviceStarTrek-stg-r2.yml
serviceStarTrek-stg-r3.yml

```

The format is:
```
{application}-{profile}.[yml|properties]
```

Yes, the file name starts with, and the repository name is, the name of your service from your service's `application.properties` file entry:

```
spring.application.name=xsp-reference-service
```

This is due to the byzantine logic Spring Cloud Config uses to get properties. There's really no help for it.

#### Shared Configuration Repository

For the "shared" repository, we are using a trick that Spring Cloud Config uses to load profile-based properties.  In the "xsp-shared" repository, your files will look like this:

```
application-dev.properties
application-int.properties
application-prd-r2.properties
application-prd-r3.properties
application-qa.properties
application-stg-r2.properties
application-stg-r3.properties
``` 
This filename format is very specific:

```
application-{profile}.[yml|properties]
```
When Spring Cloud Config goes to a github repository, it will load the target file based on the `application`, `profile`, and configured pattern values, but it will also look for files with names prefixed with "application" and ending with the profile name.  These are normally used to load shared values in a single github repository that holds configuration files for multiple services.  In this case, we are using it to load shared files from a separate repository in order to avoid having those shared values littered across many repositories. 

> **WARNING:** Both the service configuration repo and the `shared` repo need to have the requested branch existing for the target label.  If, for example, you are sending requests for `develop` branch (known as the "label") and that branch does not exist in the `shared` repository, your properties request will fail.


### Vault
<img align="right" height="273" width="185" src="doc/images/HashiCorpVault.png">
Vault is our Secrets as a Service (SaaS) backend, the support for which is built into the config server. According to the various internal standards, values which can be considered "secrets", meaning usernames, passwords, tokens, API keys, and the like should be stored in the Vault backend, with all other values being fine coming from the git repository backends. Basically, a secret is anything that to which you want to tightly control access to.  Vault provides a unified interface to any secret while providing tight access control and recording a detailed audit log.

> **NOTE:** Keep in mind that Vault currently has no support for versioning.  Practically speaking, this means when you push a new service version to production, you'll have to manually change values by hand in the production directories of your vault org before you can deploy the new version.  This is in contrast to git support, where a discreet branch of the production properties is created within your pipeline and the production service instances are pointed at that branch.

> **ALSO NOTE:** Config server Vault integration is with the Security Team's vault installation, not the vault installation integrated with our Concourse.  They are two separate Vault installations.

#### Create a Service Account
[Service Account Directions](https://wiki.sys.comcast.net/display/IAM/Service+Accounts)

You will need a service account for the config server to use for authentication to your team's Vault org.  **DO NOT** use one of your team's developer accounts.  If that developer leaves for some reason, you may experience service interruption with the config server.  That would be, what we call in the business, "bad".

#### Create a Team Vault Org
[Vault Documentation](https://github.comcast.com/TP-PSP/secrets-as-a-service-samples/blob/main/ONBOARDING.md)

**WARNING:** Use a service account github token!  Do not use your personal github account!!!

To deploy the config server, you will need a Vault org for your team.  To get that, you should go to the vault documentation and follow the onboarding directions there. If you want more information on how to manage your config Vault, take a look at the documentation here: [How Do I: SaaS](https://security.sys.comcast.net/How_Do_I/Secrets_as_a_Service/index.md)

#### Authentication Schemes
   
##### APP_ROLE
Vault only supports this authentication scheme.
* This mechanism uses App Role's Role ID and Secret ID to generate Vault Access Token.
* Role ID and Secret ID are associated to an App Role. Role ID being a constant value.
* Secret ID is generated and can be long lived. Mostly we generate Secret ID to live longer (may be 3 to 6 months and then rotate) or with no expiry.
* For more details: [Vault configuration](https://etwiki.sys.comcast.net/display/PP/Vault+configuration), [APPROLE](https://github.comcast.com/TP-PSP/secrets-as-a-service-samples/edit/main/backends/auth/approle/README.md)


##### GITHUB_ORG
This type of authentication method is no more supported from vault.

* This mechanism uses Github Access key and Org to generate Vault Access Token.
* We will use a service account's Github access key.    
  *You could use the service account you already have for access to Github, but it's recommended you have a separate service account for access to Vault.*
* In order to Read secrets from Vault, Service Account must be added to `Vault-Admins` team in Github Org.
* For more details: https://github.comcast.com/TP-PSP/secrets-as-a-service-samples/blob/master/ONBOARD.md
   
#### More Details
<p align="center">
<img height="530" width="689" src="doc/images/XSPConfigServerSeqDiagram.png">
</p>


### Configuration Server
With your github repositories set up, you can now get a configuration server running that can read them.

This server project is pre-configured with two respository URIs set up in a Spring Cloud Config "composite" structure.  Take a look at the application.yml file for what that looks like.  What it means is your service's cloud config client can retrieve property values from multiple github repositories simultaneously, and with an order of precedence that allows you to override property values from the shared repository.  

The configuration server manifest:
```yaml
applications:
- name: xsp-config-server
  host: xsp-config-server

  env:
    APP_REPO_GITHUB_URI: "https://github.comcast.com/xsp-config-org/{application}"
    APP_REPO_GITHUB_USERNAME: "username"
    APP_REPO_GITHUB_PASSWORD: "password"
    SHARED_REPO_GITHUB_URI: "https://github.comcast.com/xsp-config-org/xsp-shared"
    SHARED_REPO_GITHUB_USERNAME: "username"
    SHARED_REPO_GITHUB_PASSWORD: "password"
    VAULT_HOST: "vaultHost"
    VAULT_PORT: "vaultPort"
    VAULT_ORG: "secret/vaultOrg"
    VAULT_ROLEID: "vaultRoleId"
    VAULT_SECRETID: "vaultSecretID"
    CONFIG_SERVER_USERNAME: "username"
    CONFIG_SERVER_PASSWORD: "password"
    ENCRYPT_KEY: "encryptKey"
```

Some explanation is required here.  We are using another Spring Cloud Config trick with the `{application}` placeholder in the main application repository URI value.  When you make a request, the configuration server will take the application name (from your service's application.properties file) and search the `xsp-config-org` github org for a repository with that name.  This is how we enable having one cloud configuration server serving properties for multiple services, each service with its own configuration repository.

In short, given our "serviceStarTrek" example, the cloud config client will make this request when your service initializes:

```
https://xsp-config-server.u1.app.cloud.comcast.net/serviceStarTrek/dev/develop
```

The "serviceStarTrek" portion of that request is what will supply the value for the `{application}` placeholder.

This example uses the `xsp-config-org` github org, but you can replace that with your organization's configuration github org when you build out a configuration server for your group.

Here's an explanation of the manifest entries:

| Application File Name       | Manifest Name               | Description                                                 |
|:----------------------------|:----------------------------|:------------------------------------------------------------|
| app.repo.github.uri         | APP_REPO_GITHUB_URI         | The default github repository URI.                          |
| app.repo.github.username    | APP_REPO_GITHUB_USERNAME    | The default github repository username.                     |
| app.repo.github.password    | APP_REPO_GITHUB_PASSWORD    | The default github repository password.                     |
| shared.repo.github.uri      | SHARED_REPO_GITHUB_URI      | The shared properties github repository URI.                |
| shared.repo.github.username | SHARED_REPO_GITHUB_USERNAME | The shared properties github repository username.           |
| shared.repo.github.password | SHARED_REPO_GITHUB_PASSWORD | The shared properties github repository password.           |
| vault.host                  | VAULT_HOST                  | The vault host URI.                                         |
| vault.port                  | VAULT_PORT                  | The vault host port.                                        |
| vault.org                   | VAULT_ORG                   | Your team's vault org. This will be secret/yourOrgName.     |
| vault.roleId                | VAULT_ROLEID                | The vault RoleID.                                           |
| vault.secretId              | VAULT_SECRETID              | The vault secretID that you generated.                      |
| config.server.username      | CONFIG_SERVER_USERNAME      | The configuration server BASIC authentication username.     |
| config.server.password      | CONFIG_SERVER_PASSWORD      | The configuration server BASIC authentication password.     |
| N/A                         | ENCRYPT_KEY                 | The key used for value encryption/decryption                |


### Your Service
Now that you have your Cloud Config server serving out your property values from your service's configuration repository, it's time to get your service set up to use it all.

#### boostrap.yml
The `boostrap.yml` file found in your service's `/src/main/resources` directory is used by Spring Cloud Config client to get information it needs early in the Spring initialization.  Here's a quote from a stackoverflow answer that should help you understand it:

> **`bootstrap.yml` is loaded before `application.yml`.**
  It is typically used for the following:
    * when using Spring Cloud Config Server, you should specify `spring.application.name` and `spring.cloud.config.server.git.uri` inside `bootstrap.yml`
    * some `encryption/decryption` information
  Technically, `bootstrap.yml` is loaded by a parent Spring `ApplicationContext`. That parent `ApplicationContext` is loaded before the one that uses `application.yml`.
  
And from the Cloud Config docs:
> A Spring Cloud application operates by creating a "bootstrap" context, which is a parent context for the main application. It is responsible for loading configuration properties from the external sources and for decrypting properties in the local external configuration files. The two contexts share an `Environment`, which is the source of external properties for any Spring application. By default, bootstrap properties are added with high precedence, so they cannot be overridden by local configuration.
  
With that said, we can set up a minimal boostrap.yml file that gets the values needed by Spring Cloud Config client.

```yaml
spring:
  cloud:
    config:
      enabled: false
      failFast: true
```

That's really all you need.  The `enabled: false` is just in case you'd start your application with `gradlew bootrun` and not provide the values needed for connecting to a cloud or other configuration server.  The `failFast: true` entry is to make sure that your service abends if the Spring Cloud Config Client can't find a configuration source based on your settings.  You may or may not want this behaviour, so it's up to you if you want to set that to `false`.

The values needed to connect to the target configuration server will normally come from your service's deployment manifest file or from command line entries, so there is no need to duplicate those entries in the cloud config bootstrap file.

Keep in mind that the bootstrap config file is used not just by Spring Cloud Config, but by other Spring processes as well, so you may have to add Eureka, Turbine, or other entries as required. 

#### Properties
First, in your `application.properties` file:

```properties
spring.application.name=xsp-reference-service
```

This it the application name which will be sent to the Spring Cloud Configuration instance, causing it to look for a configuration repository of that name.

#### Manifest
There are a few values required in your service's deployment manifest in order to point it at the configuration server.  Here's an example of the setup for a development environment:

```yaml
services:
  - [team_name]-rabbitmq
env:
  SPRING_CLOUD_CONFIG_URI: "https://xsp-config-server.u1.app.cloud.comcast.net"
  SPRING_CLOUD_CONFIG_USERNAME: configServerUsername
  SPRING_CLOUD_CONFIG_PASSWORD: configServerPassword
  SPRING_CLOUD_CONFIG_LABEL: develop
  SPRING_PROFILES_ACTIVE: dev
```

| Name                         | Manifest Name                | Description                                                                                                                    |
|:-----------------------------|:-----------------------------|:-------------------------------------------------------------------------------------------------------------------------------|
| spring.cloud.config.uri      | SPRING_CLOUD_CONFIG_URI      | The URI of the Spring Cloud Config server your application will query for values.                                              |
| spring.cloud.config.username | SPRING_CLOUD_CONFIG_USERNAME | The authentication username for the Spring Cloud Config server.                                                                |
| spring.cloud.config.password | SPRING_CLOUD_CONFIG_PASSWORD | The authentication password for the Spring Cloud Config server.                                                                |
| spring.cloud.config.label    | SPRING_CLOUD_CONFIG_LABEL    | The configuration label. This equates to the github repository branch from which the server will retrieve values.              |
| spring.profiles.active       | SPRING_PROFILES_ACTIVE       | The active profile. This equates to the environment you are trying to retrieve values for. For example: `dev`,`qa`, or `prd-r2` |

As for `[team_name]-rabbitmq`, you need to add the cloud foundry tile for a RabbitMQ instance created for your team in order for property refreshes to work.  RabbitMQ is how you send property refresh events to your service instances in order to get them to reload their properties from the config server.

That's it.  When your service makes a request for properties, you should see entries in the json that look like this:

```json
{
  "name": "email-service",
  "profiles": [
    "dev"
  ],
  "label": "develop",
  "version": null,
  "state": null,
  "propertySources": [
    {
      "name": "https://github.comcast.com/xsp-core-config/email-service/email-service-dev.properties",
      "source": {
        "spring.cloud.config.name": "email-service",
        "service.name": "email-service",
        "spring.application.name": "email-service",
        "spring.cloud.config.enabled": "true",
        "health.config.enabled": "false",
        "xsp.audit.frontend.exchange.logging.enabled": "false",
        "xsp.audit.frontend.concise.logging.enabled": "true",
        "logging.level.com.comcast.xsp.logging.interceptor.BackendLoggingInterceptor": "DEBUG",
        "logging.level.org.springframework.ws.client.MessageTracing.sent": "TRACE",
        "logging.level.org.springframework.ws.client.MessageTracing.received": "TRACE",
        "logging.level.com.comcast.xsp.common.logging.concise.logger": "INFO",
        "obfuscated.fields": "customerId,id,status",
        "logging.level.com.comcast.email": "ERROR"
      }
    },
    {
      "name": "https://github.comcast.com/xsp-core-config/email-service/email-service-dev.yml",
      "source": {
        "oauth.server.url": "https://websec-dev.cable.comcast.com/as/token.oauth2",
        "authServer.publicKey": "-----BEGIN PUBLIC KEY-----***-----END PUBLIC KEY-----",
        "xsp.security.authServer.configs[0].endpointPatterns": "**-services",
        "xsp.security.authServer.configs[0].username": "***",
        "xsp.security.authServer.configs[0].secret": "***",
        "xsp.security.authServer.configs[0].scopes": "****"
      }
    },
    {
      "name": "https://github.comcast.com/xsp-core-config/xsp-shared/application-dev.yml",
      "source": {
        "authServer.publicKey": "-----BEGIN PUBLIC KEY-----**B-----END PUBLIC KEY-----",
        "location": "secret!",
        "oauth.server.url": "****"
      }
    },
    {
      "name": "vault:email-service/dev",
      "source": {
        "datasource.adm.password": "****"
      }
    }
  ]
}
```

## Server Usage
There are a few things to keep in mind when using the server.

### Property Encryption
You can encrypt values in your git configuration repository which the server will automatically decrypt when sending them to your service. To do this, there are special endpoints on the server.  For encryption, here's an example:

**Headers:**
```

Authorization: Basic 243encoded3243fa342ffusergv34passf2g2=
Accept: text/plain
Content-Type: text/plain
```

**Request**
```
https://xsp-config-server.u1.app.cloud.comcast.net/encrypt
https://xsp-config-server.u1.app.cloud.comcast.net/decrypt
```

For the body of the request, send the value you want to encrypt.  Once you have the encrypted value, add it to your property like this with the `{cipher}` prefix:

```
datasource.rdm.password={cipher}06e4a2d7087435bb5403cba0ef03d915cf0865d477e86b65f835fb837517ace7
```

You don't have to do anything to decrypt the properties yourself for your application.  The configuration server will do that itself.  You can use the `/decrypt` endpoint to get the plaintext of encrypted values when needed. 

## Property Refreshing
Because your XSP Cloud Framework services will implement the Spring Cloud Config Client, you will be able to issue "property refresh events" to your service instances which will cause them to reload their properties from their associated cloud config server.

### Application Deployment Manifest Setup For Properties Refresh
Due to the fact that there is an issue with spring cloud config client is not able to read the application name from the application.properties of the app. You need to provide the spring.cloud.config.name as environment variable in application deployment manifest file. 
The env variable looks like as below
```
SPRING_CLOUD_CONFIG_NAME: "APPLICATION NAME"
```
Example:
```
SPRING_CLOUD_CONFIG_NAME: "xsp-reference-service"
```

### Bus Properties Refresh
Spring Cloud Bus exposes an endpoint on the application, such as `/busrefresh?destination=[destination]`, which can be used to update properties. The destination query param is optional, but will restrict the properties that are refreshed to the application with that name. The application name will be automatically configured (if not set) to the application name you see in Cloud Foundry. The format is 
```
service/busrefresh?destination=SERVICENAME:profiles,instances
```
The service, when called, will always return it's instance as part of a response header: X-Application-Context: ars-generic#0.1.0.87-d6216c:esp-dev,cloud:0

The refresh supports wild cards, using * and **. To refresh the properties of all instances of your service within a particular environment, you'd access that endpoint on any instance of your service within that environment, e.g:
```
POST http://ars-prd.po-r1.app.cloud.comcast.net/busrefresh?destination=ars-generic*:**
content-type: application/x-www-form-urlencoded
```
More information on using property refreshing can be found in the [spring cloud bus docu](https://docs.spring.io/spring-cloud-bus/docs/current/reference/html/#bus-refresh-endpoint).

## Testing

### Config Server
There are two ways to start the config server locally for testing.

__Example 1__    

Create a `config` directory in the root of the checked out config server project and then create a file in there for each environment you want to test with.  

In this case, we create a file named `dev.properties`:  
```properties
app.repo.github.uri=https://github.comcast.com/team-config-org/{application}
app.repo.github.username=*********
app.repo.github.password=*********
shared.repo.github.uri=https://github.comcast.com/team-config-org/shared-repo
shared.repo.github.username=*********
shared.repo.github.password=*********
vault.host=*********
vault.port=*********
vault.org=*********
vault.roleId=*********
vault.secretId=*********
config.server.username=*********
config.server.password=*********
encrypt.key=*********
```
__*Note__ Just remember that for the github `password` fields, you'll be using an access token for the appropriate service user, not the plaintext password.

With this file ready, we can start the config server as if it were running in the development environment.

```
java -Dspring.config.additional-location=config/dev.properties -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5006 -jar build\libs\xsp-config-server-1.5.1.jar > console.log 2>&1
```

__Example 2__ 

The other way of starting the server locally is to put everything into the start command.  Here's a template for you:

```
java -Dapp.repo.github.uri=[appUri] -Dapp.repo.github.username=[appUser] -Dapp.repo.github.password=[appPass] -Dshared.repo.github.uri=[sharedUri] -Dshared.repo.github.username=[sharedUser] -Dshared.repo.github.password=[sharedPass] -Dvault.host=[vaultHost] -Dvault.port=[vaultPort] -Dvault.org=[secret/vaultOrg] -Dvault.secretId=[vaultSecretID] -Dvault.roleId=[vaultRoleID] -Dconfig.server.username=[serverUser] -Dconfig.server.password=[serverPass] -Dencrypt.key=[encryptKey] -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5006 -jar build\libs\xsp-config-server-1.5.1.jar > console.log 2>&1
``` 
Feel free to change the values, debug settings, and the jar version number as needed.

If started locally, the default port is `8888`.  You will need an authorization header. For more information on the authorization header, [see below](#a-note-about-security).

**Header:**
```
Authorization: Basic 243endcoded3243fa342ffusergv34passf2g2=
```

**Request 01:**
This will give you the properties as selected by the server based on application, profile, and label.  This would include properties from all sources indicated by the criteria.
```
http://localhost:8888/serviceStarTrek/dev/develop
```

**Request 10:**
This will give you the contents of a specific properties/yaml file given values for application, profile, and label. In this case, given our example setup, you will get the contents of the `application-dev.properties` default file located in the `xsp-shared` repository. 
Note: This will only work if the service user assigned to the shared repository is also assigned to the service configuration repository as well. The problem being that the application repository config has different credentials than the shared config.
```
http://localhost:8888/develop/xsp-shared-dev.properties
```

**Request 11:**
This will give you the contents of a specific properties/yaml file given values for application, profile, and label. Here we get the contents of the actual `xsp-reference-service-dev.properties` file from the `xsp-reference-service` repository, along with the `application-dev.properties` default file located in the `xsp-shared` repository. The reason we get the default properties as well is due to the Spring Cloud Config Server composite configuration from our standard setup. 
```
http://localhost:8888/develop/xsp-reference-service-dev.properties
```

### Client Service
Testing your service is a little bit easier. You can add what bootstrap values you need to a properties or yaml file and use that file to start your service with the config client enabled.

In your project (config/dev.properties):
```
spring.cloud.config.enabled=true
spring.cloud.config.uri=https://xsp-config-server.u1.app.cloud.comcast.net
spring.cloud.config.label=develop
spring.profiles.active=dev
spring.cloud.config.username=serverUser
spring.cloud.config.password=serverPass
```

And the command to start your service:
```
java -Dspring.config.location=config/dev.properties -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5006 -jar build\libs\xsp-reference-service-1.1.0.jar > console.log 2>&1
```
**Note:** Do NOT check-in that "config" directory to your service repository. Personally, I add it to the git ignore file to be sure.


## Alternative Configurations
This server codebase is designed for one specific scenario: 
1. You have a github organization dedicated to configuration repositories
2. Each service has it's own repository, named the same as the service, in that org.
3. Property values that are shared amongst the services in that organization reside in the configured "shared" repository which also resides in that configuration organization.

Now, if you want, the hardcoded part of the configuration does give you some leeway in how you use it.  

### Multiple Service Configurations, One Repo
In this scenario:
1. All Services have configuration directories in a single repository
2. Sensitive or secret values are kept in a separate "shared" repository.

You may recognize this as very close to the old way we had properties set up.  It does give you a bit of flexiblity in that you can load multiple property sets from the single application configuration repository.

#### Github
In a single application configuration repository, you set up folders for each application:

```
Org: xsp-config-org
    repo: xsp-properties (private)
    repo: xsp-shared (private)
```

Inside the xsp-properties repository:
```
startrekService/
    startrekService-dev.properties
    startrekService-int.properties
    ...
starwarsService/
    starwarsService-dev.properties
    starwarsService-int.properties
    ...
global-settings/
    global-settings-dev.yml
    global-settings-int.yml
    ...
```

The xsp-shared repository setup is unchanged.


#### Configuration Server
Instead of using the `{application}` placeholder, we specify a single repository for the application configuration repository:

```
  env:
    APP_REPO_GITHUB_URI: "https://github.comcast.com/xsp-config-org/xsp-properties"
    APP_REPO_GITHUB_USERNAME: "username"
    APP_REPO_GITHUB_PASSWORD: "password"
    SHARED_REPO_GITHUB_URI: "https://github.comcast.com/xsp-config-org/xsp-shared"
    SHARED_REPO_GITHUB_USERNAME: "username"
    SHARED_REPO_GITHUB_PASSWORD: "password"
    VAULT_HOST: "vaultHost"
    VAULT_PORT: "vaultPort"
    VAULT_ORG: "secret/vaultOrg"
    VAULT_ROLEID: "vaultRoleId"
    VAULT_SECRETID: "vaultSecretId"
    CONFIG_SERVER_USERNAME: "username"
    CONFIG_SERVER_PASSWORD: "password"
    ENCRYPT_KEY: "encryptKey"
```

#### Your Service
The only change here is that you can now use the `spring.cloud.config.name`.  Instead of loading just one set of properties from the application configuration repository (xsp-properties), you can now load one-to-many.  Given we are in the "starwarsService" (obviously the better service!):

application.properties
```
spring.cloud.config.name=starwarsService,global-settings
```

What happens is this:
1. The cloud config client makes a request to the config server:    
   https://xsp-config-server.u1.app.cloud.comcast.net/starwarsService,global-settings/esp-dev/develop    
   Notice that the `{application}` part of the path is the comma-separated list from the `spring.cloud.config.name` property.
2. The cloud config server grabs the property values from `starwarsService-dev.properties` *AND* `global-settings-dev.yml` in the application configuration repository "xsp-properties".
3. The cloud config server then goes to the "xsp-shared" repository and does not find any folders/files that match the patterns, but still loads the values from `application-dev.properties` per the Spring Cloud Config contract.

And there you go.  Before you use this type of configuration, though, think long and hard about how many services could wind up in that shared application configuration repository, and how many developers will need write access to it, giving them the ability to fat finger property values for services not their own.  If you can, try and stick with the original setup.

## A Note About Health
The configuration server health check is only really useful for local repositories, which we don't use.  That means there is no way to do real health checks for remote repositories at this time.  From the source code, even if you had a normal non-composite or compound repository configuration, the health check only parrots the current configuration back, and does nothing to detect if a remote repository is alive. One would think that after [MANY YEARS](https://github.com/spring-cloud/spring-cloud-config/issues/446), the Spring devs would have fixed this sub-optimal**®©** behaviour. 

For now, your only option is to leave in place the default setting of the health check being disabled.  If you want to get "clever" and roll your own health check, then you can re-enabled the health check in your deployment manifests or in your startup command. 

The property for controlling the health check is this:
```
spring.cloud.config.server.health.enabled=false
```

For more information, take a look at the Spring Cloud Config [health check configuration documentation](https://cloud.spring.io/spring-cloud-static/spring-cloud.html#_health_indicator).

## A Note About Security

### Config Server Setup
The `info` and `health` actuator endpoints have been explicitly allowed full access.  All other endpoints, actuator or otherwise, are behind Spring Security BASIC authentication.  

When you want to make a request to the server either locally or in a cloud deployment, you will need to add an `Authentication: Basic` header to your request. Take your server username and password and base64-encode them in this format: 
```
username:password
```

The header for your requests will look like this:
```
Authorization: Basic 243encoded3243fa342ffusergv34passf2g2=
```
### Config Server Access

For a secure setup with the standard config server setup, you will need a few service accounts.

1. A service account for general read access to each service configuration repository.
2. A service account for restricted read access to the shared configuration repository.

Granted, you can probably use the same account for both, but if you want the most secure setup, have one account for each, and make sure those accounts are only given read access.

### Actuator Security
The `/health`, `/info`, and `/initialized` endpoints are not secured by default and are publicly accessible.

## Contributing
If you want to contribute, there are a few rules for code formatting, documentation, versioning, ... okay, there are a lot more than a few rules. That said, the rules exist for reasons, and not all those reasons involve aggravating you. Be kind, follow the rules, reap the rewards.    
**<sup>[Manual Of The Rules](https://wiki.sys.comcast.net/display/XSP/Project+Development+Rules)</sup>**

## [ChangeLog](doc/changelog/ChangeLog.md)
