import * as React from 'react'
import { useMeHeaderQuery, Member } from '~/generated/graphql';

type userContextReturn = {
    user: Member,
    loading: boolean
}

const defaultContext:userContextReturn = {
    user: undefined,
    loading: true
}

const UserContext = React.createContext(defaultContext);

export function UserProvider({ children }) {
    const { loading, data } = useMeHeaderQuery();
    const user = data?.me || undefined;

    return (
        <UserContext.Provider value={{
            user,
            loading
        }}
        >{children}</UserContext.Provider>
    )
}

export function useUser() {
    const context = React.useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

export default UserContext;