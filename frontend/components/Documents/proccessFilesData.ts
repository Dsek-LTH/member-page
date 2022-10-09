import { FilesQuery } from '~/generated/graphql';

export type Meeting = {
  title: string;
  files: FilesQuery['files'];
}

export type Document = {
  title: string;
  meetings: Meeting[];
}

export default function proccessFilesData(year: string, files: FilesQuery['files']): Meeting[] {
  const meetings = [];
  const meetingNames = new Set(files.filter((file) => file.id.includes(`/${year}/`) && !file.id.includes('_folder-preserver')).map((file) => file.id.split('/')[2]).reverse());
  meetingNames.forEach((meeting) => {
    meetings.push({ title: meeting, files: files.filter((file) => file.id.includes(`/${year}/${meeting}`) && !file.id.includes('blob.png')).map((file) => ({ title: file.name, ...file })) });
  });
  return meetings;
}
