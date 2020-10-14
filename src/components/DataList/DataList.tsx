import React from "react"

import "./DataList.scss"

type Props = {
    data: any[],
    title: string
    renderItem: (item: any) => React.ReactNode
}

export const DataList = ({
    data,
    title,
    renderItem
}: Props) => {
    return <div className="list">
        <div className="list-title">{title}</div>
        <div className="list-items">
            {data.map(item => renderItem(item))}
        </div>
    </div>
}