import Icon from './Icon'

type PageHeaderProps = {
  eyebrow: string
  title: string
  description: string
  children?: React.ReactNode
}

/** Encabezado reutilizable de las páginas internas. */
export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <p className="eyebrow">
        <Icon name="sparkles" size={14} />
        {eyebrow}
      </p>
      <h1 className="page-title">{title}</h1>
      <p className="page-description">{description}</p>
      {children ? <div className="page-header-extra">{children}</div> : null}
    </header>
  )
}
