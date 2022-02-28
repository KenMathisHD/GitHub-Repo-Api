import React, { Component } from "react";

import Markdown from "./components/markdown/markdown";
import Sidebar from "./components/sidebar/sidebar";

import { marked } from "marked";
import "./App.scss";

class App extends Component {
  state = {
    repos: [],
    reposNames: [],
    markdown: "",
    currentPage: 1,
    repoCount: 0,
    pageSize: 30,
    user: window.location.href.split("/github/")[1],
  };

  async componentDidMount() {
    const { user, markdown, repoCount, currentPage } = this.state;
    const totalCount = await this.getRepoCount(user, repoCount);
    const data = await this.getRepos(user, currentPage);
    this.setState({ repos: data, repoCount: totalCount });

    if (markdown === "") {
      this.getMarkdown(data, data[0].name);
    }
  }

  handleClick(repo) {
    this.getMarkdown(this.state.repos, repo);
  }

  async handleScroll() {
    const { currentPage, repos, repoCount, user, pageSize } = this.state;
    const nextPage = currentPage + 1;
    if (nextPage < repoCount / pageSize + 1) {
      const nextRepos = await this.getRepos(user, nextPage, pageSize);
      const updatedRepos = [...repos, ...nextRepos];
      this.setState({ repos: updatedRepos, currentPage: nextPage });
    }
  }

  render() {
    const { repos, markdown } = this.state;
    const repoNames = this.getRepoNames(repos);

    return (
      <div className="app-header">
        <Sidebar
          repos={repoNames}
          handleClick={this.handleClick.bind(this)}
          handleScroll={this.handleScroll.bind(this)}
        ></Sidebar>
        <div className="container">
          <h1>GitHub Repository API Frontend</h1>
          <Markdown md={markdown}></Markdown>
        </div>
      </div>
    );
  }
  async getRepoCount(user, repoCount) {
    if (repoCount === 0) {
      await fetch(`https://api.github.com/users/${user}`)
        .then((response) => {
          return response.text();
        })
        .then((text) => {
          const data = JSON.parse(text);
          repoCount = data.public_repos;
        });
      return repoCount;
    }
  }
  async getRepos(user, currentPage, pageSize) {
    let repos = [];

    await fetch(
      `https://api.github.com/users/${user}/repos?page=${currentPage}&per_page=${pageSize}`
    )
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        const data = [...JSON.parse(text)];
        repos = [...data];
      });

    return repos;
  }

  getMarkdown(repos, currentRepo) {
    const { default_branch, name: repo } = this.getRepo(repos, currentRepo);
    fetch(
      `https://raw.githubusercontent.com/${this.state.user}/${repo}/${default_branch}/README.md`
    )
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        this.setState({ markdown: marked(text) });
      });
  }

  getRepo(repos, repo) {
    return repos.find((o) => o.name === repo);
  }

  getRepoNames(repos) {
    const repoNames = [];
    repos.forEach((repo) => {
      repoNames.push(repo.name);
    });

    return repoNames;
  }
}

export default App;
