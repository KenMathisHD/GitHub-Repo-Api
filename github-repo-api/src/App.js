import React, { Component, useState } from "react";
import $ from "jquery";
import { marked } from "marked";

import logo from "./logo.svg";
import "./App.css";
import Markdown from "./components/markdown/markdown";

class App extends Component {
  state = { repos: [], markdown: "", currentRepo: "", defaultBranch: "" };

  async componentDidMount() {
    const data = await this.getRepos("KenMathisHD");

    this.setState({
      repos: data,
      currentRepo: data[0].name,
      defaultBranch: data[0].default_branch,
    });

    this.getMarkdown(
      "KenMathisHD",
      this.state.currentRepo,
      this.state.defaultBranch
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload. .
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Markdown md={this.state.markdown}></Markdown>
        </header>
      </div>
    );
  }

  async getRepos(user) {
    const repos = [];
    await $.get(`https://api.github.com/users/${user}/repos`, function (data) {
      data.map((repo) => {
        repos.push(repo);
      });
    });
    console.log(repos);
    return repos;
  }

  getMarkdown(user, repo, branch) {
    fetch(
      `https://raw.githubusercontent.com/${user}/${repo}/${branch}/README.md`
    )
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        this.setState({
          markdown: marked(text),
        });
      });
  }

  reposList = () => {
    const { repos } = this.state;
    const repoNames = [];
    repos.map((repo) => {
      repoNames.push(repo.name);
    });
    return repoNames;
  };
}

export default App;
