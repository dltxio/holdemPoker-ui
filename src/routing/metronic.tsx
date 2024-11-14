import { Logout } from "@/metronic/app/modules/auth";
import { ErrorsPage } from "@/metronic/app/modules/errors/ErrorsPage";
import { PrivateRoutes } from "@/metronic/app/routing/PrivateRoutes";
import { RouteObject } from "react-router";

export const MetronicRoute: RouteObject = {
  path: 'kt',
  children: [
    {
      path: 'error/*',
      element: <ErrorsPage/>
    },
    {
      path: 'logout',
      element: <Logout/>
    },
    {
      path: '*',
      element: <PrivateRoutes/>
    }
  ]
}
