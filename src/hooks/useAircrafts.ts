import { useEffect, useState } from "react"

import flightsApi from "../api/flights"
import { Aircraft, AircraftDTO } from "../types/aircraft"

export const useAircrafts = () => {
    const [aircrafts, setAircrafts] = useState<Aircraft[]>()
    const [error, setError] = useState<Error>()

    async function fetchAircrafts() {
        try {
            const response = await flightsApi.get<AircraftDTO>("/aircrafts")
            setAircrafts(response.data.data)
        } catch (e) {
            setError(e)
        }
    }
    useEffect(() => {
        fetchAircrafts()
    }, [])

    return { aircrafts, error }
}