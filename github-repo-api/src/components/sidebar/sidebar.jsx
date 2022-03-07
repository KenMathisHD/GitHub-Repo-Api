import React from "react";
import "./sidebar.scss";

function Sidebar(props) {
  const { repos, handleClick, handleScroll } = props;
  return (
    <nav id="sidebar" className="sidebar" onScroll={(e) => onScroll(e)}>
      {repos.map((repo, key) => (
        <button className="button" key={key} onClick={() => handleClick(repo)}>
          {repo}
        </button>
      ))}
    </nav>
  );

  function onScroll(e) {
    const { target } = e;
    if (target.scrollTop >= target.scrollHeight - target.offsetHeight) {
      handleScroll();
    }
  }
}

export default Sidebar;
