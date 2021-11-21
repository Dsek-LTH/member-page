import { ReactNode } from "react";


export type NavigationItem = {
    translationKey:string,
    path:string,
    icon: ReactNode,
    children?: NavigationItem[]
}