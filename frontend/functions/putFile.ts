import type { TFunction } from 'react-i18next';

const putFile = async (
  url:string,
  file:File,
  mime:string,
  showMessage: (
    message: string,
    severity: 'success' | 'info' | 'warning' | 'error'
  ) => void,
  t: TFunction,
) => {
  try {
    await fetch(url, {
      method: 'PUT',
      headers: {
        contentType: mime,
      },
      body: file,
    });
  } catch (error) {
    showMessage(t('common:error'), 'error');
  }
};

export default putFile;
