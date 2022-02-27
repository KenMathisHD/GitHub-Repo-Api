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
    const data = await this.getRepos(this.state.user);
    this.setState({ repos: data });
    if (this.state.markdown === "") {
      this.getMarkdown(data[0].name);
    }
  }

  async getRepos(user) {
    let repos = [];

    await fetch(`https://api.github.com/users/${user}/repos`)
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        const data = [...JSON.parse(text)];
        data.map((repo) => {
          repos.push(repo);
        });
      });

    return repos;
  }

  getMarkdown(currentRepo) {
    const repoObj = this.getRepo(currentRepo);
    const { default_branch, name: repo } = repoObj;
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
    const currentRepo = this.state.repos.find((o) => o.name === repo);
    console.log(currentRepo);
    return currentRepo;
  }

  getRepoNames(repos) {
    const repoNames = [];
    repos.forEach((repo) => {
      repoNames.push(repo.name);
    });
    return repoNames;
  }

  handleClick(repo) {
    console.log(repo);
    console.log(this.state.user);
    this.getMarkdown(repo);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>GitHub Repository API Frontend</h1>
          <div className="container">
            <Sidebar
              repos={this.getRepoNames(this.state.repos)}
              handleClick={this.handleClick.bind(this)}
            ></Sidebar>
            <Markdown md={this.state.markdown}></Markdown>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
