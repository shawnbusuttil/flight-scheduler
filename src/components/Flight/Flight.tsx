import React from "react"

import "./Flight.scss"

type Props = {
    id: string
    origin: string
    originTime: string
    destination: string
    destinationTime: string
    isActive?: boolean
    onSelect?: (id: string) => void
}

export const Flight = ({ 
    id,
    origin,
    originTime,
    destination,
    destinationTime,
    isActive = false,
    onSelect
}: Props) => {
    return <div className={["flight", onSelect ? "selectable" : "", isActive ? "active" : ""].join(" ")} 
        onClick={onSelect ? () => onSelect(id) : undefined}>
        <div className="flight-name">{id}</div>
        <div className="flight-info">
            <div className="flight-info-origin">
                <div>{origin}</div>
                <div>{originTime}</div>
            </div>
            <div className="flight-info-destination">
                <div>{destination}</div>
                <div>{destinationTime}</div>
            </div>
        </div>
    </div>
}