'use client'

interface CodeBlockProps {
  node: any
  inline: boolean
  className: string
  children: any
}

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  if (!inline) {
    return (
      <div className="not-prose flex flex-col">
        <pre
          {...props}
          className={`bg-foreground/6 text-foreground w-full overflow-x-auto rounded-xl p-4 text-sm`}
        >
          <code className="whitespace-pre-wrap break-words">{children}</code>
        </pre>
      </div>
    )
  } else {
    return (
      <code
        className={`${className} bg-foreground/6 text-foreground rounded-md px-1 py-0.5 text-sm`}
        {...props}
      >
        {children}
      </code>
    )
  }
}
