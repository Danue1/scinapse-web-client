import * as React from 'react';
import Helmet from 'react-helmet';
import { Paper } from '../../../model/paper';
import { PaperAuthor } from '../../../model/author';
import { Journal } from '../../../model/journal';
import { getPDFLink } from '../../../helpers/getPDFLink';

const buildPageDescription = (paper: Paper) => {
  const shortAbstract = paper.abstract ? `${paper.abstract.slice(0, 110)} | ` : '';
  const shortAuthors =
    paper.authors && paper.authors.length > 0
      ? `${paper.authors
          .map(author => {
            return author && author.name;
          })
          .join(', ')
          .slice(0, 50)}  | `
      : '';
  const shortJournals = paper.journal ? `${paper.journal.title.slice(0, 50)} | ` : '';
  return `${shortAbstract}${shortAuthors}${shortJournals}`;
};

function formatAuthorsToStructuredData(authors: PaperAuthor[]) {
  authors.map(author => {
    const affiliationName = author.organization || (author.affiliation && author.affiliation.name);
    return {
      '@type': 'Person',
      name: author.name,
      affiliation: {
        name: affiliationName || '',
      },
    };
  });
}

function formatPublisherToStructuredData(journal: Journal) {
  return {
    '@type': ['PublicationVolume', 'Periodical'],
    name: journal.title,
    publisher: journal.title,
    contentRating: {
      '@type': 'Rating',
      name: 'impact factor',
      ratingValue: journal.impactFactor || 0,
    },
  };
}

const getStructuredData = (paper: Paper) => {
  const author = paper.authors && paper.authors.length > 0 ? formatAuthorsToStructuredData(paper.authors) : null;
  const publisher = paper.journal ? formatPublisherToStructuredData(paper.journal) : null;
  const structuredData: any = {
    '@context': 'http://schema.org',
    '@type': 'ScholarlyArticle',
    headline: paper.title,
    identifier: paper.doi,
    description: paper.abstract,
    name: paper.title,
    image: ['https://assets.pluto.network/scinapse/scinapse-logo.png'],
    datePublished: paper.publishedDate,
    dateModified: paper.publishedDate,
    about: paper.fosList.map(fos => fos.fos),
    mainEntityOfPage: `https://scinapse.io/papers/${paper.id}`,
    author,
    publisher,
  };

  return structuredData;
};

const PaperShowHelmet: React.FC<{ paper: Paper }> = React.memo(({ paper }) => {
  const pdfSourceRecord = getPDFLink(paper.urls);
  const metaTitleContent = !!pdfSourceRecord ? '[PDF] ' + paper.title : paper.title;
  const fosListContent =
    paper.fosList && typeof paper.fosList !== 'undefined'
      ? paper.fosList
          .map(fos => {
            return fos.fos;
          })
          .toString()
          .replace(/,/gi, ', ')
      : '';

  return (
    <Helmet>
      <title>{`${metaTitleContent} | Scinapse | Academic search engine for paper`}</title>
      <link rel="canonical" href={`https://scinapse.io/papers/${paper.id}`} />
      <meta itemProp="name" content={`${metaTitleContent} | Scinapse | Academic search engine for paper`} />
      <meta name="description" content={buildPageDescription(paper)} />
      <meta name="keyword" content={fosListContent} />
      <meta name="twitter:description" content={buildPageDescription(paper)} />
      <meta name="twitter:card" content={`${metaTitleContent} | Scinapse | Academic search engine for paper`} />
      <meta name="twitter:title" content={`${metaTitleContent} | Scinapse | Academic search engine for paper`} />
      <meta property="og:title" content={`${metaTitleContent} | Scinapse | Academic search engine for paper`} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`https://scinapse.io/papers/${paper.id}`} />
      <meta property="og:description" content={buildPageDescription(paper)} />
      <script type="application/ld+json">{JSON.stringify(getStructuredData(paper))}</script>
    </Helmet>
  );
});

export default PaperShowHelmet;
