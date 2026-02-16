module.exports = {
  apps: [
    {
      name: "setucl-backend",
      script: "dist/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://setu_user:s3tu1@localhost:5432/setu_codelab",
        JWT_SECRET: "setukey",
        JWT_REFRESH_SECRET: "seturefreshkey"
      }
    }
  ]
};

