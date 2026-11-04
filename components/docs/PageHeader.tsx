type PageHeaderProps = {
  title: string
  description: string
}

function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      <h1 className="font-pixel text-[32px] leading-none uppercase md:text-[48px]">{title}</h1>
      <p className="max-w-2xl text-xl leading-tight">{description}</p>
    </header>
  )
}

export { PageHeader }
