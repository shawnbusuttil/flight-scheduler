export type AircraftDTO = {
    data: Aircraft[]
}

export type Aircraft = {
    ident: string
    type: string
    economySeats: number
    base: string
}