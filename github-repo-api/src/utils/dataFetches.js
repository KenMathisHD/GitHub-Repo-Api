export async function getRepoCount(user) {
  const response = await fetch(`https://api.github.com/users/${user}`);
  const data = await response.json();
  return data.public_repos;
}

export async function getRepos(user, page, pageSize) {
  const response = await fetch(
    `https://api.github.com/users/${user}/repos?page=${page}&per_page=${pageSize}`
  );
  return response.json();
}

export async function getMarkdown(user, repo) {
  const { name, default_branch } = repo;
  const response = await fetch(
    `https://raw.githubusercontent.com/${user}/${name}/${default_branch}/README.md`
  );
  return response.text();
}
