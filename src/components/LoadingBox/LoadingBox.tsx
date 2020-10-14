import React from "react"
import { Spin } from "antd"

import "./LoadingBox.scss"

export const LoadingBox = ({ height }: { height: string }) => (
    <div className="box" style={{ height }}>
        <Spin size="large"/>
    </div>
)