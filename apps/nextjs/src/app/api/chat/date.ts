import { tool } from "ai";
import { z } from "zod";

export const DateTools = {
  "current-datetime": tool({
    description: "Get the current date and time in UTC and Paris timezone",
    parameters: z.object({}),
    // eslint-disable-next-line @typescript-eslint/require-await
    execute: async () => {
      const date = new Date();
      return {
        utc: date.toISOString(),
        local: date.toLocaleString("sv-SE").replace(" ", "T") + "+02:00",
      };
    },
  }),
  "to-local-datetime": tool({
    description:
      "Convert a batch of UTC datetime to a local datetime in Paris timezone",
    parameters: z.object({
      utc: z.array(z.string()).describe("The UTC datetime to convert"),
    }),
    // eslint-disable-next-line @typescript-eslint/require-await
    execute: async ({ utc }) => {
      return utc.map((u) => {
        const date = new Date(u);
        return {
          local: date.toLocaleString("sv-SE").replace(" ", "T") + "+02:00",
        };
      });
    },
  }),
  "to-utc-datetime": tool({
    description: "Convert a batch of local datetime to a UTC datetime",
    parameters: z.object({
      local: z
        .array(z.string().datetime({ offset: true }))
        .describe("The list of local datetime to convert"),
    }),
    // eslint-disable-next-line @typescript-eslint/require-await
    execute: async ({ local }) => {
      return local.map((l) => {
        const date = new Date(l);
        return {
          utc: date.toISOString(),
        };
      });
    },
  }),
};
