module.exports = {
  "secret":"this app's secret is froenn",
  "db": process.env.MONGO_URI || "CODE",
  "email": {
    username: "USERNAME",
    password: "PASSWORD",
    host: "HOST"
  }
};