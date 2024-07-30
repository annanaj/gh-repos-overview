import RepositoryDetails from './_components/RepositoryDetails';

const HomePage = () => {
  return (
      <div className="container m-20">
        <h1 className="mb-8 text-4xl">GitHub Repository Details</h1>

        <RepositoryDetails owner="annanaj" repoName="news" />
      </div>
  );
};

export default HomePage;
