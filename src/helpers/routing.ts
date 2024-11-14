import { loadable } from "@/components/shared/Loadable"
import React from "react"
import { RouteObject } from "react-router"

export type RouteConfig = {
  path: string,
  import: () => Promise<any>
}
export const routesWithLazy = (routes: RouteConfig[]): RouteObject[] => {
  return routes.map(item => {
    const Cmp = loadable(item.import)
    return {
      path: item.path,
      element: React.createElement(Cmp)
    };
  })
}