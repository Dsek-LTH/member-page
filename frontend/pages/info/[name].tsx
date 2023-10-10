import { PrismaClient } from '@prisma/client';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MarkdownPage from '~/components/MarkdownPage';
import NoTitleLayout from '~/components/NoTitleLayout';
import { useSetPageName } from '~/providers/PageNameProvider';

export default function Info({
  data,
}: {
  data: { name: string; markdown: string; markdown_en: string };
}) {
  const { name } = data;
  useSetPageName(name.substring(0, 1).toUpperCase() + name.substring(1));
  return (
    <NoTitleLayout>
      <MarkdownPage data={data} />
    </NoTitleLayout>
  );
}

export const getStaticPaths = async () => {
  const prismaClient = new PrismaClient();
  const names = await prismaClient.markdowns.findMany({
    select: { name: true },
  });
  return {
    paths: names.map(({ name }) => ({ params: { name } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const name = params?.name as string;
  const prismaClient = new PrismaClient();
  const data = await prismaClient.markdowns.findUnique({
    where: { name },
  });
  return {
    props: {
      data,
      isNativeApp: process.env.SERVE_NATIVE_APP === 'true',
      ...(await serverSideTranslations(locale, [
        'common',
        ...(['news'] ?? []),
      ])),
    },
  };
};
