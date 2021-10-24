import * as React from 'react'
import { useApiAccessQuery } from '~/generated/graphql';

type apiContextReturn = {
    apis: Set<string>,
    apisLoading: boolean
}

const defaultContext: apiContextReturn = {
    apis: new Set(),
    apisLoading: true
}

const ApiAccessContext = React.createContext(defaultContext);

export function ApiAccessProvider({ children }) {
    const { loading: apisLoading, data } = useApiAccessQuery();

    const apis = new Set(data?.apiAccess?.map(api => api.name))

    return (
        <ApiAccessContext.Provider value={{
            apis,
            apisLoading
        }}
        >{children}</ApiAccessContext.Provider>
    )
}

export function useApiAccess() {
    const context = React.useContext(ApiAccessContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

export function hasAccess(context: apiContextReturn, name: string): boolean {
    return !context.apisLoading && context.apis.has(name)
}

export default ApiAccessContext;
