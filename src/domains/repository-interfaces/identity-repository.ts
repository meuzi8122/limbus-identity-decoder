import type { Identity } from "../../domains/entities/identity";

export interface IdentityRepository {
	getAll: () => Promise<Identity[]>;
}
