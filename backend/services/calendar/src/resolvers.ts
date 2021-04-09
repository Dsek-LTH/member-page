import { AuthenticationError } from 'apollo-server';
import { context } from 'dsek-shared';
import { createSourceEventStream } from 'graphql';
import { getEffectiveTypeParameterDeclarations } from 'typescript';
import { getEvent, getEvents, createEvent, updateEvent, removeEvent, DbEvent } from './db';
import * as gql from './typeDefs';

export default {
  Query: {
    event({}, {id} : {id: number}){
      return getEvent(id);
    },
    events({}, {filter}: {filter: EventFilter}){
      return getEvents(filter);
    }
  },
  Mutation: {
    event: () => ({})
  },
  EventMutations: {
    create: ({}, {input}: {input: DbEvent}, {user}: {user: context.UserContext}) => {
      return createEvent(input.title, input.description, input.link, input.start_datetime, input.end_datetime);
    },
    update: ({}, {id, input}: {id: number, input: DbEvent}, {user}: {user: context.UserContext}) => {
      return updateEvent(id, input.title, input.description, input.link, input.start_datetime, input.end_datetime);
    },
    remove: ({}, {id}: {id: number}, {user}: {user: context.UserContext}) => {
      return removeEvent(id);
    },
  },
};
