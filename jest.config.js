export default {
  testEnvironment: "node",
  transform: {}, // disable babel transform since you’re using native ESM
  roots: ["<rootDir>/tests"]
};
