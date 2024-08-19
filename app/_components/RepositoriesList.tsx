"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getRepositoriesForMultipleUsers } from '../_graphql/gql';
import { Repository } from '../_types/repository';
import RepositoryDetail from '../_components/RepositoryDetail';

type RepositoriesProps = {
	owners: string[];
};

export default function RepositoriesList({ owners }: RepositoriesProps) {
	const [repositories, setRepositories] = useState<Record<string, Repository[]>>({});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRepositories = async () => {
			try {
				const repoData: Record<string, Repository[]> = await getRepositoriesForMultipleUsers(owners);
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
			{Object.entries(repositories).map(([owner, repos]) => {
				const ownerData = repos[0]?.owner;
				const profileUrl = `https://github.com/${ownerData.login}`; // Construct profile URL

				return (
					<div key={owner} className="mb-12">
						<div className="flex items-center gap-4 mb-4">
							<a href={profileUrl} target="_blank" rel="noopener noreferrer">
								<Image
									src={ownerData.avatarUrl}
									alt={`${ownerData.login}'s avatar`}
									width={40}
									height={40}
									className="rounded-full"
								/>
							</a>
							<a href={profileUrl} target="_blank" rel="noopener noreferrer">
								<h2 className="text-3xl font-medium">{ownerData.name || ownerData.login}</h2>
							</a>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{repos.length > 0 ? (
								repos.map((repo) => (
									<RepositoryDetail key={repo.id} repository={repo} />
								))
							) : (
								<p>No repositories found for {owner}.</p>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
