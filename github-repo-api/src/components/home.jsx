import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import $ from "jquery";
import { marked } from "marked";
import Markdown from "./markdown/markdown";
import Sidebar from "./sidebar/sidebar";

function Home() {
  const [repos, setRepos] = useState(dummyData());
  const [markdown, setMarkdown] = useState();
  const [currentRepo, setCurrentRepo] = useState(dummyData()[0]);

  const user = window.location.href.split("/github/")[1];
  console.log(user);

  useEffect(async () => {
    // const data = await getRepos(user);
    const data = dummyData();

    setRepos(data);
    setCurrentRepo(data[0]);
    getMarkdown(user);
  }, []);

  async function getRepos(user) {
    const repos = [];
    await $.get(`https://api.github.com/users/${user}/repos`, function (data) {
      data.forEach((repo) => {
        repos.push(repo);
      });
    });
    return repos;
  }

  function dummyData() {
    const dummy = [
      {
        name: "GitHub-Repo-Api",
        html_url: "https://github.com/KenMathisHD/GitHub-Repo-Api",
        default_branch: "master",
      },
      {
        name: "CorvetteInformed_R_LocalData",
        html_url: "https://github.com/KenMathisHD/CorvetteInformed_R_LocalData",
        default_branch: "master",
      },
    ];
    return dummy;
  }

  function getMarkdown(user) {
    console.log(currentRepo);
    const { default_branch, name: repo } = currentRepo;
    fetch(
      `https://raw.githubusercontent.com/${user}/${repo}/${default_branch}/README.md`
    )
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        console.log(marked(text));
        setMarkdown(marked(text));
      });
  }

  const repoNames = () => {
    const repoNamesArr = [];
    repos.forEach((repo) => {
      repoNamesArr.push(repo.name);
    });
    return repoNamesArr;
  };

  return (
    <div className="container">
      <Sidebar repos={repoNames()}></Sidebar>
      <Markdown md={markdown}></Markdown>
    </div>
  );
}

export default Home;
