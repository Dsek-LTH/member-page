import React from 'react';
import { useMeHeaderQuery } from '../../generated/graphql';

export default function Data() {
    const { loading, data } = useMeHeaderQuery();
    return (
      <div>
        <h1>Inloggad som</h1>
        { loading ? (
          <p>loading...</p>
        ) : (data?.me ? (
          <div>
            <p>Namn: {data.me.first_name} {data.me.last_name}</p>
            <p>Stil-ID: {data.me.student_id}</p>
            <img src={`http://localhost:4000${data.me.picture_path}`} alt="profilbild" />
          </div>
        ) : (
            <p>Misslyckades med att hämnta den inloggade</p>
          ))}
      </div>
    )
  }