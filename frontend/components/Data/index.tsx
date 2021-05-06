import React, { useContext }from 'react';
import UserContext from '~/providers/UserProvider';

export default function Data() {
  const {user, loading} = useContext(UserContext);
    return (
      <div>
        <h1>Inloggad som</h1>
        { loading ? (
          <p>loading...</p>
        ) : (user ? (
          <div>
            <p>Namn: {user.first_name} {user.last_name}</p>
            <p>Stil-ID: {user.student_id}</p>
            <img src={`http://localhost:4000${user.picture_path}`} alt="profilbild" />
          </div>
        ) : (
            <p>Misslyckades med att hämnta den inloggade</p>
          ))}
      </div>
    )
  }