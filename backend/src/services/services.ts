interface IDefinition {
  name: string,
  port: number,
  description: string,
}

const members: IDefinition = {
  name: 'members',
  port: 4001,
  description: "Handles requests related to members at the D guild",
}

const news: IDefinition = {
  name: 'news',
  port: 4002,
  description: "Handles requests related to news presented on the front page",
}


const serviceList = [members, news].map((service) => ({name: service.name, url: `http://localhost:${service.port}/graphql`}))

export {
  news as defNews,
  members as defMembers,
  serviceList,
};