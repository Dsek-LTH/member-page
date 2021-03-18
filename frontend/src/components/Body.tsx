import React from 'react';

import { useKeycloak } from '@react-keycloak/web';
import { useAllNewsQuery, useMeHeaderQuery } from '../generated/graphql';

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


function News() {
  const { loading, data } = useAllNewsQuery();
  return (
    <div>
      <h1>Nyheter</h1>
      { loading ? (
        <p>loading news...</p>
      ) : ( data ? (
        data.news?.articles.map(article => (article) ? (
          <div key={article.id}>
            <h3>{article.header}</h3>
            <p>{article.body}</p>
            <p>Skriven av: {article.author.first_name} {article.author.last_name}</p>
            <p>skriven: {article.published_datetime}</p>
            {article.latest_edit_datetime &&
              <p>redigerad: {article.latest_edit_datetime}</p>
            }
          </div>
        ): (<div>söndrig nyhet</div>))
      ) : (
        <p>Misslyckades med att hämta nyheterna</p>
      ))}
    </div>
  )
}

function Data() {
  const { loading, data } = useMeHeaderQuery();
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