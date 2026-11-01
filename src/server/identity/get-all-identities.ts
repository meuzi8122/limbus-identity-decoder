import { createServerFn } from "@tanstack/react-start";
import { identityRepository } from "#/infrastructures/repositories/identity";
import { getAllIdentities } from "#/usecases/identity/get-all-identities";

/**
 * コンポーネントでidentityRepositoryを直接importすると、microcms clientで読んでいるprocess.envがクライアントバンドルに含まれてエラーになる
 * またserverFnを介さないとloaderの型推論も効かなくなる
 */
export const getIdentities = createServerFn({ method: "GET" }).handler(
	async () => {
		return await getAllIdentities({ identityRepository });
	},
);
