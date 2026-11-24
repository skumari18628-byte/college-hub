import { useRef } from "react";
import { toPreviewUrl, toDownloadUrl } from "../utils";

export default function PdfViewer({ item, saved, onToggleSave, onDownload }) {
  const frame = useRef(null);

  function print() {
    try {
      frame.current.contentWindow.print();
    } catch {
      window.open(item.link, "_blank", "noopener");
      window.alert("The file opened in a new tab. Press Cmd + P there to print it.");
    }
  }

  return (
    <div>
      <div className="viewer-bar">
        <a
          className="btn small"
          href={toDownloadUrl(item.link)}
          target="_blank"
          rel="noreferrer"
          onClick={onDownload}
        >
          ⬇ Download
        </a>
        <button className="btn small" onClick={print}>
          🖨 Print
        </button>
        <button className="btn small" onClick={onToggleSave}>
          {saved ? "★ Bookmarked" : "☆ Bookmark"}
        </button>
        <a className="btn small" href={item.link} target="_blank" rel="noreferrer">
          Open in new tab
        </a>
      </div>
      <iframe
        ref={frame}
        className="pdf-frame"
        src={toPreviewUrl(item.link)}
        title={item.title}
        loading="lazy"
      />
      <p className="hint">
        If the file does not appear, the link may not allow embedding. Use "Open
        in new tab". Google Drive files must be shared as "Anyone with the link".
      </p>
    </div>
  );
}