import { ChonkyIconName, defineFileAction } from 'chonky';

export const renameFileId = 'rename_file';

const RenameFile = (t) => defineFileAction({
  id: renameFileId,
  button: {
    name: t('chonky.actions.RenameFile.id.button.name'),
    toolbar: true,
    contextMenu: true,
    group: 'Actions',
    icon: ChonkyIconName.word,
  },
} as const);

export default RenameFile;
