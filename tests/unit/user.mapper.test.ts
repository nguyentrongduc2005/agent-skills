import { describe, it, expect } from "vitest";
import { toPublicUser } from "../../src/modules/users/user.mapper.js";

describe("user mapper", () => {
  it("should map database user to public user and completely omit passwordHash", () => {
    const dbUser = {
      id: "some-uuid",
      email: "test@example.com",
      name: "Test User",
      passwordHash: "$2b$12$somehashedpasswordhere",
      createdAt: new Date("2026-06-06T00:00:00.000Z"),
      updatedAt: new Date("2026-06-06T00:00:00.000Z"),
    };

    const publicUser = toPublicUser(dbUser);

    expect(publicUser).toEqual({
      id: "some-uuid",
      email: "test@example.com",
      name: "Test User",
      createdAt: new Date("2026-06-06T00:00:00.000Z"),
      updatedAt: new Date("2026-06-06T00:00:00.000Z"),
    });

    expect(publicUser).not.toHaveProperty("passwordHash");
  });
});
