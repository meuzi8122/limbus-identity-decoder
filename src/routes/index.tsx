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

function RouteComponent() {
	const { identities } = Route.useLoaderData();

	const [hints, setHints] =
		useState<[SkillHint, SkillHint, SkillHint]>(INITIAL_HINTS);

	const [keyword, setKeyword] = useState("");

	const filteredIdentities = useMemo(() => {
		const lowerCaseKeyword = keyword.toLowerCase();
		return identities.filter((identity) => {
			// 確定済みヒント（非null）と矛盾しない候補だけ残す（未確定の属性は制約にしない）
			const matchesHints = identity.skills.every((skill, index) => {
				const hint = hints[index];
				return (
					(hint.type === null || skill.type === hint.type) &&
					(hint.sinType === null || skill.sinType === hint.sinType) &&
					(hint.coins === null || skill.coins === hint.coins)
				);
			});
			const matchesKeyword = identity.name
				.toLowerCase()
				.includes(lowerCaseKeyword);
			return matchesHints && matchesKeyword;
		});
	}, [identities, hints, keyword]);

	const [correctIdentity, _] = useState<Identity | null>(
		selectCorrectIdentity(identities),
	);

	const [selectedIdentityId, setSelectedIdentityId] = useState<string | null>(
		null,
	);
	const selectedIdentity = useMemo(
		() => identities.find((identity) => identity.id === selectedIdentityId),
		[identities, selectedIdentityId],
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
			<input
				type="text"
				placeholder="スキル名を入力"
				value={keyword}
				onChange={(e) => setKeyword(e.target.value)}
			/>
			<div className="flex flex-wrap gap-2">
				{filteredIdentities.map((identity) => (
					<div key={identity.id}>
						<input
							type="radio"
							name="identity"
							value={identity.id}
							onChange={() => setSelectedIdentityId(identity.id)}
						/>
						<label htmlFor={identity.id}>{identity.name}</label>
					</div>
				))}
			</div>
			<button
				type="button"
				onClick={handleSubmit}
				disabled={!selectedIdentityId}
			>
				回答
			</button>
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
