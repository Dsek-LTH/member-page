import { useQuery as useQueryApollo } from '@apollo/react-hooks';
import {DocumentNode} from 'graphql';

import { gqlString, gqlInt, gqlDatetime } from './Types';

export function useQuery<T>(query: DocumentNode, params?: T): {loading: boolean, data?: Query} {
  const { loading, error, data } = useQueryApollo<any, T>(query, params)
  try {
    return { loading, data: Query(data) }
  } catch(e) {
    return { loading }
  }
}

export interface Query {
  me?: Member,
  news: Article[]
}
export function Query(x: any): Query {
  return {
    me: Member(x.me),
    news: x.news?.map((a: any) => Article(a))
  }
}

export interface Member {
  id: gqlInt,
  student_id: gqlString,
  first_name: gqlString,
  nickname: gqlString,
  last_name: gqlString,
  class_programme: gqlString,
  class_year: gqlInt,
}
export function Member(m: any): Member {
  return {
    id: gqlInt(m.id),
    student_id: gqlString(m.student_id),
    first_name: gqlString(m.first_name),
    nickname: gqlString(m.nickname),
    last_name: gqlString(m.last_name),
    class_programme: gqlString(m.class_programme),
    class_year: gqlInt(m.class_year),
  }
}

export interface Article {
  id: gqlInt,
  body: gqlString,
  header: gqlString,
  author: Member,
  published_datetime: gqlDatetime,
  latest_edit_datetime?: gqlDatetime,
}
export function Article(a: any) {
  return {
    id: gqlInt(a.id),
    body: gqlString(a.body),
    header: gqlString(a.header),
    author: Member(a.author),
    published_datetime: gqlDatetime(a.published_datetime),
    latest_edit_datetime: gqlDatetime(a.latest_edit_datetime),
  }
}
