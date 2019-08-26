import React from 'react';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';
import { withStyles } from '../../../helpers/withStylesHelper';
import { BlockVenueProps } from '../paperItem/types/venueAndAuthor';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
const styles = require('./truncatedVenue.scss');

interface TruncatedVenueProps extends BlockVenueProps {
  showExpanded: boolean;
}

const TruncatedVenue: React.FC<TruncatedVenueProps> = props => {
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

export default withStyles<typeof TruncatedVenue>(styles)(TruncatedVenue);
