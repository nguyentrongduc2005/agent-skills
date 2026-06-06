import { beforeEach, afterAll, expect } from "vitest";
import { prisma } from "../../src/config/prisma.js";

const isIntegration =
  typeof expect !== "undefined" &&
  expect.getState().testPath?.includes("/integration/");

if (isIntegration) {
  if (
    !process.env["DATABASE_URL"] ||
    !process.env["DATABASE_URL"].includes("jwt_auth_test")
  ) {
    throw new Error(
      "Safety check failed: integration tests must be run against the test database (jwt_auth_test).",
    );
  }

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
}
