module.exports = {
  apps: [
    {
      name: 'crowdfunding-backend',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 5000,
      },
    },
  ],
};
