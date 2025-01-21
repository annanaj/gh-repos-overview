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

// Vytvoření dotazu pro více vlastníků najednou
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

// Typ odpovědi z GraphQL
interface RepositoriesResponse {
	[key: string]: {
		repositories: {
			nodes: Repository[];
			pageInfo: {
				hasNextPage: boolean;
				endCursor: string | null;
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
		const repositoriesByUser: Record<string, Repository[]> = {};
		let hasNextPage = true;
		let endCursor: string | null = cursor;

		// Spustíme jediný požadavek pro všechny vlastníky najednou
		const query = createQuery(owners, first, endCursor);
		const data: RepositoriesResponse = await client.request<RepositoriesResponse>(query);

		// Pro každýho uživatele ukládáme výsledky
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
