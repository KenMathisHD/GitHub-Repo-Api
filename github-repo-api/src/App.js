import React, { Component, useEffect, useState } from "react";

import Markdown from "./components/markdown/markdown";
import Sidebar from "./components/sidebar/sidebar";

import { getRepos, getRepoCount, getMarkdown } from "./utils/dataFetches";
import { getRepoNames, getRepo } from "./utils/functions";
import { marked } from "marked";
import "./App.scss";

const App = () => {
  const [repos, setRepos] = useState([]);
  const [markdown, setMarkdown] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [repoCount, setRepoCount] = useState(0);
  const [pageSize, setPageSize] = useState(30);
  const [user, setUser] = useState(window.location.href.split("/github/")[1]);

  useEffect(async () => {
    const totalCount = await getRepoCount(user, repoCount);
    const data = await getRepos(user, currentPage);
    setRepos(data);
    setRepoCount(totalCount);

    if (markdown === "") {
      const markdown = await getMarkdown(user, getRepo(data, data[0].name));
      setMarkdown(marked(markdown));
    }
  }, []);

  async function handleClick(repo) {
    const markdown = await getMarkdown(user, getRepo(repos, repo));
    setMarkdown(marked(markdown));
  }

  async function handleScroll() {
    const nextPage = currentPage + 1;
    if (nextPage < repoCount / pageSize + 1) {
      const nextRepos = await getRepos(user, nextPage, pageSize);
      const updatedRepos = [...repos, ...nextRepos];
      setRepos(updatedRepos);
      setCurrentPage(nextPage);
    }
  }

  const repoNames = getRepoNames(repos);

  return (
    <div className="app-header">
      <Sidebar
        repos={repoNames}
        handleClick={handleClick}
        handleScroll={handleScroll}
      ></Sidebar>
      <div className="container">
        <h1>GitHub Repository API Frontend</h1>
        <Markdown md={markdown}></Markdown>
      </div>
    </div>
  );
};

export default App;

// class App extends Component {
//   state = {
//     repos: [],
//     reposNames: [],
//     markdown: "",
//     currentPage: 1,
//     repoCount: 0,
//     pageSize: 30,
//     user: window.location.href.split("/github/")[1],
//   };

// async componentDidMount() {
//   const { user, markdown, repoCount, currentPage, pageSize } = this.state;
//   const totalCount = await getRepoCount(user, repoCount);
//   const data = await getRepos(user, currentPage);
//   this.setState({ repos: data, repoCount: totalCount });

//   if (markdown === "") {
//     const markdown = await getMarkdown(user, getRepo(data, data[0].name));
//     this.setState({ markdown: marked(markdown) });
//   }
// }

//   async handleClick(repo) {
//     const { user, repos } = this.state;
//     const markdown = await getMarkdown(user, getRepo(repos, repo));
//     this.setState({ markdown: marked(markdown) });
//   }

//   async handleScroll() {
//     const { currentPage, repos, repoCount, user, pageSize } = this.state;
//     const nextPage = currentPage + 1;
//     if (nextPage < repoCount / pageSize + 1) {
//       const nextRepos = await getRepos(user, nextPage, pageSize);
//       const updatedRepos = [...repos, ...nextRepos];
//       this.setState({ repos: updatedRepos, currentPage: nextPage });
//     }
//   }

//   render() {
//     const { repos, markdown } = this.state;
//     const repoNames = getRepoNames(repos);

//     return (
//       <div className="app-header">
//         <Sidebar
//           repos={repoNames}
//           handleClick={this.handleClick.bind(this)}
//           handleScroll={this.handleScroll.bind(this)}
//         ></Sidebar>
//         <div className="container">
//           <h1>GitHub Repository API Frontend</h1>
//           <Markdown md={markdown}></Markdown>
//         </div>
//       </div>
//     );
//   }
// }

// export default App;
