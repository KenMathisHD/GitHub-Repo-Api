import React from "react";
import "./sidebar.scss";

function Sidebar(props) {
  const { repos, handleClick } = props;
  return (
    <ul className="sidebar">
      {repos.map((repo, key) => (
        <li key={key} onClick={() => handleClick(repo)}>
          <span>{repo}</span>
        </li>
      ))}
    </ul>
  );
}

export default Sidebar;
