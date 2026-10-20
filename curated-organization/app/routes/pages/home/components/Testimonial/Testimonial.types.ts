export type TestimonialItem = {
	quote: string;
	clientName: string;
	clientLocation?: string;
};

export type TestimonialProps = {
	items: TestimonialItem[];
};
