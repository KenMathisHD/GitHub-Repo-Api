import React from "react";
import "./sidebar.scss";

function Sidebar(props) {
  const { repos, handleClick } = props;
  return (
    <nav className="sidebar">
      {repos.map((repo, key) => (
        <button className="button" key={key} onClick={() => handleClick(repo)}>
          {repo}
        </button>
      ))}
    </nav>
  );
}

export default Sidebar;
