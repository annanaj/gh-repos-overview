import RepositoriesList from './_components/RepositoriesList';

export default function HomePage() {
	return (
		<div className="container m-20">
			<h1 className="mb-8 text-4xl">GitHub Repository Details</h1>

			<RepositoriesList owner="annanaj" />
		</div>
	);
};
