import { ReactNode } from "react";


export type NavigationItem = {
    text:string,
    path:string,
    icon: ReactNode,
    children?: NavigationItem[]
}