type PageMetaData =
	| { title: string }
	| { name: string; content: string }
	| { property: string; content: string }
	| { httpEquiv: string; content: string };

interface NAVIGATION {
	url: string;
	name: string;
}
