export function SponsorSlogan() {
  return (
    <div className="mx-auto space-y-4 text-center">
      <div className="space-y-2 text-center text-6xl font-bold leading-tight">
        <div className="">Sponsor PenX project</div>
      </div>
      <div className="text-foreground/60 mx-auto w-full text-center text-lg md:max-w-[600px]">
        PenX is an open-source project and also it is a public good. If you love{' '}
        <a
          href="https://www.penx.io/"
          target="_blank"
          className="decoration-brand text-brand underline"
        >
          penx.io
        </a>{' '}
        project, you can sponsor the PenX project, and you will receive{' '}
        <span className="text-brand">$PEN</span> tokens.
      </div>
    </div>
  )
}
