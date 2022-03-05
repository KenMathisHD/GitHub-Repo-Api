export function getRepo(repos, repo) {
  return repos.find((o) => o.name === repo);
}

export function getRepoNames(repos) {
  return repos.map((repo) => repo.name);
}
