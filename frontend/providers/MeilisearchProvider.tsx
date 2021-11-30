import React from 'react'
import { MeiliSearch } from 'meilisearch';

type meilisearchContextReturn = {
    client: MeiliSearch,
}

const client = new MeiliSearch({
    host: process.env.NEXT_PUBLIC_MEILI_HOST,
    apiKey: process.env.NEXT_PUBLIC_MEILI_MASTER_KEY,
});

const defaultContext: meilisearchContextReturn = {
    client: undefined,
}

const MeilisearchContext = React.createContext(defaultContext);

export function MeilisearchProvider({ children }) {
    return (
        <MeilisearchContext.Provider value={{
            client,
        }}
        >{children}</MeilisearchContext.Provider>
    )
}

export function useMeilisearch() {
    const context = React.useContext(MeilisearchContext)
    if (context === undefined) {
        throw new Error('useMeilisearch must be used within a MeilisearchProvider')
    }
    return context
}

export default MeilisearchContext;