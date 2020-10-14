import React, { useState } from "react"
import { Modal } from "antd"

import { Aircraft as AircraftItem } from "../Aircraft/Aircraft"
import { Flight as FlightItem } from "../Flight/Flight"
import { LoadingBox } from "../LoadingBox/LoadingBox"
import { DataList } from "../DataList/DataList"
import { Timeline } from "../Timeline/Timeline"

import { useAircrafts } from "../../hooks/useAircrafts"
import { useFlights } from "../../hooks/useFlights"

import { Aircraft } from "../../types/aircraft"
import { Flight } from "../../types/flight"

import { getDiffInMinutes, getTomorrowString, SECONDS_IN_A_DAY } from "../../utils/date"

import "./FlightScheduler.scss"

export const FlightScheduler = () => {
    const { aircrafts } = useAircrafts()
    const { flights } = useFlights()

    const [rotation, setRotation] = useState<Flight[]>([])
    const [showInstructions, setShowInstructions] = useState(false)

    const addToRotation = (id: string) => {
        const idx = flights!.findIndex(f => f.id === id)
        
        if (idx === -1) {
            return
        }

        if (!rotation.length) {
            setRotation([...rotation, flights![idx]])
            return
        }

        const lastRotation = rotation[rotation.length - 1]

        const lastArrivalTime = new Date().setTime(lastRotation.arrivaltime)
        const nextDepartureTime = new Date().setTime(flights![idx].departuretime)
        const nextArrivalTime = new Date().setTime(flights![idx].arrivaltime)

        const lastAirport = lastRotation.destination
        const nextAirport = flights![idx].origin

        if (getDiffInMinutes(nextDepartureTime, lastArrivalTime) >= 20 && 
            lastAirport === nextAirport && 
            nextArrivalTime <= SECONDS_IN_A_DAY
        ) {
            setRotation([...rotation, flights![idx]])
        } else {
            setShowInstructions(true)
        }
    }

    const removeFromRotation = () => {
        setRotation([...rotation.slice(0, rotation.length - 1)])
    }

    const getUtilization = () => {
        const seconds = rotation.reduce((sum, i) => {
            return sum + (i.arrivaltime - i.departuretime)
        }, 0)
        return (seconds / SECONDS_IN_A_DAY) * 100
    }

    return <>
        <div className="flight-scheduler">
            <div>{getTomorrowString()}</div>
            <div className="flight-scheduler-view">
                <div className="flight-scheduler-view-aircrafts">
                    {aircrafts ? <DataList title="Aircrafts" data={aircrafts} renderItem={(item: Aircraft) => (
                        <AircraftItem key={item.ident} id={item.ident} usage={rotation.length && getUtilization()} />
                    )} /> : <LoadingBox height="100vh" />}
                </div>
                <div className="flight-scheduler-view-rotation">
                    {aircrafts ? <DataList title={`Rotation ${aircrafts[0].ident}`} data={rotation} renderItem={(item: Flight) => (
                        <FlightItem key={item.id} id={item.id}
                            origin={item.origin} originTime={item.readable_departure}
                            destination={item.destination} destinationTime={item.readable_arrival}
                            onSelect={
                                rotation.findIndex(r => r.id === item.id) === rotation.length - 1
                                    ? () => removeFromRotation()
                                    : undefined
                            }
                        />
                    )} /> : <LoadingBox height="100vh" />}
                    <Timeline data={rotation || []} start="departuretime" end="arrivaltime" total={SECONDS_IN_A_DAY}
                        startLabel="0:00" midLabel="12:00" endLabel="0:00" />
                </div>
                <div className="flight-scheduler-view-flights">
                    {flights ? <DataList title="Flights" data={flights} renderItem={(item: Flight) => (
                        <FlightItem key={item.id} id={item.id} 
                            origin={item.origin} originTime={item.readable_departure}
                            destination={item.destination} destinationTime={item.readable_arrival}
                            onSelect={!rotation.includes(item) ? addToRotation : undefined} 
                            isActive={rotation.includes(item)}
                        />
                    )} /> : <LoadingBox height="100vh" />}
                </div>
            </div>
        </div>
        <Modal visible={showInstructions} onOk={() => setShowInstructions(false)} closable={false}
            cancelButtonProps={{ style: { display: "none" }}}>
          <div>This is an invalid selection. Make sure your rotation adheres to the following rules:</div>
          <ul>
              <li>There should be at least 20 minutes between last arrival time and new departure date.</li>
              <li>The plane should be on the ground by midnight.</li>
              <li>The last destination's airport should match the origin's airport of the new selection.</li>
          </ul>
        </Modal> 
    </>
}