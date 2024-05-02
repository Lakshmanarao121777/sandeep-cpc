# Hosted Method of Payment

This project contains Hosted page to be loaded by "Javascript Universal Method of Payment" - [JUMP Javascript Library](https://github.comcast.com/common-payment/jump) in order to isolate and shield front end channel apps from PCI data. This project contains different templates to accept types of methods of payment(such as Credit Card, ACH) by Comcast Front end channel application. 

## Prerequisites

1. A basic understanding of [Git and GitHub](https://etwiki.sys.comcast.net/display/XIA/SD+Git+and+GitHub)
2. [Node@16](https://nodejs.org/en/blog/release/v16.13.0/) or above installed on your machine.
3. Use of the command line to execute commands ([cmder](http://cmder.net/) for Windows, [Terminal](https://support.apple.com/guide/terminal/welcome/mac) for macOS)
4. Please follow the URL to setup SSH key [Setup SSH](https://help.github.com/en/enterprise/2.15/user/articles/connecting-to-github-with-ssh)

## Getting started

To download the code repository for the first time:

```
git clone git@github.comcast.com:common-payment/hosted-method-of-payment.git
cd hosted-method-of-payment/
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

| File  | Purpose |
| ------------- | ------------- |
| [.gitignore](.gitignore) | Files and directories to ignore by Git |
| [package.json](package.json) | Contains list of NPM dependencies  |
| [package-lock.json](package-lock.json) | Keeps track of NPM dependency tree  | 
| [webpack.config.js](webpack.config.js) | webpack configs allow you to configure and extend Webpack's basic functionality |
