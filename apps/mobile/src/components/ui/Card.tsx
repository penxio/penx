import classNames from 'classnames'

const Card = ({
  children,
  className,
}: {
  children: React.ReactElement[]
  className: string
}) => (
  <div className={classNames('max-w-xl', className)}>
    <div className="rounded-b-xl bg-white shadow-md dark:bg-black">
      {children}
    </div>
  </div>
)

export default Card
