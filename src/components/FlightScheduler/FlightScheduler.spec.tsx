import React from "react"
import axios from "axios"
import { 
    cleanup, 
    fireEvent, 
    render, 
    waitFor 
} from "@testing-library/react"

import { FlightScheduler } from "./FlightScheduler"

import { SECONDS_IN_A_DAY } from "../../utils/date"

const axiosMock = axios as jest.Mocked<typeof axios>

describe("FlightScheduler", () => {
    beforeEach(() => {
        axiosMock.get.mockImplementation((url: string) => {
            if (url.includes("flights")) {
                return Promise.resolve({ 
                    data: {
                        data: [
                            {"id":"AS1001","departuretime":21600,"arrivaltime":26100,"readable_departure":"06:00","readable_arrival":"07:15","origin":"LFSB","destination":"LFMN"},
                            {"id":"AS1002","departuretime":27900,"arrivaltime":32100,"readable_departure":"07:45","readable_arrival":"08:55","origin":"LFMN","destination":"LFSB"},
                            {"id":"AS1025","departuretime":22800,"arrivaltime":28200,"readable_departure":"06:20","readable_arrival":"07:50","origin":"LFSB","destination":"EDDH"},
                            {"id":"AS1026","departuretime":30000,"arrivaltime":35100,"readable_departure":"08:20","readable_arrival":"09:45","origin":"EDDH","destination":"LFSB"},
                            {"id":"AS1027","departuretime":35100,"arrivaltime":40500,"readable_departure":"09:45","readable_arrival":"11:15","origin":"LFSB","destination":"EDDH"},
                            {"id":"AS1028","departuretime":42300,"arrivaltime":47400,"readable_departure":"11:45","readable_arrival":"13:10","origin":"EDDH","destination":"LFSB"},
                            {"id":"AS1043","departuretime":27900,"arrivaltime":33600,"readable_departure":"07:45","readable_arrival":"09:20","origin":"LFSB","destination":"EHAM"},
                            {"id":"AS1044","departuretime":21600,"arrivaltime":26100,"readable_departure":"06:00","readable_arrival":"07:15","origin":"EHAM","destination":"LFSB"},
                            {"id":"AS1057","departuretime":36900,"arrivaltime":43500,"readable_departure":"10:15","readable_arrival":"12:05","origin":"LFSB","destination":"LEPA"},
                            {"id":"AS1058","departuretime":45600,"arrivaltime":52800,"readable_departure":"12:40","readable_arrival":"14:40","origin":"LEPA","destination":"LFSB"},
                        ]
                    }
                })
            }
            if (url.includes("aircrafts")) {
                return Promise.resolve({ 
                    data: {
                        data: [{
                            "ident": "GABCD",
                            "type": "A320",
                            "base": "EGKK"
                        }]
                    }
                })
            }


            return Promise.resolve(null)
        })
    })

    test("As a user I should see the aircrafts I can choose from", async() => {
        const { getByText } = render(<FlightScheduler />)

        await waitFor(() => expect(axiosMock.get).toHaveBeenCalledTimes(2))
        expect(getByText("GABCD")).toBeInTheDocument()
    })

    test("As a user I can see the flights I can choose from to create my rotation", async() => {
        const { getByText } = render(<FlightScheduler />)

        await waitFor(() => expect(axiosMock.get).toHaveBeenCalledTimes(2))
        expect(getByText("AS1001")).toBeInTheDocument()
        expect(getByText("AS1002")).toBeInTheDocument()
        expect(getByText("AS1025")).toBeInTheDocument()
    })

    test("As a user I can see the rotation update whenever I add or remove a flight", async() => {
        const { getByText, getAllByText } = render(<FlightScheduler />)

        await waitFor(() => expect(axiosMock.get).toHaveBeenCalledTimes(2))
        
        expect(getAllByText("AS1001")).toHaveLength(1)
        fireEvent.click(getByText("AS1001"))
        expect(getAllByText("AS1001")).toHaveLength(2)
        fireEvent.click(getAllByText("AS1001")[0])
        expect(getAllByText("AS1001")).toHaveLength(1)
    })

    test("As a user I can see the aircraft utlization percentage update whenever I add or remove a flight", async() => {
        const { getByText, getAllByText } = render(<FlightScheduler />)

        await waitFor(() => expect(axiosMock.get).toHaveBeenCalledTimes(2))
        
        expect(getByText("(0.00%)")).toBeInTheDocument()
        fireEvent.click(getByText("AS1001"))

        const percentage = (((26100 - 21600) / SECONDS_IN_A_DAY) * 100).toFixed(2)
        expect(getByText(`(${percentage}%)`)).toBeInTheDocument()

        fireEvent.click(getAllByText("AS1001")[0])
        expect(getByText("(0.00%)")).toBeInTheDocument()
    })

    afterEach(() => {
        axiosMock.get.mockReset()
        cleanup()
    })
})