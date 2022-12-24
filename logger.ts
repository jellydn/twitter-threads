import consola, { Consola } from "npm:consola";

// @ts-expect-error Missing create on define
export const logger: Consola = consola.create({
  // level: 4,
  reporters: [new consola.JSONReporter()],
});
