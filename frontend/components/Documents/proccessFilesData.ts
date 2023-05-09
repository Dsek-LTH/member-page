import { FilesQuery } from '~/generated/graphql';

export type Meeting = {
  title: string;
  files: FilesQuery['files'];
  modDate: any;
};

export type Document = {
  title: string;
  meetings: Meeting[];
};

export default function processFilesData(year: string, files?: FilesQuery['files']): Meeting[] {
  if (!files) return [];
  const meetings = [];
  const meetingTitles = new Set(files.filter((file) => file.id.includes(`/${year}/`) && !file.id.includes('_folder-preserver')).map((file) => file.id.split('/')[2]).reverse());
  meetingTitles.forEach((meetingTitle) => {
    meetings.push({
      title: meetingTitle,
      modDate: files.find((file) => file.id.includes(`/${year}/${meetingTitle}/`) && file.id.includes('_folder-preserver'))?.modDate,
      files: files.filter((file) => file.id.includes(`/${year}/${meetingTitle}/`) && !file.id.includes('_folder-preserver')).map((file) => ({ ...file, name: file.name.replace('.pdf', '') })),
    });
  });
  return meetings;
}
