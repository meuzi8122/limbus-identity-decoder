import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
	checkSkills,
	type Identity,
	type SkillHint,
	selectCorrectIdentity,
} from "#/domains/entities/Identity";
import { getIdentities } from "#/server/identity/get-all-identities";

export const Route = createFileRoute("/")({
	component: RouteComponent,
	loader: async () => {
		return {
			identities: await getIdentities(),
		};
	},
});

const SKILL_SLOTS = ["skill1", "skill2", "skill3"] as const;
const INITIAL_HINTS: [SkillHint, SkillHint, SkillHint] = [
	{ type: null, sinType: null, coins: null },
	{ type: null, sinType: null, coins: null },
	{ type: null, sinType: null, coins: null },
];
const CHARACTERS = [
	"イサン",
	"ファウスト",
	"ドンキホーテ",
	"良秀",
	"ムルソー",
	"ホンル",
	"ヒースクリフ",
	"イシュメール",
	"ロージャ",
	"シンクレア",
	"ウーティス",
	"グレゴール",
];

function RouteComponent() {
	const { identities } = Route.useLoaderData();

	const [hints, setHints] =
		useState<[SkillHint, SkillHint, SkillHint]>(INITIAL_HINTS);

	const [selectedParams, setSelectedParams] = useState<{
		character: string;
		identityId: string | null;
	}>({
		character: CHARACTERS[0],
		identityId: null,
	});
	const selectedIdentity = useMemo(
		() =>
			identities.find((identity) => identity.id === selectedParams.identityId),
		[identities, selectedParams.identityId],
	);

	const filteredIdentities = useMemo(() => {
		return identities.filter((identity) => {
			// 確定済みヒント（非null）と矛盾しない候補だけ残す（未確定の属性は制約にしない）
			return (
				identity.name.endsWith(selectedParams.character) &&
				identity.skills.every((skill, index) => {
					const hint = hints[index];
					return (
						(hint.type === null || skill.type === hint.type) &&
						(hint.sinType === null || skill.sinType === hint.sinType) &&
						(hint.coins === null || skill.coins === hint.coins)
					);
				})
			);
		});
	}, [identities, hints, selectedParams.character]);

	const [correctIdentity, _] = useState<Identity | null>(
		selectCorrectIdentity(identities),
	);

	const handleSubmit = () => {
		if (!correctIdentity || !selectedIdentity) return;
		setHints(
			checkSkills({
				selectedIdentity,
				correctIdentity,
				currentHints: hints,
			}),
		);
	};

	return (
		<div>
			<div className="flex gap-2">
				<select
					value={selectedParams.character}
					onChange={(e) =>
						setSelectedParams({ character: e.target.value, identityId: null })
					}
				>
					{CHARACTERS.map((character, index) => (
						<option
							key={`character-${
								// biome-ignore lint/suspicious/noArrayIndexKey: 再計算が発生しないのでindexでok
								index
							}`}
							value={character}
						>
							{character}
						</option>
					))}
				</select>
				<select
					value={selectedParams.identityId || ""}
					defaultValue={filteredIdentities[0]?.id || ""}
					onChange={(e) =>
						setSelectedParams({ ...selectedParams, identityId: e.target.value })
					}
				>
					<option value="" disabled>
						選択されていません
					</option>
					{filteredIdentities.map((identity) => (
						<option key={identity.id} value={identity.id}>
							{identity.name.replace(selectedParams.character, "")}
						</option>
					))}
				</select>
				<button
					type="button"
					className="btn btn-primary"
					onClick={handleSubmit}
					disabled={!selectedParams.identityId || !correctIdentity}
				>
					回答
				</button>
			</div>
			<table>
				<thead>
					<tr>
						<th scope="col">スキル名</th>
						<th scope="col">罪悪属性</th>
						<th scope="col">物理属性</th>
						<th scope="col">コイン枚数</th>
					</tr>
				</thead>
				<tbody>
					{hints.map((hint, index) => (
						// keyにindexを指定するのは避けたいが、hintにidを割り振るのは微妙（ビジネスロジック的にhintにidという概念は存在しないため）
						// key用の定数を用意しておき、indexでそれらの値を指定する
						<tr key={SKILL_SLOTS[index]}>
							<th scope="row">スキル{index + 1}</th>
							<td>{hint.sinType ? "○" : "×"}</td>
							<td>{hint.type ? "○" : "×"}</td>
							<td>{hint.coins ? "○" : "×"}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
