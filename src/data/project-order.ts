type ProjectLike = {
  id: string;
  data: {
    publishDate: Date;
  };
};

export const homepageProjectSlugs = [
  'devsheets',
  'apimocker',
  'skillpass',
  'portdoc',
  'vidpipe',
  'multiprompter',
];

const pinnedProjectSlugs = ['devsheets'];

const projectRank = (id: string) => {
  const index = pinnedProjectSlugs.indexOf(id);
  return index === -1 ? pinnedProjectSlugs.length : index;
};

export const sortProjectsForDisplay = <T extends ProjectLike>(projects: T[]) =>
  [...projects].sort((a, b) => {
    const rankDiff = projectRank(a.id) - projectRank(b.id);
    if (rankDiff !== 0) return rankDiff;

    return b.data.publishDate.valueOf() - a.data.publishDate.valueOf();
  });
