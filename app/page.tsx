import RepositoriesGrid from './_components/RepositoriesGrid';

export default function HomePage() {
	return (
		<div className="container m-20">
			<h1 className="mb-8 text-4xl font-semibold">GitHub Repositories</h1>

			<RepositoriesGrid owners={['bradfrost', 'bramus', 'csswizardry', 'addyosmani', 'taniarascia', 'gaearon', 'LeaVerou']} />
		</div>
	);
};
