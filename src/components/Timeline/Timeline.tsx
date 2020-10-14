import React, { Fragment } from "react"

import "./Timeline.scss"

type Props = {
    data: any[]
    start: string
    end: string
    total: number
    startLabel?: string
    midLabel?: string
    endLabel?: string
    primaryColor?: string
    accentColor?: string
    defaultColor?: string
}

export const Timeline = ({
    data,
    start,
    end,
    total,
    startLabel,
    midLabel,
    endLabel,
    primaryColor = "lightgreen",
    accentColor = "plum",
    defaultColor = "grey"

}: Props) => {
    const getPercentage = (s1: number, s2: number) => {
        return ((s2 - s1) / 86400) * 100 + "%"
    }

    return (
        <>
            <div className="timeline-labels">
                {<span className="timeline-labels-start">{startLabel}</span>}
                {<span className="timeline-labels-mid">{midLabel}</span>}
                {<span className="timeline-labels-end">{endLabel}</span>}
            </div>
            <div className="timeline-bar">
                <div style={{ 
                    backgroundColor: defaultColor, 
                    width: getPercentage(0, data.length ? data[0][start] - 1 : total/2) 
                }}></div>
                {data.length ? data.map((i, idx) => {
                    return <Fragment key={idx}>
                        <div style={{ backgroundColor: primaryColor, width: getPercentage(i[start], i[end]) }}></div>
                        {data[idx + 1] ? <div style={{ 
                            backgroundColor: accentColor, 
                            width: getPercentage(i[end] + 1, data[idx + 1][start] - 1) }}
                        ></div> : null}
                    </Fragment>
                }) : null}
                <div style={{ 
                    backgroundColor: defaultColor, 
                    width: getPercentage(data.length ? data[data.length - 1][end] + 1 : total/2 + 1, total) 
                }}></div>
            </div>
        </>
    )
}