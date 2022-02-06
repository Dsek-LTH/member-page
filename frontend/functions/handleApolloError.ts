import type { ApolloError } from '@apollo/client/errors';
import type { TFunction } from 'next-i18next';

const handleApolloError = (
  apolloError: ApolloError,
  showMessage: (
    message: string,
    severity: 'success' | 'info' | 'warning' | 'error'
  ) => void,
  t: TFunction,
  genericErrorKey: string = 'common:error',
) => {
  const { graphQLErrors, message } = apolloError;
  // eslint-disable-next-line no-console
  console.error(message);
  graphQLErrors.forEach((error) => {
    switch (error.extensions.code) {
      case 'FORBIDDEN':
        showMessage(t('common:no_permission_action'), 'error');
        break;
      default:
        showMessage(t(genericErrorKey), 'error');
        break;
    }
  });
};

export default handleApolloError;
