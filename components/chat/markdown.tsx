import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// react-markdown does not render raw HTML, so model output can't inject scripts (XSS-safe).
export const Markdown = memo(function Markdown({
  content,
}: {
  content: string;
}) {
  return (
    <div className="prose prose-sm dark:prose-invert prose-pre:bg-muted prose-pre:text-foreground max-w-none wrap-break-word">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
