import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Check,
  ChevronRight,
  FolderOpen,
  Layers3,
  LockKeyhole,
  Sparkles,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import {
  REQUIRED_FOLDERS,
  inspectProject,
  validateOutput,
  exportProject,
} from "./filesystem.ts";
import type { Directory, Plan } from "./filesystem.ts";
import { NOT_ABLE_TO_SHOW_FAKEMONS } from "./exclusions.ts";
import "./style.css";

declare global {
  interface Window {
    showDirectoryPicker?: (options?: {
      mode?: "read" | "readwrite";
      id?: string;
    }) => Promise<Directory>;
  }
}

function App() {
  const [plan, setPlan] = useState<Plan>();
  const [output, setOutput] = useState<Directory>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [complete, setComplete] = useState(false);
  const supported = !!window.showDirectoryPicker;

  async function pickSource() {
    setError("");
    try {
      const source = await window.showDirectoryPicker!({
        mode: "read",
        id: "game-project",
      });
      setPlan(undefined);
      setComplete(false);
      setStatus("Reading project and preparing assets…");
      setBusy(true);
      const next = await inspectProject(source);
      setPlan(next);
      if (output) await validateOutput(output, source);
      setStatus("");
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        setError(String(err instanceof Error ? err.message : err));
        setStatus("");
      }
    } finally {
      setBusy(false);
    }
  }

  async function pickOutput() {
    setError("");
    try {
      const selected = await window.showDirectoryPicker!({
        mode: "readwrite",
        id: "website-project",
      });
      await validateOutput(selected, plan?.source);
      setOutput(selected);
      setComplete(false);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError"))
        setError(
          err instanceof Error
            ? `Choose apps/web from the monorepo. ${err.message}`
            : String(err),
        );
    }
  }

  async function generate() {
    if (!plan || !output) return;
    setError("");
    setBusy(true);
    setComplete(false);
    try {
      await exportProject(plan, output, setStatus);
      setComplete(true);
    } catch (err) {
      setError(
        `${err instanceof Error ? err.message : String(err)} If writing was interrupted, select the folders again and retry to finish the export.`,
      );
      setStatus("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="studio">
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="Asset Studio home">
          <span className="brand-mark">
            <Layers3 size={23} />
          </span>
          <span>
            absolution<span className="brand-sub">ASSET STUDIO</span>
          </span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <div className="nav-active">
          <Sparkles size={18} /> Asset generator <ChevronRight size={16} />
        </div>
        <div className="side-note">
          <LockKeyhole size={18} />
          <div>
            <strong>Your project stays local</strong>
            <p>
              Files go directly from your game project to your website folder.
            </p>
          </div>
        </div>
        <div className="sidebar-footer">
          <span className="dot" /> LOCAL WORKSPACE
        </div>
      </aside>
      <div className="body">
        <header className="topbar">
          <span>
            Workspace <ChevronRight size={14} />{" "}
            <strong>Asset generator</strong>
          </span>
          <span className="local-badge">
            <span className="dot" /> Browser workspace
          </span>
        </header>
        <main>
          <div className="eyebrow">FROM GAME TO WEBSITE</div>
          <h1>
            Your project.
            <br />
            <span>Ready for the web.</span>
          </h1>
          <p className="intro">
            Turn your game’s PBS data, sprites, and exported maps into assets
            for the Absolution website.
          </p>
          {!supported && (
            <div className="alert" role="alert">
              <AlertCircle size={20} /> Open this app in Chrome or Edge on
              localhost or HTTPS to select local folders.
            </div>
          )}
          <div className="steps">
            <section className={`panel ${plan ? "selected" : ""}`}>
              <div className="panel-heading">
                <span className="step">01</span>
                <span>GAME PROJECT</span>
                {plan && <Check className="success" size={18} />}
              </div>
              <FolderOpen className="folder-icon" size={36} strokeWidth={1.4} />
              <h2>{plan?.source.name || "Choose your game project"}</h2>
              <p>
                Select the root folder containing your PBS and Graphics
                directories.
              </p>
              <button
                className="secondary"
                disabled={!supported || busy}
                onClick={pickSource}
              >
                <FolderOpen size={16} />
                {plan ? "Change project" : "Select project folder"}
              </button>
              <div className="folder-list">
                {REQUIRED_FOLDERS.map((path) => (
                  <div key={path}>
                    <span className={plan ? "success" : "muted"}>
                      {plan ? (
                        <Check size={13} />
                      ) : (
                        <span className="folder-dot" />
                      )}
                    </span>
                    <code>./{path}</code>
                  </div>
                ))}
              </div>
            </section>
            <div className="flow-arrow">
              <ArrowRight size={20} />
            </div>
            <section className={`panel ${output ? "selected" : ""}`}>
              <div className="panel-heading">
                <span className="step">02</span>
                <span>WEBSITE OUTPUT</span>
                {output && <Check className="success" size={18} />}
              </div>
              <Layers3 className="folder-icon" size={36} strokeWidth={1.4} />
              <h2>{output?.name || "Choose the website folder"}</h2>
              <p>
                Select <code>apps/web</code> in your monorepo. Generated files
                will be written here.
              </p>
              <button
                className="secondary"
                disabled={!supported || busy}
                onClick={pickOutput}
              >
                <FolderOpen size={16} />
                {output ? "Change output folder" : "Select output folder"}
              </button>
              <div className="output-preview">
                <span>GENERATED OUTPUT</span>
                <code>
                  <span>src/data/</span> Pokémon, moves, items & maps
                </code>
                <code>
                  <span>public/</span> Sprites, trainers & map images
                </code>
                <p>
                  Existing generated files are replaced. Assets from previous
                  exports are kept in sync.
                </p>
              </div>
            </section>
          </div>
          <section className="protection">
            <span className="shield">
              <LockKeyhole size={21} />
            </span>
            <div>
              <strong>Unrevealed Pokémon stay unrevealed</strong>
              <p>
                <code>NOT_ABLE_TO_SHOW_FAKEMONS</code> is preserved.{" "}
                {NOT_ABLE_TO_SHOW_FAKEMONS.length} species are excluded from
                Pokémon, forms, encounters, evolution links, and sprites.
              </p>
            </div>
            <span className="protected-badge">PROTECTED</span>
          </section>
          {plan && (
            <section className="summary" aria-label="Generation preview">
              <div className="summary-heading">
                <h2>Ready to generate</h2>
                <span>
                  {Object.keys(plan.files).length} data files ·{" "}
                  {plan.assets.length.toLocaleString()} asset files
                </span>
              </div>
              <div className="stats">
                {Object.entries(plan.counts).map(([label, count]) => (
                  <div key={label}>
                    <strong>{count.toLocaleString()}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              {plan.warnings.map((w) => (
                <p className="warning" key={w}>
                  {w}
                </p>
              ))}
            </section>
          )}
          {error && (
            <div className="alert" role="alert">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}
          <section className="action-bar">
            <div>
              <strong>
                {complete
                  ? "Your website assets are ready"
                  : "A fresh export, in a few clicks"}
              </strong>
              <p>
                {complete
                  ? "Review the changes in apps/web, then build your website."
                  : "Select both folders to review and generate your assets."}
              </p>
            </div>
            <button
              className="primary"
              onClick={generate}
              disabled={!plan || !output || busy || !supported}
            >
              {busy ? (
                <LoaderCircle className="spin" size={18} />
              ) : complete ? (
                <Check size={18} />
              ) : (
                <Sparkles size={18} />
              )}
              {busy
                ? "Working…"
                : complete
                  ? "Generate again"
                  : "Generate assets"}
              {!busy && <ArrowRight size={17} />}
            </button>
          </section>
          <p className="status" role="status" aria-live="polite">
            {status ||
              "Game files are read only. Review generated changes before publishing your website."}
          </p>
        </main>
        <footer>
          POKÉMON ABSOLUTION{" "}
          <span>Asset Studio · Local tools for your world</span>
        </footer>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
