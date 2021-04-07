import { AuthenticationError } from 'apollo-server';
import { context } from 'dsek-shared';
import { getEffectiveTypeParameterDeclarations } from 'typescript';
import { getEvent, getEvents } from './db';

export default {
  Query: {
    event({}, {id} : {id: number}){
      return getEvent(id);
    },
    events({},{}){
      return getEvents();
    }
  }
};