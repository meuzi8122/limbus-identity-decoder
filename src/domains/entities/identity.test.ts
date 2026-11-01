import { describe, expect, test } from "vitest";
import { checkSkills } from "./identity";

describe("checkSkills", () => {
	test("currentHintsが全てnullの場合、2つの人格のスキルで一致する箇所はその値を、一致しない箇所はnullを返す", () => {
		const hints = checkSkills({
			selectedIdentity: {
				id: "1",
				name: "Identity 1",
				skills: [
					{ name: "Skill A", sinType: "傲慢", type: "斬撃", coins: 1 },
					{ name: "Skill B", sinType: "暴食", type: "貫通", coins: 2 },
					{ name: "Skill C", sinType: "怠惰", type: "打撃", coins: 3 },
				],
			},
			correctIdentity: {
				id: "2",
				name: "Identity 2",
				skills: [
					{ name: "Skill D", sinType: "傲慢", type: "貫通", coins: 3 },
					{ name: "Skill E", sinType: "傲慢", type: "貫通", coins: 3 },
					{ name: "Skill F", sinType: "傲慢", type: "貫通", coins: 3 },
				],
			},
			currentHints: [
				{ type: null, sinType: null, coins: null },
				{ type: null, sinType: null, coins: null },
				{ type: null, sinType: null, coins: null },
			],
		});

		expect(hints).toEqual([
			{ sinType: "傲慢", type: null, coins: null },
			{ sinType: null, type: "貫通", coins: null },
			{ sinType: null, type: null, coins: 3 },
		]);
	});

	test("currentHintsにnullでない値がある場合、一致不一致に関係なくその値を返す", () => {
		const hints = checkSkills({
			selectedIdentity: {
				id: "1",
				name: "Identity 1",
				skills: [
					{ name: "Skill A", sinType: "傲慢", type: "斬撃", coins: 1 },
					{ name: "Skill B", sinType: "暴食", type: "貫通", coins: 2 },
					{ name: "Skill C", sinType: "怠惰", type: "打撃", coins: 3 },
				],
			},
			correctIdentity: {
				id: "2",
				name: "Identity 2",
				skills: [
					{ name: "Skill D", sinType: "傲慢", type: "貫通", coins: 3 },
					{ name: "Skill E", sinType: "傲慢", type: "貫通", coins: 3 },
					{ name: "Skill F", sinType: "傲慢", type: "貫通", coins: 3 },
				],
			},
			currentHints: [
				{ type: null, sinType: null, coins: 3 },
				{ type: null, sinType: null, coins: null },
				{ type: null, sinType: null, coins: null },
			],
		});

		expect(hints).toEqual([
			{ sinType: "傲慢", type: null, coins: 3 }, // コイン枚数3
			{ sinType: null, type: "貫通", coins: null },
			{ sinType: null, type: null, coins: 3 },
		]);
	});
});
