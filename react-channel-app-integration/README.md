# react-channel-app-integration

This project contains reference implementation to use "Javascript Universal Method of Payment" - [JUMP Javascript Library] (https://github.comcast.com/common-payment/jump) by React based channel application. JUMP is a reusable front-end library to handle method of payment data entry wrapping PCI data handling to isolate and shield front end channel apps from PCI data. The library will load a hosted page in the site for collecting/encrypting PCI sensitive data, provide common form fields (name and address), and provide functions to call a back-end micro-service. Additionally, this library will load third party device fingerprinting capabilities. Comcast front end channel application has capability to toggle between templates to accept different types of methods of payment (such as Credit Card, ACH), CSS, iFrame height/width/border and CPC environment. 

## Prerequisites

1. A basic understanding of [Git and GitHub](https://etwiki.sys.comcast.net/display/XIA/SD+Git+and+GitHub)
2. [Node@16](https://nodejs.org/en/blog/release/v16.13.0/) or above installed on your machine.
3. Use of the command line to execute commands ([cmder](http://cmder.net/) for Windows, [Terminal](https://support.apple.com/guide/terminal/welcome/mac) for macOS)
4. Please follow the URL to setup SSH key [Setup SSH](https://help.github.com/en/enterprise/2.15/user/articles/connecting-to-github-with-ssh)

## Getting started

To download the code repository for the first time:

```
git clone git@github.comcast.com:common-payment/react-channel-app-integration.git
cd react-channel-app-integration/
npm install
```

To run the development environment:

```
npm start
```

To run the production build:

```
npm run build
```

Manually copy Jump package folder (installed by `npm i`) from node_modules/ to public/ folder as channel application would need that at run time.

| File  | Purpose |
| ------------- | ------------- |
| [.gitignore](.gitignore) | Files and directories to ignore by Git  |
| [package.json](package.json) | Contains list of NPM dependencies  |
| [package-lock.json](package-lock.json) | Keeps track of NPM dependency tree  | 
| [.env.production](.env.production) | Contains application environment variables to load Common Payment Component - JUMP library for production |
| [.env.development](.env.development) | Contains application environment variables to load Common Payment Component - JUMP library for development |
| [payment-detail.js](src/component/payment-detail.js) | Contains reference implementation on how to load JUMP library on Page load |
