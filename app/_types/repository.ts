export interface Repository {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	stargazerCount: number;
	primaryLanguage: {
		name: string;
	};
	owner: {
		login: string;
	};
}
