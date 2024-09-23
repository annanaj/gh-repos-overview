'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { getRepositoriesForMultipleUsers } from '../../_graphql/gql';
import { Repository } from '../../_types/repository';
import RepositoryCard from '../../_components/RepositoryCard';

export default function UserDetails() {
	const searchParams = useSearchParams();
	const owner = searchParams.get('owner');

	const [repositories, setRepositories] = useState<Repository[]>([]);
	const [paginationState, setPaginationState] = useState<{ endCursor: string | null, hasNextPage: boolean }>({ endCursor: null, hasNextPage: true });
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!owner) return;

		const fetchRepositories = async () => {
			try {
				const repoData = await getRepositoriesForMultipleUsers([owner], 9);
				setRepositories(repoData[owner] || []);

				setPaginationState({
					endCursor: repoData[owner]?.length ? repoData[owner][repoData[owner].length - 1].id : null,
					hasNextPage: repoData[owner]?.length >= 9,
				});
			} catch (error) {
				console.error('Error fetching repositories:', error);
				setError('Error fetching repositories.');
			} finally {
				setLoading(false);
			}
		};

		void fetchRepositories();
	}, [owner]);

	const loadMore = async () => {
		if (!paginationState.hasNextPage || !owner) return;

		setLoading(true);
		try {
			const newRepoData = await getRepositoriesForMultipleUsers([owner], 9, paginationState.endCursor);

			setRepositories((prevRepos) => [...prevRepos, ...newRepoData[owner] || []]);

			setPaginationState({
				endCursor: newRepoData[owner]?.length ? newRepoData[owner][newRepoData[owner].length - 1].id : null,
				hasNextPage: newRepoData[owner]?.length >= 9,
			});
		} catch (error) {
			console.error('Error loading more repositories:', error);
			setError('Error loading more repositories.');
		} finally {
			setLoading(false);
		}
	};

	if (loading && !repositories.length) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	const ownerData = repositories[0]?.owner;

	return (
		<div className="container m-20">
			<div className="flex items-center gap-4 mb-4">
				{ownerData?.avatarUrl && (
					<Image
						src={ownerData.avatarUrl}
						alt={`${ownerData.login}'s avatar`}
						width={40}
						height={40}
						className="rounded-full"
					/>
				)}
				<h2 className="text-3xl font-medium">{ownerData?.name || ownerData?.login}</h2>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{repositories.length > 0 ? (
					repositories.map((repo) => (
						<RepositoryCard key={repo.id} repository={repo} />
					))
				) : (
					<p>No repositories found for {owner}.</p>
				)}
			</div>
			{paginationState.hasNextPage && (
				<button
					onClick={loadMore}
					className="mt-4 p-2 bg-blue-500 text-white rounded"
				>
					Load More
				</button>
			)}
		</div>
	);
}
