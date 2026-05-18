const EventPage = async ({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>
}) => {
  const { lang, slug } = await params

  const id = slug[0]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event {id}</h1>
      <p>Content for event {id} will be displayed here.</p>
    </div>
  )
}

export default EventPage
