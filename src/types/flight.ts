export type FlightsDTO = {
    data: Flight[]
}

export type Flight = {
    id: string
    departuretime: number
    arrivaltime: number
    readable_departure: string
    readable_arrival: string
    origin: string
    destination: string
}