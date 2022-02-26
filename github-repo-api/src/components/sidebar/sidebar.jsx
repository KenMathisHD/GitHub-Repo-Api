import React from "react";
import "./sidebar.scss";

function Sidebar(props) {
  const { repos } = props;
  return (
    <div className="sidebar">
      {repos.map((repo) => (
        <div>{repo}</div>
      ))}
    </div>
  );
}

export default Sidebar;
