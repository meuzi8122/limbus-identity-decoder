import { createClient } from "microcms-js-sdk";

export const dbClient = createClient({
	serviceDomain: process.env.SERVICE_DOMAIN as string,
	apiKey: process.env.API_KEY as string,
});

export type DbClient = ReturnType<typeof createClient>;
