import React, { Component } from "react";

import Markdown from "./components/markdown/markdown";
import Sidebar from "./components/sidebar/sidebar";
import { marked } from "marked";
import "./App.scss";

class App extends Component {
  state = {
    repos: [],
    markdown: "",
    user: window.location.href.split("/github/")[1],
  };

  async componentDidMount() {
    const { user, markdown } = this.state;
    const data = await this.getRepos(user);
    this.setState({ repos: data });
    if (markdown === "") {
      this.getMarkdown(data[0].name);
    }
  }

  render() {
    const { repos, markdown } = this.state;
    const repoNames = this.getRepoNames(repos);
    return (
      <div className="app-header">
        <h1>GitHub Repository API Frontend</h1>
        <div className="container">
          <Sidebar
            repos={repoNames}
            handleClick={this.handleClick.bind(this)}
          ></Sidebar>
          <Markdown md={markdown}></Markdown>
        </div>
      </div>
    );
  }
  async getRepos(user) {
    let repos = [];

    await fetch(`https://api.github.com/users/${user}/repos`)
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        const data = [...JSON.parse(text)];
        repos = [...data];
      });

    return repos;
  }

  getMarkdown(currentRepo) {
    const { default_branch, name: repo } = this.getRepo(currentRepo);
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

  getRepo(repo) {
    return this.state.repos.find((o) => o.name === repo);
  }

  getRepoNames(repos) {
    const repoNames = [];
    repos.forEach((repo) => {
      repoNames.push(repo.name);
    });
    return repoNames;
  }

  handleClick(repo) {
    this.getMarkdown(repo);
  }
}

export default App;
