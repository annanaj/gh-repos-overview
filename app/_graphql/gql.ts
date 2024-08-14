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

const query = gql`
  query GetRepositories($owner: String!, $first: Int) {
    repositoryOwner(login: $owner) {
      repositories(first: $first, privacy: PUBLIC) {
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
      }
    }
  }
`;

interface GetRepositoriesResponse {
	repositoryOwner: {
		repositories: {
			nodes: Repository[];
		};
	};
}

export const getRepositories = async (owner: string, first: number = 10): Promise<Repository[]> => {
	try {
		const variables = { owner, first };
		const data: GetRepositoriesResponse = await client.request<GetRepositoriesResponse>(query, variables);
		return data.repositoryOwner.repositories.nodes;
	} catch (error) {
		console.error('Error fetching repositories:', error);
		return [];
	}
};
