import { ReactNode } from 'react';
import { apiContextReturn } from '~/providers/ApiAccessProvider';

export type NavigationItem = {
    translationKey: string,
    path: string,
    icon: ReactNode,
    children?: NavigationItem[]
    hasAccess: (context: apiContextReturn) => boolean
}
