module.exports = {
  apps: [
    {
      name: 'profile-service',
      script: 'npm',
      args: 'run start:prod',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
