"use client";

import { Repository } from '../_types/repository';

type RepositoryDetailProps = {
	repository: Repository;
};

export default function RepositoryDetail({ repository }: RepositoryDetailProps) {
	return (
		<article className="flex flex-col rounded-lg bg-gray-50 p-8 shadow-lg text-slate-900 max-w-md">
			<h3 className="text-xl font-semibold mb-4">{repository.name}</h3>
			<p>{repository.description}</p>
			<p><strong>Created:</strong> {new Date(repository.createdAt).toLocaleDateString()}</p>
			<p><strong>Updated:</strong> {new Date(repository.updatedAt).toLocaleDateString()}</p>
			<p><strong>Stars:</strong> {repository.stargazerCount}</p>
			<p><strong>Forks:</strong> {repository.forkCount}</p>
			<p><strong>Issues:</strong> {repository.issues?.totalCount ?? 'N/A'}</p>
			<p><strong>Primary Language:</strong> {repository.primaryLanguage?.name || 'N/A'}</p>
		</article>
	);
}
