if (!process.env["DATABASE_URL"]) {
  process.env["DATABASE_URL"] =
    "postgresql://jwt_auth:jwt_auth_dev_password@localhost:5432/jwt_auth_test?schema=public";
}
if (!process.env["JWT_ACCESS_SECRET"]) {
  process.env["JWT_ACCESS_SECRET"] =
    "test-access-secret-which-must-be-long-enough-for-security";
}
if (!process.env["JWT_REFRESH_SECRET"]) {
  process.env["JWT_REFRESH_SECRET"] =
    "test-refresh-secret-which-must-be-long-enough-for-security";
}
if (!process.env["JWT_ACCESS_EXPIRES_IN"]) {
  process.env["JWT_ACCESS_EXPIRES_IN"] = "5m";
}
if (!process.env["JWT_REFRESH_EXPIRES_IN"]) {
  process.env["JWT_REFRESH_EXPIRES_IN"] = "1h";
}
if (!process.env["BCRYPT_SALT_ROUNDS"]) {
  process.env["BCRYPT_SALT_ROUNDS"] = "4";
}
