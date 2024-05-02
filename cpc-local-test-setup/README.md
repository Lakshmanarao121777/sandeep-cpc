# cpc-local-test-setup
Used to coordinate running all CPC projects locally for testing/validation purposes.

## Assumptions
All of your CPC projects are in the same directory that you will clone this project to.

For example:
```
workspace/
   global-web-resources/            
   hosted-method-of-payment/
   jump/                            
   cpc-local-test-setup/ 
```

Clone all the other projects above before setting up your environment with this project.

## How to use this project
This project creates a coordinating directory to serve up all the CPC projects via an http server from one place locally so that you can use a demo app to test/validate changes without depending on a particular environment or testing changes that require updates to multiple projects.

The jump local config assumes that locally the app is available on port 8081.

Use the setup once to create symlinks. Then you can serve up this entire directory via `http-server -p 8081`.