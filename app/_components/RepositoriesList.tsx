"use client";

import { useEffect, useState } from 'react';
import { getRepositories } from '../_graphql/gql';
import { Repository } from '../_types/repository';
import RepositoryDetail from '../_components/RepositoryDetail';

type RepositoriesProps = {
	owner: string;
};

export default function RepositoriesList({ owner }: RepositoriesProps) {
	const [repositories, setRepositories] = useState<Repository[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRepositories = async () => {
			try {
				const repoData = await getRepositories(owner);
				if (repoData.length > 0) {
					setRepositories(repoData);
				} else {
					setError('No repositories found for the provided owner.');
				}
			} catch (error) {
				console.error('Error fetching repositories:', error);
				setError('Error fetching repositories.');
			} finally {
				setLoading(false);
			}
		};

		fetchRepositories();
	}, [owner]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{repositories.length > 0 ? (
				repositories.map((repo) => (
					<RepositoryDetail key={repo.id} repository={repo}/>
				))
			) : (
				<p>Repository not found or error fetching data.</p>
			)}
		</div>
	);
}
