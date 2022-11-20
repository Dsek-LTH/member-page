import { Knex } from 'knex';
import { Article } from '~/src/types/news';
import { slugify } from '../../src/shared/utils';

export default async function insertArticles(
  knex: Knex,
  memberIds: string[],
  mandateIds: string[],
): Promise<string[]> {
  return (await knex<Article>('articles').insert([
    {
      header: 'Detta är en nyhet från maj',
      header_en: 'This is news from may',
      body: 'Detta är mer ingående information om nyheten',
      body_en: 'This more information about the news',
      author_id: mandateIds[0],
      author_type: 'Mandate',
      published_datetime: new Date('2020-05-20 12:20:02'),
      slug: slugify('Detta är en nyhet från maj'),
    }, {
      header: 'Detta är en redigerad nyhet',
      header_en: 'This is an edited article',
      body: 'Detta är mer ingående information om nyheten som är redigerad',
      body_en: 'This more information about the article that is edited',
      author_id: memberIds[0],
      published_datetime: new Date('2020-06-20 12:20:02'),
      latest_edit_datetime: new Date('2020-06-21 12:20:02'),
      slug: slugify('Detta är en redigerad nyhet'),
    }, {
      header: 'Detta är en nyhet från Fred',
      body: 'Detta är mer ingående information om nyheten från Fred',
      author_id: memberIds[1],
      published_datetime: new Date('2020-07-20 12:20:02'),
      slug: slugify('Detta är en nyhet från Fred'),
    },
    {
      header: 'Detta är en mycket lång nyhet från Oliver',
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sed sem in quam accumsan semper eget convallis neque. Vestibulum ut aliquam tellus. Mauris sit amet arcu tortor. In in sapien et lectus egestas lobortis non eu ipsum. Vestibulum lorem quam, aliquet ac lacus ut, viverra finibus diam. Praesent ac dui ut enim faucibus accumsan. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce malesuada eros sed semper gravida. Fusce tristique mattis lectus at interdum. Phasellus pellentesque lacus a tempor egestas. Sed ut augue vitae quam dignissim euismod et ac quam. Nunc bibendum tincidunt lacus quis accumsan.\n\nVivamus eu suscipit velit. Nullam condimentum urna nisi, eget tempus mi luctus vel. Vivamus sit amet odio ut lectus interdum blandit sed id sem. Maecenas tristique eget ipsum vitae tincidunt. Vivamus finibus arcu at metus fringilla, at ultricies tellus finibus. Ut laoreet, nisi quis eleifend lobortis, enim felis eleifend lacus, vel iaculis sapien enim vel leo. Quisque rutrum imperdiet lectus eu gravida. In hac habitasse platea dictumst.\n      \nSed pellentesque aliquet dolor, quis lacinia nulla fermentum vitae. Suspendisse enim tellus, sagittis et facilisis a, vulputate ac nulla. Morbi interdum lorem sapien, vitae vestibulum lacus ultricies ac. Sed sed nisi viverra quam blandit accumsan quis ut ex. Etiam sapien metus, viverra vitae tortor non, porttitor placerat tellus. Donec dolor ligula, vehicula ut ligula et, laoreet aliquet nibh. Aliquam cursus sed eros ut finibus. Aliquam eros eros, accumsan ac mauris non, aliquam convallis est. Fusce fermentum facilisis elementum. Nunc at porttitor velit. Vivamus ut nulla at eros tincidunt commodo. Donec sed metus vitae turpis semper elementum id quis elit. Donec nibh mauris, sodales sit amet enim eget, bibendum consectetur nisi. Aliquam aliquam et est eget hendrerit.\n      \nPellentesque ac lacus id lacus pretium placerat et et nulla. Morbi enim est, consectetur non luctus ut, eleifend id felis. Suspendisse potenti. Maecenas euismod, turpis in sagittis egestas, magna ligula tempus lacus, sollicitudin tristique libero mi a mauris. Sed accumsan, eros vitae fringilla scelerisque, lectus lacus tincidunt est, eu tempor ligula velit ac dui. Maecenas ultrices lectus sapien, nec faucibus dolor varius eget. Nunc sed purus varius, lobortis urna finibus, lobortis sapien. Sed ut magna semper, eleifend lectus non, pretium metus. Aliquam ac efficitur ligula, nec fringilla erat. Donec eu vulputate libero, auctor ornare mi. Mauris accumsan enim a elit gravida semper. Sed non convallis lectus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent maximus, est sed bibendum pretium, lorem nulla ullamcorper erat, in auctor nisi lectus in sem. Nulla facilisi. Nulla vulputate feugiat ex, ut sodales purus suscipit a.\n      \nDonec molestie nunc lacus, id mattis nunc scelerisque eu. Aliquam pharetra nec sapien aliquam facilisis. Etiam ut placerat tortor. Suspendisse ac consequat libero, a dignissim dui. Donec porta molestie pharetra. Vestibulum vestibulum viverra sapien nec efficitur. Vivamus id lectus non velit tincidunt scelerisque. Nulla facilisi. Mauris vulputate, eros vel commodo pulvinar, mauris turpis faucibus mauris, convallis ullamcorper nisi felis in dolor. Maecenas posuere justo et nibh iaculis ornare. Fusce dignissim urna ut nulla consectetur, et finibus mi pellentesque. Nullam sagittis porta justo, pulvinar luctus ante egestas sed. Cras aliquet bibendum tempus. Suspendisse at posuere lorem.\n      \nProin vulputate nisl in urna tempus, ut varius sapien lobortis. Donec fringilla, sapien ac blandit pellentesque, ante velit maximus erat, auctor mollis leo ligula nec mauris. Proin sagittis metus in vestibulum molestie. Proin sagittis lectus non ipsum vulputate, in mattis purus posuere. Praesent ut odio eu nisi interdum placerat sed et metus. Nulla tristique at nisl non ultrices. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras posuere rhoncus tellus, at tempor nisi vehicula vitae. Pellentesque scelerisque sapien in bibendum rhoncus.\n      \nAliquam consequat sodales quam, quis scelerisque risus consequat eget. Aliquam erat volutpat. Integer non semper eros. Integer suscipit ut sem vel interdum. Suspendisse pellentesque hendrerit nibh. Pellentesque varius ipsum non feugiat sollicitudin. In eget sem finibus, ullamcorper lacus quis, pretium est. Phasellus fringilla turpis ac nisl efficitur malesuada. Maecenas id fringilla dolor, in viverra ante. Donec velit odio, luctus in bibendum vitae, feugiat non diam. Curabitur magna tellus, varius vel odio quis, suscipit volutpat ligula. Cras efficitur metus velit, id aliquam tellus aliquam eu. Nunc metus ante, eleifend ac ornare sed, fermentum a ipsum.\n      \nCras rutrum ipsum id diam porta blandit. Praesent tristique augue vel congue varius. Aenean ex tellus, dignissim non leo quis, vehicula lobortis elit. Curabitur hendrerit nunc ut tortor porta, et tempor erat viverra. Fusce laoreet condimentum libero, quis condimentum mauris rhoncus ac. Duis nec enim et nibh elementum pretium. Proin eu volutpat tellus. Nullam eget enim sagittis, pulvinar nunc sed, imperdiet justo.\n      \nNam non egestas turpis. Cras in leo in lectus vehicula tristique et ac ipsum. Vestibulum egestas urna eget dui rhoncus ultrices at sit amet urna. Praesent et mauris a velit condimentum sodales ac eu nunc. Ut vel viverra purus. Integer id lacus a libero viverra pretium in ut lectus. Aliquam consectetur nisl orci, at porta nisi pretium vel. Praesent dignissim purus et magna hendrerit tristique. Suspendisse at sapien nec odio commodo facilisis at non sapien. In non sem gravida, dictum eros cursus, condimentum mauris. Quisque ultricies, nibh id tincidunt euismod, eros ligula imperdiet quam, id posuere lorem metus ut ipsum. Praesent finibus finibus sem. Donec venenatis metus non tortor imperdiet, eget sollicitudin mi facilisis. Cras maximus molestie quam, a condimentum ligula suscipit non.\n      \nUt consectetur arcu eget quam fermentum, a ultrices turpis aliquet. Vestibulum molestie mi varius turpis consectetur, at ullamcorper neque sodales. Fusce ullamcorper erat ut nisi malesuada pretium. Sed libero turpis, euismod sit amet bibendum et, auctor quis nulla. Mauris porta vitae ex id tincidunt. Vivamus vitae porttitor ipsum. Quisque purus nulla, venenatis non dapibus vel, malesuada a nibh. Maecenas aliquet enim in urna accumsan, eu feugiat ante sagittis. Pellentesque in tristique augue. Morbi quis purus ac diam pellentesque condimentum vitae sed libero.',
      author_id: memberIds[5],
      published_datetime: new Date('2020-07-21 12:20:02'),
      slug: slugify('Detta är en mycket lång nyhet från Oliver'),
    },
  ]).returning('id')).map((v) => v.id);
}
