import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { getCurrentPageType } from '../locationListener';
import { AppState } from '../../reducers';
import { ALREADY_VISITED_RECOMMEND_PAPERS, BASED_ACTIVITY_COUNT_STORE_KEY } from './recommendPoolConstants';
import { RecommendPoolState, closeRecommendPapersDialog } from './recommendPoolReducer';
import Button from '../common/button';
import ScinapseSnackbar from '../common/scinapseSnackbar';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./recommendPool.scss');
const store = require('store');

type Props = RouteComponentProps<any>;

const RecommendPool: React.FC<Props> = props => {
  useStyles(s);
  const dispatch = useDispatch();
  const dialogState = useSelector<AppState, RecommendPoolState>(state => state.recommendPoolState);
  const { isOpen, actionArea } = dialogState;
  const { location } = props;

  useEffect(
    () => {
      dispatch(closeRecommendPapersDialog());
    },
    [dispatch, location]
  );

  function clickLetMeSeeBtn(actionArea: string) {
    store.set(BASED_ACTIVITY_COUNT_STORE_KEY, ALREADY_VISITED_RECOMMEND_PAPERS);
    ActionTicketManager.trackTicket({
      pageType: getCurrentPageType(),
      actionType: 'fire',
      actionArea: 'knowledgeBaseNoti',
      actionTag: 'clickLetMeSeeBtn',
      actionLabel: actionArea,
    });
    dispatch(closeRecommendPapersDialog());
  }

  return (
    <ScinapseSnackbar
      open={isOpen}
      onClose={() => dispatch(closeRecommendPapersDialog())}
      openFrom="knowledgeBaseNoti"
      message={
        <span id="message-id" className={s.snackbarContext}>
          Recommended papers were updated with your activity history
        </span>
      }
      action={
        <div className={s.letMeSeeBtn} key={`viewCollection`}>
          <Button
            elementType="link"
            variant="text"
            color="blue"
            size="large"
            to="/#recommended"
            onClick={() => clickLetMeSeeBtn(actionArea)}
          >
            Let me see
          </Button>
        </div>
      }
    />
  );
};

export default withRouter(RecommendPool);
