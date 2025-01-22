import { GraphQLClient, gql } from 'graphql-request';
import { type Repository, type RepositoriesQueryResponse } from '../_types/repository';

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
	throw new Error('GitHub token not found in environment variables');
}

const client = new GraphQLClient('https://api.github.com/graphql', {
	headers: {
		Authorization: `Bearer ${GITHUB_TOKEN}`,
	},
});

// query pro vsechny vlastniky najednou, zrychli to fetch
const createQuery = (owners: string[], first: number, cursor: string | null = null) => {
	const ownerQueries = owners.map((owner) => `
    ${owner}: repositoryOwner(login: "${owner}") {
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

export const getRepositoriesForMultipleUsers = async (
	owners: string[],
	first: number = 9,
	cursor: string | null = null
): Promise<Record<string, Repository[]>> => {
	try {
		const repositoriesByUser: Record<string, Repository[]> = {};
		let endCursor: string | null = cursor;

		// tady to spusti teda query pro vsechny owners najednou
		const query = createQuery(owners, first, endCursor);
		const data: RepositoriesQueryResponse = await client.request<RepositoriesQueryResponse>(query);

		// a tady je rozpadnem na jednotlive ownery
		owners.forEach((owner) => {
			const userRepos = data[owner]?.repositories;
			if (userRepos) {
				repositoriesByUser[owner] = userRepos.nodes;
			}
		});

		return repositoriesByUser;
	} catch (error) {
		console.error('Error fetching repositories:', { owners, error });
		return {};
	}
};
