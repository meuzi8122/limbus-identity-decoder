import type { Identity } from "../../domains/entities/Identity";
import type { IdentityRepository } from "../../domains/repository-interfaces/identity-repository";

export async function getAllIdentities(deps: {
	identityRepository: IdentityRepository;
}): Promise<Identity[]> {
	return await deps.identityRepository.getAll();
}
