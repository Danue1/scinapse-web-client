import React from 'react';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';
import { withStyles } from '../../../helpers/withStylesHelper';
import { BlockVenueProps, BlockAuthorListProps, AuthorItemProps } from '../paperItem/types/venueAndAuthor';
import { Paper } from '../../../model/paper';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import classNames from 'classnames';
const styles = require('./venueAndAuthor.scss');

interface VenueAndAuthorProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

interface MobileVenueProps extends BlockVenueProps {
  showExpanded: boolean;
}

interface MobileAuthorListProps extends BlockAuthorListProps {
  showExpanded: boolean;
}

const Venue: React.FC<MobileVenueProps> = props => {
  const { journal, conferenceInstance, publishedDate, pageType, actionArea, showExpanded } = props;
  if (!journal && !conferenceInstance) return null;
  let dateFormat = 'YYYY';
  if (showExpanded) {
    dateFormat = 'MMM D, YYYY';
  }

  let publishedAtNode = null;
  if (publishedDate) {
    publishedAtNode = <span className={styles.publishedDate}>{format(publishedDate, dateFormat)}</span>;
  }

  let content = null;
  if (journal) {
    const impactFactor = journal.impactFactor && (
      <span className={styles.ifLabel}>
        <Icon className={styles.ifIconWrapper} icon="IMPACT_FACTOR" />
        <span>{journal.impactFactor.toFixed(2)}</span>
      </span>
    );

    content = (
      <Link
        to={`/journals/${journal.id}`}
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType,
            actionType: 'fire',
            actionArea: actionArea || pageType,
            actionTag: 'journalShow',
            actionLabel: String(journal.id),
          });
        }}
        className={styles.journalContent}
      >
        {publishedAtNode}
        {publishedAtNode && impactFactor && <span className={styles.middleDot}>{`·`}</span>}
        <span className={styles.ifAndSCILabel}>
          {impactFactor}
          {journal.sci && ` (SCI)`}
        </span>
        {showExpanded && <br />}
        {publishedAtNode && !showExpanded && journal.title && <span className={styles.middleDot}>{`·`}</span>}
        <span className={styles.journalTitle}>{journal.title}</span>
      </Link>
    );
  }

  if (conferenceInstance && conferenceInstance.conferenceSeries && conferenceInstance.conferenceSeries.name) {
    const title = conferenceInstance.conferenceSeries.nameAbbrev
      ? `${conferenceInstance.conferenceSeries.nameAbbrev} (${conferenceInstance.conferenceSeries.name})`
      : conferenceInstance.conferenceSeries.name;
    content = (
      <span className={styles.journalContent}>
        {publishedAtNode}
        <span className={styles.venueNameReadonly}> in {title}</span>
      </span>
    );
  }

  return <div className={styles.venueContainer}>{content}</div>;
};

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

const AuthorList: React.FC<MobileAuthorListProps> = ({ paper, authors, pageType, actionArea, showExpanded }) => {
  const hasMore = authors.length > 3;
  if (!showExpanded) {
    const preAuthor = authors.slice(0, 1);
    const postAuthor = authors.slice(-1);
    const truncated = hasMore && '...,';

    return (
      <div className={styles.test}>
        <span className={styles.truncatedAuthorList}>{`${authors.length} Authors (${preAuthor[0].name}, ${truncated} ${
          postAuthor[0].name
        })`}</span>
      </div>
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

const VenueAndAuthor: React.FC<VenueAndAuthorProps> = props => {
  const { paper, pageType, actionArea } = props;
  const [showExpanded, setShowExpanded] = React.useState(false);

  return (
    <div className={styles.venueAndAuthorWrapper}>
      <Venue
        journal={paper.journal}
        conferenceInstance={paper.conferenceInstance}
        publishedDate={paper.publishedDate}
        pageType={pageType}
        actionArea={actionArea}
        showExpanded={showExpanded}
      />
      <AuthorList
        paper={paper}
        authors={paper.authors}
        pageType={pageType}
        actionArea={actionArea}
        showExpanded={showExpanded}
      />
      <div className={styles.expandBtn} onClick={() => setShowExpanded(!showExpanded)}>
        <Icon
          className={classNames({
            [styles.upArrow]: showExpanded,
            [styles.downArrow]: !showExpanded,
          })}
          icon="ARROW_POINT_TO_UP"
        />
      </div>
    </div>
  );
};

export default withStyles<typeof VenueAndAuthor>(styles)(VenueAndAuthor);
