import 'mocha';
import mockDb from 'mock-knex';
import { expect } from 'chai';

import { context, knex } from 'dsek-shared';
import DocumentsAPI from '../src/datasources/FileHandler';
import { UserInputError } from 'apollo-server-errors';