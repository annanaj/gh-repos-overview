"use client"

import { useEffect, useState } from 'react';
import { getRepository } from '../_graphql/gql';
import { Repository } from '../_types/repository';

type RepositoryProps = {
	owner: string;
	repoName: string;
};

const RepositoryDetails = ({ owner, repoName }: RepositoryProps) => {
	const [repository, setRepository] = useState<Repository | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRepository = async () => {
			try {
				const repoData = await getRepository(owner, repoName);
				setRepository(repoData);
			} catch (error) {
				console.error('Error fetching repository:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchRepository();
	}, [owner, repoName]);

	return (
		<div>
			{loading ? (
				<p>Loading...</p>
			) : repository ? (
				<article
					key={repository.description}
					className="relative mb-6 flex h-full flex-col rounded-lg bg-gray-50 p-8 shadow-lg text-slate-900 max-w-md"
				>
					<h1 className="text-xl font-semibold mb-4">{repository.description}</h1>

					<p>Created: {repository.createdAt}</p>
					<p>Last Updated: {repository.updatedAt}</p>
					<p>Primary Language: {repository.primaryLanguage?.name}</p>
					<p>Owner: {repository.owner.login}</p>
				</article>


			) : (
				<p>Repository not found or error fetching data.</p>
			)}
		</div>
	);
};

export default RepositoryDetails;
