import React from 'react';

import { useKeycloak } from '@react-keycloak/web';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

interface Member {
  id: string,
  name: string,
  stil_id: string
}
const GET_ME = gql`
  {
    me {
      name
      stil_id
      programme
      first_year
    }
  }
`;
export function Body() {
  const [keycloak, initialized] = useKeycloak();
  return (
    <div>
      {keycloak.authenticated &&
      <Data/>}
    <div>
      <News/>
    </div>
    </div>
  )
}

interface Article {
  article_id: number,
  header: String,
  body: String,
  author: Member,
  published_datetime: String,
  latest_edit_datetime: String,
}

const GET_NEWS = gql`
{
  news {
    article_id
    header
    body
    author {
      name
    }
    published_datetime
    latest_edit_datetime
  }
}
`;

function News() {
  const { loading, data } = useQuery<{ news: Article[]}, null>(GET_NEWS);
  return (
    <div>
      <h1>Nyheter</h1>
      { loading ? (
        <p>loading news...</p>
      ) : ( data ? (
        data.news.map(article => (
          <div key={article.article_id}>
            <h3>{article.header}</h3>
            <p>{article.body}</p>
            <p>Skriven av: {article.author.name}</p>
            <p>skriven: {article.published_datetime}</p>
            {article.latest_edit_datetime &&
              <p>redigerad: {article.latest_edit_datetime}</p>
            }
          </div>
        ))
      ) : (
        <p>Misslyckades med att hämta nyheterna</p>
      ))}
    </div>
  )
}

function Data() {
  const { loading, data } = useQuery<{me: Member}, null>(GET_ME);
  return (
    <div>
      <h1>Inloggad som</h1>
    { loading ? (
      <p>loading...</p>
    ) : ( data ? (
    <div>
      <p>Namn: {data.me.name}</p>
      <p>Stil-ID: {data.me.stil_id}</p>
    </div>
    ) : (
      <p>Misslyckades med att hämnta den inloggade</p>
    ))}
    </div>
  )
}

export default Body;