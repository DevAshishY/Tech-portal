module.exports = {
  apps: [
    {
      name: "milonbook",          // PM2 process name
      script: "server.js",        // backend entry file
      cwd: "/var/www/milonbook-web",  // deployment folder
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 4702,
      },
    },
  ],
};
