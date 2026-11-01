import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
	checkSkills,
	type Identity,
	type SkillHint,
	selectCorrectIdentity,
} from "#/domains/entities/identity";
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

// キャラ名以外の条件（未回答 かつ 確定済みヒントと矛盾しない）で候補になり得るか判定する
function isCandidate(
	identity: Identity,
	hints: [SkillHint, SkillHint, SkillHint],
	guessedIds: string[],
): boolean {
	return (
		!guessedIds.includes(identity.id) &&
		identity.skills.every((skill, index) => {
			const hint = hints[index];
			return (
				(hint.type === null || skill.type === hint.type) &&
				(hint.sinType === null || skill.sinType === hint.sinType) &&
				(hint.coins === null || skill.coins === hint.coins)
			);
		})
	);
}

function RouteComponent() {
	const { identities } = Route.useLoaderData();

	const [hints, setHints] =
		useState<[SkillHint, SkillHint, SkillHint]>(INITIAL_HINTS);

	// 既に解答した人格を除外
	const [guessedIds, setGuessedIds] = useState<string[]>([]);

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

	// 現在のヒント・回答履歴のもとで、まだ候補が残っている囚人だけを選べるようにする
	const availableCharacters = useMemo(() => {
		return CHARACTERS.filter((character) =>
			identities.some(
				(identity) =>
					identity.name.endsWith(character) &&
					isCandidate(identity, hints, guessedIds),
			),
		);
	}, [identities, hints, guessedIds]);

	// 選択中キャラが候補ゼロになって選択肢から消えた場合は、選択可能な先頭の囚人にフォールバックする
	const currentCharacter = availableCharacters.includes(
		selectedParams.character,
	)
		? selectedParams.character
		: (availableCharacters[0] ?? "");

	const filteredIdentities = useMemo(() => {
		return identities.filter(
			(identity) =>
				identity.name.endsWith(currentCharacter) &&
				isCandidate(identity, hints, guessedIds),
		);
	}, [identities, hints, guessedIds, currentCharacter]);

	const [correctIdentity, setCorrectIdentity] = useState<Identity | null>(
		selectCorrectIdentity(identities),
	);

	const [count, setCount] = useState(3);
	const [isCleared, setIsCleared] = useState(false);

	const isGameOver = isCleared || count === 0;
	const isAnswerHidden = !isGameOver;

	const reset = () => {
		setCorrectIdentity(selectCorrectIdentity(identities));
		setHints(INITIAL_HINTS);
		setGuessedIds([]);
		setSelectedParams({ character: CHARACTERS[0], identityId: null });
		setCount(3);
		setIsCleared(false);
	};

	const handleSubmit = () => {
		if (!correctIdentity || !selectedIdentity) return;

		setHints(
			checkSkills({
				selectedIdentity,
				correctIdentity,
				currentHints: hints,
			}),
		);
		setGuessedIds((prev) => [...prev, selectedIdentity.id]);

		if (selectedIdentity.id === correctIdentity.id) {
			setIsCleared(true);
			alert("正解です！");
			return;
		}

		setSelectedParams((prev) => ({ ...prev, identityId: null }));

		const nextCount = count - 1;
		setCount(nextCount);
		if (nextCount === 0) {
			alert(`正解は ${correctIdentity.name} です`);
		}
	};

	return (
		<div className="container mx-auto flex flex-col space-y-3 items-center p-5">
			<p className="text-lg font-bold">{`${isGameOver ? `正解: ${correctIdentity?.name}` : `残り解答回数: ${count}`}`}</p>
			{isGameOver ? (
				<button type="button" className="btn btn-primary" onClick={reset}>
					もう一度プレイ
				</button>
			) : (
				<div className="flex flex-col sm:flex-row gap-2 sm:justify-center sm:items-end w-full max-w-lg lg:max-w-4xl xl:max-w-6xl">
					<fieldset className="fieldset w-full sm:w-auto">
						<legend className="fieldset-legend">囚人</legend>
						<select
							className="select w-full sm:w-48"
							value={currentCharacter}
							onChange={(e) =>
								setSelectedParams({
									character: e.target.value,
									identityId: null,
								})
							}
						>
							{availableCharacters.map((character) => (
								<option key={character} value={character}>
									{character}
								</option>
							))}
						</select>
					</fieldset>
					<fieldset className="fieldset w-full sm:flex-1">
						<legend className="fieldset-legend">人格</legend>
						<select
							className="select w-full"
							value={selectedParams.identityId || ""}
							defaultValue={filteredIdentities[0]?.id || ""}
							onChange={(e) =>
								setSelectedParams({
									...selectedParams,
									identityId: e.target.value,
								})
							}
						>
							<option value="" disabled>
								選択されていません
							</option>
							{filteredIdentities.map((identity) => (
								<option key={identity.id} value={identity.id}>
									{identity.name.replace(currentCharacter, "")}
								</option>
							))}
						</select>
					</fieldset>
					<fieldset className="fieldset w-full sm:w-auto">
						{/* select 側の legend と高さを揃えるためのダミーラベル（モバイルでは非表示） */}
						<legend className="fieldset-legend invisible hidden sm:block">
							解答する
						</legend>
						<button
							type="button"
							className="btn btn-primary w-full"
							onClick={handleSubmit}
							disabled={
								isGameOver || !selectedParams.identityId || !correctIdentity
							}
						>
							解答する
						</button>
					</fieldset>
				</div>
			)}
			{correctIdentity && (
				<div className="overflow-x-auto w-full max-w-lg lg:max-w-4xl xl:max-w-6xl">
					<table className="table table-fixed w-full">
						<thead>
							<tr>
								<th scope="col" className="w-2/5">
									スキル名
								</th>
								<th scope="col" className="w-1/5">
									罪悪属性
								</th>
								<th scope="col" className="w-1/5">
									物理属性
								</th>
								<th scope="col" className="w-1/5">
									コイン枚数
								</th>
							</tr>
						</thead>
						<tbody>
							{hints.map((hint, index) => (
								// keyにindexを指定するのは避けたいが、hintにidを割り振るのは微妙（ビジネスロジック的にhintにidという概念は存在しないため）
								// key用の定数を用意しておき、indexでそれらの値を指定する
								<tr key={SKILL_SLOTS[index]}>
									<th scope="row">
										{`スキル${index + 1}${isAnswerHidden ? "" : `: ${correctIdentity.skills[index].name}`}`}
									</th>
									<td>
										{isAnswerHidden
											? (hint.sinType ?? "-")
											: correctIdentity.skills[index].sinType}
									</td>
									<td>
										{isAnswerHidden
											? (hint.type ?? "-")
											: correctIdentity.skills[index].type}
									</td>
									<td>
										{isAnswerHidden
											? (hint.coins ?? "-")
											: correctIdentity.skills[index].coins}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			<div className="mt-5 w-full max-w-lg lg:max-w-4xl xl:max-w-6xl text-left">
				<p>{guessedIds.length === 0 ? `解答履歴がありません` : `解答履歴`}</p>
				<ul className="list-disc list-inside gap-1 mt-1">
					{guessedIds.map((id) => {
						const guessedIdentity = identities.find(
							(identity) => identity.id === id,
						);
						return <li key={id}>{guessedIdentity?.name}</li>;
					})}
				</ul>
			</div>
		</div>
	);
}
