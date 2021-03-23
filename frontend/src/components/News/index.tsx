import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { useNewsPageQuery } from '../../generated/graphql';
import Article from './article';

export default function NewsPage() {

    const [page_number, set_page_number] = useState(0);
    
    const { loading, data } = useNewsPageQuery({
        variables: {page_number: page_number, per_page: 3}
      });

    return (
      <div>
          {
              /*<button onClick={()=> set_page_number(prev_page_number => prev_page_number + 1)}>Test</button>*/
          }
        { loading ? (
          <p>loading news...</p>
        ) : ( data ? (
          data.news?.articles.map(article => (article) ? (
            
            <article key={article.id}>
            <Article 
            title={article.header} 
            publish_date={article.published_datetime} 
            image_url={undefined} 
            author={article.author.first_name + " " + article.author.last_name}
            id={article.id.toString()}>
                {article.body}
            </Article>
           <Article  id={article.id.toString()} title={article.header}publish_date={article.published_datetime} image_url={"http://placekitten.com/800/400"} author={article.author.first_name + " " + article.author.last_name} >
                {article.body}
            </Article>
            </article>
          ): (<div>söndrig nyhet</div>))
        ) : (
          <p>Misslyckades med att hämta nyheterna</p>
        ))}
      </div>
    )
  }