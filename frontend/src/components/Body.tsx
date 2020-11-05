import React from 'react';

import { useKeycloak } from '@react-keycloak/web';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

interface Member {
  id: number,
  student_id?: string,
  first_name?: string,
  nickname?: string,
  last_name?: string,
  class_programme?: string,
  class_year?: number,
  picture_path?: string,
}
const GET_ME = gql`
  {
    me {
      first_name
      last_name
      student_id
      class_programme
      class_year
      picture_path
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
    id
    header
    body
    author {
      first_name
      last_name
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
            <p>Skriven av: {article.author.first_name} {article.author.last_name}</p>
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
    ) : ( data?.me ? (
    <div>
      <p>Namn: {data.me.first_name} {data.me.last_name}</p>
      <p>Stil-ID: {data.me.student_id}</p>
      <img src={`http://localhost:4000${data.me.picture_path}`}/>
    </div>
    ) : (
      <p>Misslyckades med att hämnta den inloggade</p>
    ))}
    </div>
  )
}

export default Body;