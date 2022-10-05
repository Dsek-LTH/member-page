import { FilesQuery } from '~/generated/graphql';

type Meeting = {
  title: string;
  files: FilesQuery['files'];
}

export type Category = {
  title: string;
  meetings: Meeting[];
}

export default function proccessFilesData(files: FilesQuery['files']): Category[] {
  const paths = files.map((file) => file.id);
  const category_names = Array.from(new Set(paths.map((path) => path.split('/')[1])));
  const categories: Category[] = [];
  category_names.forEach((category, index) => {
    categories.push({ title: category, meetings: [] });
    const meetings = new Set(files.filter((file) => file.id.includes(`/${category}/`)).map((file) => file.id.split('/')[2]).reverse());
    meetings.forEach((meeting) => {
      categories[index].meetings.push({ title: meeting, files: files.filter((file) => file.id.includes(`/${category}/${meeting}`) && !file.id.includes('blob.png')).map((file) => ({ title: file.name, ...file })) });
    });
  });
  return categories;
}
