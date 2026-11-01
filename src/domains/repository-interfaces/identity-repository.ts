import type { Identity } from "../../domains/entities/Identity";

export interface IdentityRepository {
	getAll: () => Promise<Identity[]>;
}
