export type Repository = {
    nodes: any;
    pageInfo: any;
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	stargazerCount: number;
	forkCount: number;
	issues: {
		totalCount?: number;
	};
	primaryLanguage: {
		name: string;
	} | null;
	owner: {
		login: string;
		avatarUrl: string;
		name?: string;
		followers?: {
			totalCount: number;
		};
	};
	privacy: string;
}

export type RepositoriesQueryResponse = {
	[owner: string]: {
		repositories: {
			nodes: Repository[];
			pageInfo: {
				hasNextPage: boolean;
				endCursor: string | null;
			};
		};
	};
}
