import { Logo } from './Logo'

export function LogoSpinner() {
  return (
    <div className="item-center flex flex-col justify-center">
      <Logo className="size-12" />
      <div className="logo-loader"></div>
    </div>
  )
}
