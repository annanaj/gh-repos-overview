import { GraphQLClient, gql } from 'graphql-request';
import { Repository } from '../_types/repository';

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
	throw new Error('GitHub token not found in environment variables');
}

const client = new GraphQLClient('https://api.github.com/graphql', {
	headers: {
		Authorization: `Bearer ${GITHUB_TOKEN}`,
	},
});

const createQuery = (owners: string[], first: number, cursor: string | null = null) => {
	const ownerQueries = owners.map((owner, index) => `
    user${index}: repositoryOwner(login: "${owner}") {
      repositories(first: ${first}, after: ${cursor ? `"${cursor}"` : null}) {
        nodes {
          id
          name
          description
          createdAt
          updatedAt
          stargazerCount
          forkCount
          issues {
            totalCount
          }
          primaryLanguage {
            name
          }
          owner {
            login
            avatarUrl
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `);

	return gql`
    query GetRepositories {
      ${ownerQueries.join('\n')}
    }
  `;
};

interface RepositoriesResponse {
	[key: string]: {
		repositories: {
			nodes: Repository[];
			pageInfo: {
				hasNextPage: boolean;
				endCursor: string;
			};
		};
	};
}

export const getRepositoriesForMultipleUsers = async (
	owners: string[],
	first: number = 9,
	cursor: string | null = null
): Promise<Record<string, Repository[]>> => {
	try {
		const fetchAllRepositories = async (owner: string): Promise<Repository[]> => {
			let allRepositories: Repository[] = [];
			let hasNextPage = true;
			let endCursor: string | null = cursor;

			while (hasNextPage) {
				const query = createQuery([owner], first, endCursor);
				const data: RepositoriesResponse = await client.request<RepositoriesResponse>(query);

				const userRepos = data[`user0`]?.repositories;
				if (userRepos) {
					allRepositories = allRepositories.concat(userRepos.nodes);
					hasNextPage = userRepos.pageInfo.hasNextPage;
					endCursor = userRepos.pageInfo.endCursor;
				} else {
					hasNextPage = false;
				}
			}

			return allRepositories;
		};

		const repositoriesByUser: Record<string, Repository[]> = {};
		for (const owner of owners) {
			repositoriesByUser[owner] = await fetchAllRepositories(owner);
		}

		return repositoriesByUser;
	} catch (error) {
		console.error('Error fetching repositories:', error);
		return {};
	}
};
