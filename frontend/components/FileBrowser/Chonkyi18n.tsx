import {
  ChonkyActions, FileData, FileHelper, I18nConfig,
} from 'chonky';
import { i18n } from 'next-i18next';
import { IntlShape } from 'react-intl';

const Chonkyi18n = (t): I18nConfig => ({
  locale: i18n.language,
  formatters: {
    formatFileModDate: (intl: IntlShape, file: FileData | null) => {
      const safeModDate = FileHelper.getModDate(file);
      if (safeModDate) {
        return `${intl.formatDate(safeModDate)}, ${intl.formatTime(
          safeModDate,
        )}`;
      }
      return null;
    },
    /* formatFileSize: (intl: IntlShape, file: FileData | null) => {
            if (!file || typeof file.size !== 'number') return null;
            return `${file.size} Bytes`;
        }, */
  },
  messages: {
    // Chonky UI translation strings. String IDs hardcoded into Chonky's source code.
    'chonky.toolbar.searchPlaceholder': t('fileBrowser:chonky.toolbar.searchPlaceholder'),
    'chonky.toolbar.visibleFileCount': t('fileBrowser:chonky.toolbar.visibleFileCount'),
    'chonky.toolbar.selectedFileCount': t('fileBrowser:chonky.toolbar.selectedFileCount'),
    'chonky.toolbar.hiddenFileCount': t('fileBrowser:chonky.toolbar.hiddenFileCount'),
    'chonky.fileList.nothingToShow': t('fileBrowser:chonky.fileList.nothingToShow'),
    'chonky.contextMenu.browserMenuShortcut': t('fileBrowser:chonky.contextMenu.browserMenuShortcut'),

    // File action translation strings. These depend on which actions you have
    // enabled in Chonky.
    'chonky.actionGroups.Actions': t('fileBrowser:chonky.actionGroups.Actions'),
    'chonky.actionGroups.Options': t('fileBrowser:chonky.actionGroups.Options'),
    [`chonky.actions.${ChonkyActions.OpenParentFolder.id}.button.name`]: t('fileBrowser:chonky.actions.ChonkyActions.OpenParentFolder.id.button.name'),
    [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.name`]: t('fileBrowser:chonky.actions.ChonkyActions.CreateFolder.id.button.name'),
    [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.tooltip`]: t('fileBrowser:chonky.actions.ChonkyActions.CreateFolder.id.button.tooltip'),
    [`chonky.actions.${ChonkyActions.DeleteFiles.id}.button.name`]: t('fileBrowser:chonky.actions.ChonkyActions.DeleteFiles.id.button.name'),
    [`chonky.actions.${ChonkyActions.OpenSelection.id}.button.name`]: t('fileBrowser:chonky.actions.ChonkyActions.OpenSelection.id.button.name'),
    [`chonky.actions.${ChonkyActions.SelectAllFiles.id}.button.name`]: t('fileBrowser:chonky.actions.ChonkyActions.SelectAllFiles.id.button.name'),
    [`chonky.actions.${ChonkyActions.ClearSelection.id}.button.name`]: t('fileBrowser:chonky.actions.ChonkyActions.ClearSelection.id.button.name'),
    [`chonky.actions.${ChonkyActions.EnableListView.id}.button.name`]: t('fileBrowser:chonky.actions.ChonkyActions.EnableListView.id.button.name'),
    [`chonky.actions.${ChonkyActions.EnableGridView.id}.button.name`]: t('fileBrowser:chonky.actions.ChonkyActions.EnableGridView.id.button.name'),
    [`chonky.actions.${ChonkyActions.SortFilesByName.id}.button.name`]: t('fileBrowser:chonky.actions.ChonkyActions.SortFilesByName.id.button.name'),
    [`chonky.actions.${ChonkyActions.SortFilesBySize.id}.button.name`]: t('fileBrowser:chonky.actions.ChonkyActions.SortFilesBySize.id.button.name'),
    [`chonky.actions.${ChonkyActions.SortFilesByDate.id}.button.name`]: t('fileBrowser:chonky.actions.ChonkyActions.SortFilesByDate.id.button.name'),
    [`chonky.actions.${ChonkyActions.ToggleHiddenFiles.id}.button.name`]: t('fileBrowser:chonky.actions.ChonkyActions.ToggleHiddenFiles.id.button.name'),
    [`chonky.actions.${ChonkyActions.ToggleShowFoldersFirst.id}.button.name`]: t('fileBrowser:chonky.actions.ChonkyActions.ToggleShowFoldersFirst.id.button.name'),
    [`chonky.actions.${ChonkyActions.UploadFiles.id}.button.tooltip`]: t('chonky.actions.ChonkyActions.UploadFiles.id.button.tooltip'),
    [`chonky.actions.${ChonkyActions.UploadFiles.id}.button.name`]: t('fileBrowser:chonky.actions.ChonkyActions.UploadFiles.id.button.name'),
  },
});

export default Chonkyi18n;
