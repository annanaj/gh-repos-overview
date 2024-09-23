'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { getRepositoriesForMultipleUsers } from '../_graphql/gql';
import { Repository } from '../_types/repository';
import RepositoryCard from './RepositoryCard';

type RepositoriesProps = {
	owners: string[];
};

export default function RepositoriesGrid({ owners }: RepositoriesProps) {
	const [repositories, setRepositories] = useState<Record<string, Repository[]>>({});
	const [expandedOwners, setExpandedOwners] = useState<Record<string, boolean>>({});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRepositories = async () => {
			try {
				const repoData = await getRepositoriesForMultipleUsers(owners, 9);
				setRepositories(repoData);

				// Initialize the expandedOwners state to collapse all initially
				const initialExpandedState: Record<string, boolean> = {};
				owners.forEach(owner => {
					initialExpandedState[owner] = false;
				});
				setExpandedOwners(initialExpandedState);
			} catch (error) {
				console.error('Error fetching repositories:', error);
				setError('Error fetching repositories.');
			} finally {
				setLoading(false);
			}
		};

		void fetchRepositories();
	}, [owners]);

	const toggleVisibility = (owner: string) => {
		setExpandedOwners((prev) => ({
			...prev,
			[owner]: !prev[owner],
		}));
	};

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
				const isExpanded = expandedOwners[owner];

				return (
					<div key={owner} className="mb-12">
						<div
							className="flex items-center gap-4 mb-4 cursor-pointer"
							onClick={() => toggleVisibility(owner)}
						>
							{ownerData?.avatarUrl && (
								<Image
									src={ownerData.avatarUrl}
									alt={`${ownerData.login}'s avatar`}
									width={40}
									height={40}
									className="rounded-full"
								/>
							)}
							<h2 className="text-3xl font-medium">
								{ownerData?.name || ownerData?.login}
							</h2>
							{/* Toggle outline arrow */}
							<span className="text-xl">
								{isExpanded ? '▴' : '▾'}
							</span>
						</div>

						{/* Conditionally render the repositories grid */}
						{isExpanded && (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
								{repos.length > 0 ? (
									repos.slice(0, 9).map((repo) => (
										<RepositoryCard key={repo.id} repository={repo} />
									))
								) : (
									<p>No repositories found for {owner}.</p>
								)}
							</div>
						)}
						{isExpanded && (
							<Link href={`/details/${owner}`} className="mt-4 p-2 bg-blue-500 text-white rounded">
								View All Repositories
							</Link>
						)}
					</div>
				);
			})}
		</div>
	);
}
