import * as React from 'react';
import * as format from 'date-fns/format';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { withStyles } from '../../../helpers/withStylesHelper';
import JournalBadge from '../../journalBadge';
import { BlockVenueProps } from './types/venueAndAuthor';
const styles = require('./blockVenue.scss');

const BlockVenue: React.FC<BlockVenueProps> = ({
  journal,
  conferenceInstance,
  publishedDate,
  pageType,
  actionArea,
}) => {
  if (!journal && !conferenceInstance) return null;

  let publishedAtNode = null;
  if (publishedDate) {
    publishedAtNode = <span className={styles.publishedDate}>{format(publishedDate, 'MMM D, YYYY')}</span>;
  }

  let content = null;
  if (journal) {
    const impactFactor = journal.impactFactor && (
      <span className={styles.ifLabel}>
        <span>
          <Tooltip
            title="Impact Factor"
            placement="top"
            classes={{ tooltip: styles.arrowBottomTooltip }}
            disableFocusListener
            disableTouchListener
          >
            <span>
              <Icon className={styles.ifIconWrapper} icon="IMPACT_FACTOR" />
            </span>
          </Tooltip>
          {journal.impactFactor.toFixed(2)}
        </span>
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
        {publishedAtNode && journal.title && <span className={styles.middleDot}>{`·`}</span>}
        <span className={styles.journalTitle}>{journal.title}</span>
        {journal.sci && <JournalBadge text="SCI" labelClassName={styles.journalBadge} />}
        {impactFactor}
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

  return (
    <div className={styles.wrapper}>
      <Icon icon="JOURNAL" className={styles.journalIcon} />
      {content}
    </div>
  );
};

export default withStyles<typeof BlockVenue>(styles)(BlockVenue);
