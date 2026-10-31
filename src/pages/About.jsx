import { Link } from "react-router-dom";

export default function About() {
  return (
    <section>
      <h1>About Us</h1>
      <div className="card">
        <p>
          Link Shrinker turns long, messy URLs into short links that are easy
          to share. You can also pick your own custom text for the link.
        </p>
        <p>
          Built with React, React Router, and the <code>useState</code> hook
          for CPIT-405 Lab 8. Short links are created through the is.gd API.
        </p>
        <Link to="/">← Back to Home</Link>
      </div>
    </section>
  );
}
