import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const components: Components = {
  h1: ({ children, ...props }) => {
    const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return (
      <h1 id={id} {...props} className="text-3xl font-bold mt-8 mb-4 text-inherit scroll-mt-24">
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }) => {
    const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return (
      <h2 id={id} {...props} className="text-2xl font-bold mt-6 mb-3 text-inherit scroll-mt-24">
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return (
      <h3 id={id} {...props} className="text-xl font-semibold mt-5 mb-2 text-inherit scroll-mt-24">
        {children}
      </h3>
    );
  },
  p: ({ children }) => (
    <p className="my-4 leading-relaxed">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="text-teal-500 hover:text-teal-400 underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded text-sm font-mono">
          {children}
        </code>
      );
    }
    return <code className={className}>{children}</code>;
  },
  pre: ({ children }) => (
    <pre className="bg-[#0d1117] rounded-lg overflow-x-auto my-4 p-4 text-sm leading-relaxed border border-slate-700">
      {children}
    </pre>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside my-4 space-y-1 ml-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside my-4 space-y-1 ml-2">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-teal-500 pl-4 italic my-4 opacity-80">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 text-sm">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 bg-slate-100 dark:bg-slate-800 font-semibold text-left">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-slate-300 dark:border-slate-700 px-4 py-2">{children}</td>
  ),
  hr: () => <hr className="my-8 border-slate-300 dark:border-slate-700" />,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
};

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
