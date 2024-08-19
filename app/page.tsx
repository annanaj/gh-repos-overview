import RepositoriesList from './_components/RepositoriesList';

export default function HomePage() {
	return (
		<div className="container m-20">
			<h1 className="mb-8 text-4xl font-semibold">GitHub Repositories</h1>

			<RepositoriesList owners={['bradfrost', 'csswizardry', 'addyosmani', 'taniarascia', 'gaearon', 'LeaVerou']} />
		</div>
	);
};
