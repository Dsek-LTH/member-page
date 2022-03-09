import 'mocha';
import mockDb from 'mock-knex';
import { expect } from 'chai';

import { context, knex } from 'dsek-shared';
import SongsAPI from '../src/datasources/Songs';
import { UserInputError } from 'apollo-server-errors';