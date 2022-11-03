import { ReactNode } from 'react';
import { ApiAccessContext } from '~/providers/ApiAccessProvider';

export type NavigationItem = {
  translationKey: string,
  path: string,
  icon: ReactNode,
  children?: NavigationItem[]
  hasAccess: (context: ApiAccessContext) => boolean
};
