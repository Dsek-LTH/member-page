const definitions = {
  members: {
    port: 4001,
    description: "Handles requests related to members at the D guild",
  },
  news: {
    port: 4002,
    description: "Handles requests related to news presented on the front page",
  }
}

const serviceList = Object.keys(definitions).map((name) => ({name: name, url: `http://localhost:${definitions[name].port}/graphql`}))

module.exports = {
  definitions,
  serviceList,
}