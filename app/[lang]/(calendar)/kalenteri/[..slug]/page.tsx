async function getEventById(id: string): Promise<Event | null> {
  try {
    const baseUrl = process.env.EVENTS_API_BASE_URL || ""
    const targetUrl = `${baseUrl.replace(/\/$/, "")}/api/events/${id}`

    const response = await fetch(targetUrl, {
      next: { revalidate: 60 },
    })

    if (!response.ok) return null

    const event: Event = await response.json()
    return event
  } catch (error) {
    console.error("Failed to fetch event by id", error, id)
    return null
  }
}

const EventPage = async ({
  params,
}: {
  params: Promise<{ lang: string; slug: string[] }>
}) => {
  const { lang, slug } = await params

  const id = slug[0]
  const event = await getEventById(id)

  return event ? (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
      <p>Aika: {event.starts}</p>
      <p>Paikka: {event.location}</p>
      <p>Tyyppi: {event.category}</p>
      {event.show_responsible ? (
        <p>Vastuu henkilö: {event.responsible}</p>
      ) : (
        <></>
      )}
      <p>{event.description}</p>
    </div>
  ) : (
    <div />
  )
}

export default EventPage
