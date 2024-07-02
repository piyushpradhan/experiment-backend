import { sequelize } from "../../src/data/sequelize";

describe("Database connection", () => {
  it("should connect to the database successfully", async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });

  it("should close the database connection successfully", async () => {
    await expect(sequelize.close()).resolves.not.toThrow();
  });
});
