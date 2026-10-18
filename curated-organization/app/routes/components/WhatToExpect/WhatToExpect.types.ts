export type WhatToExpectStep = {
	number: string;
	title: string;
	description?: string;
};

export type WhatToExpectProps = {
	eyebrow?: string;
	heading: string;
	steps: WhatToExpectStep[];
};
