/**
 * Renders a minimal fallback HTML error page for catastrophic SSR failures
 * where the normal React render pipeline cannot run.
 */
export function renderErrorPage(message = "An unexpected error occurred.") {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Error — Vignan Voice AI</title>
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #0f172a;
        color: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 1rem;
      }
      .card {
        text-align: center;
        max-width: 480px;
        padding: 2.5rem 2rem;
        background: #1e293b;
        border-radius: 1rem;
        border: 1px solid #334155;
      }
      h1 { font-size: 4rem; font-weight: 700; color: #ef4444; }
      h2 { margin-top: 0.75rem; font-size: 1.25rem; font-weight: 600; }
      p  { margin-top: 0.5rem; font-size: 0.875rem; color: #94a3b8; }
      a  {
        display: inline-block;
        margin-top: 1.5rem;
        padding: 0.5rem 1.25rem;
        background: #3b82f6;
        color: #fff;
        border-radius: 0.5rem;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
      }
      a:hover { background: #2563eb; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>500</h1>
      <h2>Server Error</h2>
      <p>${message}</p>
      <a href="/">Go home</a>
    </div>
  </body>
</html>`;
}
