import React from "react"
import { Outlet } from "react-router"

export type DefaultLayoutProps = {
  children?: React.ReactNode
}
export const DefaultLayout = (props: DefaultLayoutProps) => (
  <div>
    Default Layout:
    <Outlet/>
  </div>
)