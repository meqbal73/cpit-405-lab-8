import { useState } from "react";

const API = "https://is.gd/create.php";

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [custom, setCustom] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setCopied(false);

    const url = longUrl.trim();
    const alias = custom.trim();

    if (!isValidUrl(url)) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }
    if (alias && !/^[A-Za-z0-9_]{5,30}$/.test(alias)) {
      setError(
        "Custom text must be 5-30 characters: letters, numbers, or underscores only."
      );
      return;
    }

    const params = new URLSearchParams({ format: "json", url });
    if (alias) params.set("shorturl", alias);

    setLoading(true);
    try {
      const res = await fetch(`${API}?${params}`);
      const data = await res.json();
      if (data.errorcode) {
        throw new Error(data.errormessage || "Could not shorten the link.");
      }
      setShortUrl(data.shorturl);
      setHistory((prev) => [{ long: url, short: data.shorturl }, ...prev]);
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(text) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Could not copy automatically. Please copy it manually.");
    }
  }

  function handleReset() {
    setLongUrl("");
    setCustom("");
    setShortUrl("");
    setError("");
    setCopied(false);
  }

  return (
    <section>
      <h1>Shorten your links</h1>
      <p className="muted">
        Paste a long URL, optionally choose your own short text, and get a
        shareable link.
      </p>

      <form onSubmit={handleSubmit} className="card">
        <label htmlFor="long">Long URL</label>
        <input
          id="long"
          type="text"
          placeholder="https://example.com/a/very/long/link"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />

        <label htmlFor="custom">
          Custom short text <span className="muted">(optional)</span>
        </label>
        <div className="prefix">
          <span>is.gd/</span>
          <input
            id="custom"
            type="text"
            placeholder="my_link"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
        </div>

        <div className="actions">
          <button type="submit" disabled={loading}>
            {loading ? "Shortening..." : "Shorten"}
          </button>
          <button type="button" className="secondary" onClick={handleReset}>
            Clear
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      {shortUrl && (
        <div className="card result">
          <p className="muted">Your short link</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
          <button onClick={() => handleCopy(shortUrl)}>
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="card">
          <h2>This session</h2>
          <ul className="history">
            {history.map((item, i) => (
              <li key={i}>
                <a href={item.short} target="_blank" rel="noopener noreferrer">
                  {item.short}
                </a>
                <span className="muted long">{item.long}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
