module.exports = {
    apps: [
      {
        name: 'server',
        script: 'server.js',
        interpreter: '/home/ubuntu/.nvm/versions/node/v18.20.7/bin/node', // Path to Node version from nvm
        env: {
          AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE: "1"
        },
      },
    ],
  };
  