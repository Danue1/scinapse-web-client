import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserDevice } from '../../layouts/reducer';
import Icon from '../../../icons';
import { PaperSource } from '../../../api/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
import { AppState } from '../../../reducers';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { addPaperToRecommendPoolAndOpenDialog } from '../../recommendPool/recommendPoolActions';
import { Paper } from '../../../model/paper';
const styles = require('./sourceButton.scss');

interface SourceButtonProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  paperSource?: PaperSource;
}

const SourceButton: React.FC<SourceButtonProps> = ({ paperSource, pageType, actionArea, paper }) => {
  const dispatch = useDispatch();
  const userDevice = useSelector<AppState, UserDevice>(state => state.layout.userDevice);
  const noUrls = !paper.doi && (!paper.urls || paper.urls.length === 0);
  const noPaperSource = !paperSource || (!paperSource.source && !paperSource.doi);

  if (noPaperSource && noUrls) return null;

  if (paperSource) {
    const buttonContext = userDevice == UserDevice.MOBILE ? 'Source' : paperSource.host;

    return (
      <a
        href={`https://doi.org/${paperSource.doi}`}
        target="_blank"
        rel="noopener nofollow noreferrer"
        className={styles.sourceButton}
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType,
            actionType: 'fire',
            actionArea: actionArea || pageType,
            actionTag: 'source',
            actionLabel: String(paper.id),
          });
          dispatch(
            addPaperToRecommendPoolAndOpenDialog({
              pageType,
              actionArea: 'sourceButton',
              paperId: paper.id,
            })
          );
        }}
      >
        <img
          className={styles.faviconIcon}
          src={`https://www.google.com/s2/favicons?domain=${paperSource.source}`}
          alt={`${paperSource.host} favicon`}
        />
        <span className={styles.sourceHostInfo}>{buttonContext}</span>
        <Icon icon="SOURCE" className={styles.extSourceIcon} />
      </a>
    );
  }

  const destination = paper.doi ? `https://doi.org/${paper.doi}` : paper.urls[0].url;

  return (
    <a
      href={destination}
      target="_blank"
      rel="noopener nofollow noreferrer"
      className={styles.sourceButton}
      onClick={() => {
        ActionTicketManager.trackTicket({
          pageType,
          actionType: 'fire',
          actionArea: actionArea || pageType,
          actionTag: 'source',
          actionLabel: String(paper.id),
        });
        dispatch(
          addPaperToRecommendPoolAndOpenDialog({
            pageType,
            actionArea: 'sourceButton',
            paperId: paper.id,
          })
        );
      }}
    >
      <Icon icon="LINK" className={styles.linkIcon} />
      <span className={styles.sourceHostInfo}>Source</span>
    </a>
  );
};

export default withStyles<typeof SourceButton>(styles)(SourceButton);
