"use client";

import { useEffect, useState } from 'react';
import { getRepositoriesForMultipleUsers } from '../_graphql/gql';
import { Repository } from '../_types/repository';
import RepositoryDetail from '../_components/RepositoryDetail';

type RepositoriesProps = {
	owners: string[];  // Updated to accept multiple owners
};

export default function RepositoriesList({ owners }: RepositoriesProps) {
	const [repositories, setRepositories] = useState<Record<string, Repository[]>>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRepositories = async () => {
			try {
				const repoData = await getRepositoriesForMultipleUsers(owners);
				if (Object.keys(repoData).length > 0) {
					setRepositories(repoData);
				} else {
					setError('No repositories found for the provided owners.');
				}
			} catch (error) {
				console.error('Error fetching repositories:', error);
				setError('Error fetching repositories.');
			} finally {
				setLoading(false);
			}
		};

		void fetchRepositories();
	}, [owners]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<div>
			{Object.entries(repositories).map(([owner, repos]) => (
				<div key={owner}>
					<h2 className="text-lg font-bold mb-4">{owner}'s Repositories</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{repos.length > 0 ? (
							repos.map((repo) => (
								<RepositoryDetail key={repo.id} repository={repo}/>
							))
						) : (
							<p>No repositories found for {owner}.</p>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
