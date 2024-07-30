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
  query GetRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      name
      description
      createdAt
      updatedAt
      stargazerCount
      primaryLanguage {
        name
      }
      owner {
        login
      }
    }
  }
`;

export const getRepository = async (owner: string, name: string): Promise<Repository | null> => {
	try {
		const variables = { owner, name };
		const data: { repository: Repository } = await client.request(query, variables);
		return data.repository;
	} catch (error) {
		console.error('Error fetching repository:', error);
		return null;
	}
};
