import { useEffect, useState } from "react"

import flightsApi from "../api/flights"
import { Flight, FlightsDTO } from "../types/flight"

export const useFlights = () => {
    const [flights, setFlights] = useState<Flight[]>()
    const [error, setError] = useState<Error>()

    const fetchFlights = async() => {
        try {
            const response = await flightsApi.get<FlightsDTO>("/flights")
            setFlights(response.data.data)
        } catch (e) {
            setError(e)
        }
    }

    useEffect(() => {
        fetchFlights()
    }, [])

    return { flights, error }
}