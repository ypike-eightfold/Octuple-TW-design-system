import fs from "node:fs";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const revalidate = 60;

export default function WorkflowDocPage() {
  // The workflow doc lives at repo-root /docs/DESIGNER-WORKFLOW.md (one level up from web/).
  const docPath = path.resolve(process.cwd(), "..", "docs", "DESIGNER-WORKFLOW.md");
  const md = fs.readFileSync(docPath, "utf8");

  return (
    <article className="mx-auto max-w-3xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="mt-2 mb-6 text-3xl font-semibold tracking-tight" {...props} />,
          h2: (props) => <h2 className="mt-12 mb-3 text-2xl font-semibold tracking-tight border-b border-[var(--border)] pb-2" {...props} />,
          h3: (props) => <h3 className="mt-8 mb-2 text-lg font-semibold" {...props} />,
          p: (props) => <p className="my-4 leading-relaxed text-[var(--foreground)]" {...props} />,
          ul: (props) => <ul className="my-4 ml-6 list-disc space-y-1" {...props} />,
          ol: (props) => <ol className="my-4 ml-6 list-decimal space-y-1" {...props} />,
          li: (props) => <li className="leading-relaxed" {...props} />,
          a: (props) => <a className="text-[var(--primary)] underline" {...props} />,
          code: ({ className, ...props }) => {
            const inline = !className?.startsWith("language-");
            return inline ? (
              <code className="rounded bg-[var(--card)] px-1.5 py-0.5 text-[0.9em] font-mono border border-[var(--border)]" {...props} />
            ) : (
              <code className={className} {...props} />
            );
          },
          pre: (props) => (
            <pre className="my-4 overflow-x-auto rounded-lg bg-[var(--card)] p-4 text-sm border border-[var(--border)]" {...props} />
          ),
          table: (props) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse text-sm" {...props} />
            </div>
          ),
          thead: (props) => <thead className="border-b border-[var(--border)] bg-[var(--card)]" {...props} />,
          th: (props) => <th className="px-3 py-2 text-left font-medium" {...props} />,
          td: (props) => <td className="px-3 py-2 border-t border-[var(--border)]" {...props} />,
          blockquote: (props) => (
            <blockquote className="my-4 border-l-4 border-[var(--primary)] bg-[var(--card)] py-1 pl-4 italic text-[var(--muted-foreground)]" {...props} />
          ),
          hr: () => <hr className="my-10 border-[var(--border)]" />,
        }}
      >
        {md}
      </ReactMarkdown>
    </article>
  );
}
