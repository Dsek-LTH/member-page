//Base types in GraphQL
export type gqlInt = number | undefined;
export function gqlInt(x: any) : gqlInt {return (x) ? parseInt(x) : undefined}
export type gqlFloat = number | undefined;
export function gqlFloat(x: any) : gqlFloat {return (x) ? parseFloat(x) : undefined}
export type gqlString = string | undefined;
export function gqlString(x: any) : gqlString {return (x) ? x.toString() : undefined}
export type gqlID = string | undefined;
export function gqlID(x: any) : gqlID {return (x) ? x.toString() : undefined}
export type gqlBoolean = boolean | undefined;
export function gqlBoolean(x: any) : gqlBoolean {return (x) ? x == true : undefined}

//Custom scalars
export type gqlDatetime = Date | undefined;
export function gqlDatetime(x: any) : gqlDatetime {return (x) ? new Date(x) : undefined}
