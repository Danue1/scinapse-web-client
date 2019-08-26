import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '../../../helpers/withStylesHelper';
import { BlockAuthorListProps, AuthorItemProps } from '../paperItem/types/venueAndAuthor';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
const styles = require('./truncatedAuthorList.scss');

interface TruncatedAuthorListProps extends BlockAuthorListProps {
  showExpanded: boolean;
}

const AuthorItem: React.FC<AuthorItemProps> = ({ author, pageType, actionArea }) => {
  let affiliation = null;
  if (author.affiliation) {
    const affiliationName = author.affiliation.nameAbbrev
      ? `${author.affiliation.nameAbbrev}: ${author.affiliation.name}`
      : author.affiliation.name;
    affiliation = <span className={styles.affiliation}>{`(${affiliationName})`}</span>;
  }

  let hIndex = null;
  if (author.hindex) {
    hIndex = <span className={styles.hIndex}>{`H-Index: ${author.hindex}`}</span>;
  }

  return (
    <span className={styles.authorContentWrapper}>
      <div className={styles.leftContent}>
        <Link
          to={`/authors/${author.id}`}
          onClick={() => {
            ActionTicketManager.trackTicket({
              pageType,
              actionType: 'fire',
              actionArea: actionArea || pageType,
              actionTag: 'authorShow',
              actionLabel: String(author.id),
            });
          }}
          className={styles.authorName}
        >
          {author.name}
        </Link>
        {affiliation}
      </div>
      {hIndex}
    </span>
  );
};

const TruncatedAuthorList: React.FC<TruncatedAuthorListProps> = ({
  paper,
  authors,
  pageType,
  actionArea,
  showExpanded,
}) => {
  const hasMore = authors.length > 3;
  if (!showExpanded) {
    const preAuthor = authors.slice(0, 1);
    const postAuthor = authors.slice(-1);
    const truncated = hasMore && '...,';

    return (
      <span className={styles.truncatedAuthorList}>{`${authors.length} Authors (${preAuthor[0].name}, ${truncated} ${
        postAuthor[0].name
      })`}</span>
    );
  }

  let viewAllAuthorsBtn = null;
  if (hasMore) {
    viewAllAuthorsBtn = (
      <div
        onClick={() => {
          GlobalDialogManager.openAuthorListDialog(paper);
        }}
        className={styles.viewAll}
      >{`+ ${authors.length - 3} more authors`}</div>
    );
  }

  const preAuthorList = authors.slice(0, 3).map(author => {
    return (
      <div key={author.id} className={styles.authorItemWrapper}>
        <AuthorItem author={author} pageType={pageType} actionArea={actionArea} />
      </div>
    );
  });

  return (
    <div className={styles.authorListWrapper}>
      <span className={styles.listWrapper}>
        {preAuthorList}
        {viewAllAuthorsBtn}
      </span>
    </div>
  );
};

export default withStyles<typeof TruncatedAuthorList>(styles)(TruncatedAuthorList);
