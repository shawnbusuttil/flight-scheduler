import React from "react"

import "./Aircraft.scss"

type Props = {
    id: string
    usage: number
}

export const Aircraft = ({ id, usage }: Props) => {
    return <div className="aircraft">
        <div>{id}</div>
        <div>({usage.toFixed(2)}%)</div>
    </div>
}