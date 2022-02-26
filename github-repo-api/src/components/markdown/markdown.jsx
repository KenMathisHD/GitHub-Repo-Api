import React from "react";
import "./markdown.scss";

function Markdown(props) {
  const { md } = props;

  return (
    <section className="readme">
      <h2>Repository ReadMe</h2>
      <article dangerouslySetInnerHTML={{ __html: md }}></article>
    </section>
  );
}

export default Markdown;
