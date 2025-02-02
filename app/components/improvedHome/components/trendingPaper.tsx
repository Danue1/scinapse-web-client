import * as React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '../../../helpers/withStylesHelper';
import { TrendingPaper, TRENDING_PAPERS } from '../trendingPaperData';
import ActionTicketManager from '../../../helpers/actionTicketManager';
const styles = require('./trendingPaper.scss');

const TrendingPaperItem: React.FC = () => {
  const trendingPapers = TRENDING_PAPERS.map(paper => {
    const { paperId, paperTitle, year, journalTitle, authors } = paper;

    const authorNodes = authors.map((author, index) => {
      const isLastAuthor = authors.length - 1 === index;
      return (
        <span key={index}>
          {author}
          {!isLastAuthor ? <span>{`, `}</span> : null}
        </span>
      );
    });

    return (
      <Link
        key={paperId}
        to={`/papers/${paperId}`}
        className={styles.trendingPaperItemWrapper}
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType: 'home',
            actionType: 'fire',
            actionArea: 'trendingPapers',
            actionTag: 'paperShow',
            actionLabel: String(paperId),
          });
        }}
      >
        <div className={styles.trendingPaperItemTitle}>{paperTitle}</div>
        <div className={styles.trendingPaperItemVenueAndAuthor}>
          {`${year} ・ ${journalTitle} | `}
          {authorNodes}
        </div>
      </Link>
    );
  });

  return <>{trendingPapers}</>;
};

const TrendingPaper: React.FC = () => {
  return (
    <div className={styles.trendingPaperContainer}>
      <div className={styles.trendingPaperTitle}>TRENDING PAPERS</div>
      <div className={styles.trendingPaperSubTitle}>Papers being read by other researchers</div>
      <div className={styles.trendingPaperBlockDivider} />
      <TrendingPaperItem />
    </div>
  );
};

export default withStyles<typeof TrendingPaper>(styles)(TrendingPaper);
