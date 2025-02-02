import * as React from 'react';
import { useDispatch } from 'react-redux';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { withStyles } from '../../../helpers/withStylesHelper';
import { formulaeToHTMLStr } from '../../../helpers/displayFormula';
import actionTicketManager from '../../../helpers/actionTicketManager';
import { ActionCreators } from '../../../actions/actionTypes';
import Icon from '../../../icons';
import { Paper } from '../../../model/paper';
const styles = require('./title.scss');

export interface TitleProps extends RouteComponentProps<any> {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

const Title: React.FC<TitleProps> = props => {
  const { paper, pageType, actionArea } = props;
  const dispatch = useDispatch();

  const handleClickTitle = (fromNewTab?: boolean) => {
    actionTicketManager.trackTicket({
      pageType,
      actionType: 'fire',
      actionArea: actionArea || pageType,
      actionTag: 'paperShow',
      actionLabel: String(paper.id),
    });

    if (fromNewTab) {
      actionTicketManager.trackTicket({
        pageType,
        actionType: 'fire',
        actionArea: 'titleNewTab',
        actionTag: 'paperShow',
        actionLabel: String(paper.id),
      });
    }

    if (paper.titleHighlighted || paper.abstractHighlighted) {
      dispatch(
        ActionCreators.setHighlightContentInPaperShow({
          title: paper.titleHighlighted || '',
          abstract: paper.abstractHighlighted || '',
        })
      );
    }
  };

  const trimmedTitle = paper.title
    .replace(/^ /gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/#[A-Z0-9]+#/g, '');

  return (
    <div>
      <Link
        to={`/papers/${paper.id}`}
        onClick={() => {
          handleClickTitle(false);
        }}
        dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(trimmedTitle) }}
        className={styles.title}
      />
      <a href={`/papers/${paper.id}`} target="_blank" rel="noopener noreferrer" className={styles.externalIconWrapper}>
        <Icon
          onClick={() => {
            handleClickTitle(true);
          }}
          icon="NEW_TAB"
          className={styles.externalIcon}
        />
      </a>
    </div>
  );
};

export default withRouter(withStyles<typeof Title>(styles)(Title));
