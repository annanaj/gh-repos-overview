'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { getRepositoriesForMultipleUsers } from '../../_graphql/gql';
import { Repository } from '../../_types/repository';
import RepositoryCard from '../../_components/RepositoryCard';

export default function UserDetails() {
	const { owner } = useParams();
	const ownerNumber = Array.isArray(owner) ? owner[0] : owner;
	const [repositories, setRepositories] = useState<Repository[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!owner) {
			setError('Owner not specified.');
			setLoading(false);
			return;
		}

		const fetchRepositories = async () => {
			try {
				const repoData = await getRepositoriesForMultipleUsers([ownerNumber], 100);
				console.log('Fetched repo data:', repoData);  // Logování dat pro debugging
				const repositoriesData = repoData[ownerNumber]?.map((repo: any) => repo) || [];

				if (repositoriesData.length === 0) {
					setError('No repositories found.');
				}

				setRepositories(repositoriesData);
			} catch (error) {
				console.error('Error fetching repositories:', error);
				setError('Error fetching repositories.');
			} finally {
				setLoading(false);
			}
		};

		void fetchRepositories();
	}, [owner]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	// Zkontroluj, že ownerData je definováno
	const ownerData = repositories[0]?.owner;
	if (!ownerData) {
		return <p>No repositories data available for this user.</p>;
	}

	return (
		<div className="container m-20">
			<div className="flex items-center gap-4 mb-4">
				{ownerData.avatarUrl && (
					<Image
						src={ownerData.avatarUrl}
						alt={`${ownerData.login}'s avatar`}
						width={40}
						height={40}
						className="rounded-full"
					/>
				)}
				<h2 className="text-3xl font-medium">{ownerData.name || ownerData.login}</h2>
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
		</div>
	);
}
