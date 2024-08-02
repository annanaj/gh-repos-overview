"use client";

import { Repository } from '../_types/repository';

type RepositoryDetailProps = {
	repository: Repository;
};

export default function RepositoryDetail({ repository }: RepositoryDetailProps) {
	return (
		<article className="mb-6 flex h-full flex-col rounded-lg bg-gray-50 p-8 shadow-lg text-slate-900 max-w-md">
			<h2 className="text-3xl font-semibold mb-4">{repository.name}</h2>
			<p>{repository.description}</p>
			<p><strong>Created:</strong> {new Date(repository.createdAt).toLocaleDateString()}</p>
			<p><strong>Updated:</strong> {new Date(repository.updatedAt).toLocaleDateString()}</p>
			<p><strong>Stars:</strong> {repository.stargazerCount}</p>
			<p><strong>Forks:</strong> {repository.forkCount}</p>
			<p><strong>Issues:</strong> {repository.issues?.totalCount ?? 'N/A'}</p>
			<p><strong>Primary Language:</strong> {repository.primaryLanguage?.name || 'N/A'}</p>
			<h3 className="text-lg font-medium mt-6 mb-3">Owner</h3>
			<div className="flex gap-4">
				<img src={repository.owner.avatarUrl} alt={repository.owner.login} className="w-10 h-10 rounded-full mr-3"/>
				<div>
					<p>Username: {repository.owner.login}</p>
					{repository.owner.name && <p>Name: {repository.owner.name}</p>}
					{repository.owner.bio && <p>Bio: {repository.owner.bio}</p>}
					{repository.owner.membersWithRole && <p>Members with Role: {repository.owner.membersWithRole.totalCount}</p>}
				</div>
			</div>
		</article>
	);
}
