export interface Identity {
	id: string;
	name: string;
	skills: [Skill, Skill, Skill];
}

interface Skill {
	name: string;
	sinType: string;
	type: string;
	coins: number;
}

export interface SkillHint {
	type: string | null;
	sinType: string | null;
	coins: number | null;
}

export function selectCorrectIdentity(identities: Identity[]): Identity {
	return identities[Math.floor(Math.random() * identities.length)];
}

function matchSkill(
	selectedSkill: Skill,
	correctSkill: Skill,
	currentHint: SkillHint,
): SkillHint {
	return {
		// 一度確定した属性（非null）はそのまま維持し、未確定なら今回の一致を反映する
		type:
			currentHint.type ??
			(selectedSkill.type === correctSkill.type ? correctSkill.type : null),
		sinType:
			currentHint.sinType ??
			(selectedSkill.sinType === correctSkill.sinType
				? correctSkill.sinType
				: null),
		coins:
			currentHint.coins ??
			(selectedSkill.coins === correctSkill.coins ? correctSkill.coins : null),
	};
}

export function checkSkills(params: {
	selectedIdentity: Identity;
	correctIdentity: Identity;
	currentHints: [SkillHint, SkillHint, SkillHint];
}): [SkillHint, SkillHint, SkillHint] {
	const { selectedIdentity, correctIdentity, currentHints } = params;
	return [
		matchSkill(
			selectedIdentity.skills[0],
			correctIdentity.skills[0],
			currentHints[0],
		),
		matchSkill(
			selectedIdentity.skills[1],
			correctIdentity.skills[1],
			currentHints[1],
		),
		matchSkill(
			selectedIdentity.skills[2],
			correctIdentity.skills[2],
			currentHints[2],
		),
	];
}
