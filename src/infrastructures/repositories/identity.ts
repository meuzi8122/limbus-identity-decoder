import type { IdentityRepository } from "../../domains/repository-interfaces/identity-repository";
import { type DbClient, dbClient } from "../db/client";

type IdentityRawRecord = {
	id: string;
	name: string;
	skill_1_name: string;
	skill_1_sin_type: string;
	skill_1_type: string;
	skill_1_coins: number;
	skill_2_name: string;
	skill_2_sin_type: string;
	skill_2_type: string;
	skill_2_coins: number;
	skill_3_name: string;
	skill_3_sin_type: string;
	skill_3_type: string;
	skill_3_coins: number;
};

function createIdentityRepository(db: DbClient): IdentityRepository {
	return {
		getAll: async () => {
			const records = await db.getAllContents<IdentityRawRecord>({
				endpoint: "identities",
			});
			return records.map((record) => ({
				id: record.id,
				name: record.name,
				skill1: {
					name: record.skill_1_name,
					sinType: record.skill_1_sin_type,
					type: record.skill_1_type,
					coins: record.skill_1_coins,
				},
				skill2: {
					name: record.skill_2_name,
					sinType: record.skill_2_sin_type,
					type: record.skill_2_type,
					coins: record.skill_2_coins,
				},
				skill3: {
					name: record.skill_3_name,
					sinType: record.skill_3_sin_type,
					type: record.skill_3_type,
					coins: record.skill_3_coins,
				},
			}));
		},
	};
}

export const identityRepository = createIdentityRepository(dbClient);
