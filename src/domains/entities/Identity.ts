export interface Identity {
	id: string;
	name: string;
	skill1: Skill;
	skill2: Skill;
	skill3: Skill;
}

interface Skill {
	name: string;
	sinType: string;
	type: string;
	coins: number;
}

export interface SkillMatch {
	type: boolean;
	sinType: boolean;
	coins: boolean;
}

export function checkSkills(
	answeredSkill: Skill,
	correctSkill: Skill,
): SkillMatch {
	return {
		type: answeredSkill.type === correctSkill.type,
		sinType: answeredSkill.sinType === correctSkill.sinType,
		coins: answeredSkill.coins === correctSkill.coins,
	};
}
