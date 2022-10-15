import Resizer from 'react-image-file-resizer';
import dataURItoFile from './dataURItoFile';

const resizeProfilePicture = (file: File, fileName: string): Promise<File> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      500,
      500,
      'JPEG',
      100,
      0,
      (uri: string) => {
        resolve(dataURItoFile(uri, fileName));
      },
      'base64',
    );
  });

export default resizeProfilePicture;
