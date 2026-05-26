export interface ManifestoParagraph {
	type: "body" | "emphasis" | "questions" | "radical-title";
	text: string;
}

export const MANIFESTO_PARAGRAPHS: ManifestoParagraph[] = [
	{
		type: "radical-title",
		text: "What is The Diaspora Project?",
	},
	{
		type: "body",
		text: "We want to be part of a movement that reclaims social spaces from systems that extract, isolate, and commodify human expression. For us artistic expression is far from neutral, it's a form of resistence. We use our spaces to hold solidarity with oppressed communities and give a voice to marginalized communities. We are committed to building a digital and ambulant space.",
	},
	{
		type: "emphasis",
		text: "Diaspora is a digital and itinerant space dedicated to incentivize the creation of community and mutual care through art and its various expressions.",
	},
	{
		type: "body",
		text: "As creative work becomes shaped by market demands, art risks losing the freedom and meaning that give it power. Our mission is to redistribute influence within our community and empower those who have been systemically marginalized. We want to use our space as an instrument for the voices in our communities and we believe in art as a powerful tool for social change.",
	},
	{
		type: "emphasis",
		text: "Respect is an active choice. Unification, healing, and empowerment.",
	},
	{
		type: "radical-title",
		text: "How to represent Diaspora?",
	},
	{
		type: "body",
		text: "We believe art and artist are inseparable. The art you support exists within a broader context, one that is often abstracted or erased. Neutrality and complicity allow harmful cycles to continue. In our effort to create change, we acknowledge our duty not only to be transparent and speak out, but to actively participate in the change we want to see. Who makes the art we consume and how do we feel about the art we consume?",
	},
	{
		type: "questions",
		text: "???????",
	},
	{
		type: "radical-title",
		text: "we deconstruct and reshape",
	},
	{
		type: "body",
		text: "Take an effort to reject your biases, put yourself in the context of another. It's often times those closest to us that we forget to make an effort for. The star symbol holds distinct meanings across deep contexts—it is the emblem of the state of Texas, a symbol used by liberatory movements worldwide, and a universal signifier of hope and power.",
	},
	{
		type: "emphasis",
		text: "our social conviction is radical. We claim emancipation.",
	},
	{
		type: "emphasis",
		text: "Support local art",
	},
];
