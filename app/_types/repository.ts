import { Repository } from "@/app/_types/generated";

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
