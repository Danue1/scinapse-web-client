import * as React from 'react';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '../../../helpers/withStylesHelper';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { AppState } from '../../../reducers';
import { CurrentUser } from '../../../model/currentUser';
import { Collection, collectionSchema } from '../../../model/collection';
import { MyCollectionsState } from '../../../containers/paperShowCollectionControlButton/reducer';
import CollectionPaperNote from '../../collectionPaperNote';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import { addPaperToReadLater } from '../../articleSearch/actions';
import { Dispatch } from 'redux';
import { Paper } from '../../../model/paper';
const styles = require('./collectionButton.scss');

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
    myCollections: state.myCollections,
    collection: denormalize(state.collectionShow.mainCollectionId, collectionSchema, state.entities),
  };
}

interface AddToCollectionBtnProps {
  paper: Paper;
  myCollections: MyCollectionsState;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  dispatch: Dispatch<any>;
}

interface CollectionButtonProps extends AddToCollectionBtnProps {
  hasCollection: boolean;
  currentUser: CurrentUser;
  collection: Collection | undefined;
  paperNote?: string;
  onRemove?: (paperId: number) => Promise<void>;
}

function handleAddToCollection(myCollections: MyCollectionsState, paperId: number) {
  if (!myCollections.collectionIds || myCollections.collectionIds.length === 0) {
    GlobalDialogManager.openNewCollectionDialog(paperId);
  } else {
    GlobalDialogManager.openCollectionDialog(paperId);
  }
}

function trackActionToClickCollectionButton(
  paperId: number,
  pageType: Scinapse.ActionTicket.PageType,
  actionArea: Scinapse.ActionTicket.ActionArea | Scinapse.ActionTicket.PageType | null
) {
  ActionTicketManager.trackTicket({
    pageType,
    actionType: 'fire',
    actionArea,
    actionTag: 'addToCollection',
    actionLabel: String(paperId),
  });
}

const AddToReadLaterBtn: React.FC<AddToCollectionBtnProps> = ({ actionArea, pageType, paper, dispatch }) => {
  let alreadySaved;
  if (!!paper.relation && paper.relation.savedInCollections.length > 0) {
    paper.relation.savedInCollections.map(test => {
      if (test.readLater) {
        alreadySaved = true;
      }
    });
  }

  if (alreadySaved) {
    return (
      <button className={styles.deleteReadLaterBtnWrapper} onClick={async () => {}}>
        <Icon className={styles.bookmarkIcon} icon="BOOKMARK" />
        <span className={styles.deleteReadLaterBtnContext} />
      </button>
    );
  }

  return (
    <button
      className={styles.addCollectionBtnWrapper}
      onClick={async () => {
        const isBlocked = await blockUnverifiedUser({
          authLevel: AUTH_LEVEL.VERIFIED,
          actionArea: actionArea || pageType,
          actionLabel: 'addToCollection',
          userActionType: 'addToCollection',
        });

        trackActionToClickCollectionButton(paper.id, pageType, actionArea || pageType);

        if (!isBlocked) {
          dispatch(addPaperToReadLater(paper.id, ''));
        }
      }}
    >
      <Icon className={styles.bookmarkIcon} icon="BOOKMARK" />
      <span className={styles.addReadLaterBtnContext} />
    </button>
  );
};

const AddToCollectionBtn: React.FC<AddToCollectionBtnProps> = ({ actionArea, pageType, paper, myCollections }) => {
  return (
    <button
      className={styles.addCollectionBtnWrapper}
      onClick={async () => {
        const isBlocked = await blockUnverifiedUser({
          authLevel: AUTH_LEVEL.VERIFIED,
          actionArea: actionArea || pageType,
          actionLabel: 'addToCollection',
          userActionType: 'addToCollection',
        });

        trackActionToClickCollectionButton(paper.id, pageType, actionArea || pageType);

        if (!isBlocked) {
          handleAddToCollection(myCollections, paper.id);
        }
      }}
    >
      <Icon className={styles.bookmarkIcon} icon="BOOKMARK" />
      <span className={styles.addCollectionBtnContext} />
    </button>
  );
};

const CollectionButton: React.FC<CollectionButtonProps> = ({
  paper,
  pageType,
  paperNote,
  actionArea,
  hasCollection,
  onRemove,
  myCollections,
  currentUser,
  collection,
  dispatch,
}) => {
  const paperId = paper.id;
  const itsMine = collection && collection.createdBy.id === currentUser.id ? true : false;
  const newMemoAnchor = React.useRef<HTMLDivElement | null>(null);
  const [isOpenNotePopover, setIsOpenNotePopover] = React.useState(false);

  if (hasCollection && onRemove && itsMine && collection) {
    return (
      <>
        <button
          className={styles.removeCollectionBtnWrapper}
          onClick={() => {
            onRemove(paperId);
            ActionTicketManager.trackTicket({
              pageType,
              actionType: 'fire',
              actionArea: actionArea || pageType,
              actionTag: 'removeFromCollection',
              actionLabel: String(paperId),
            });
          }}
        >
          <Icon className={styles.buttonIcon} icon="X_BUTTON" />
        </button>
        <div ref={newMemoAnchor}>
          <button
            className={styles.addCollectionNoteBtnWrapper}
            onClick={() => {
              setIsOpenNotePopover(!isOpenNotePopover);
              if (!!paperNote) {
                ActionTicketManager.trackTicket({
                  pageType,
                  actionType: 'fire',
                  actionArea: actionArea || pageType,
                  actionTag: 'viewNote',
                  actionLabel: String(paperId),
                });
              }
            }}
          >
            {paperNote ? (
              <>
                <Icon className={styles.addNoteIcon} icon="NOTED" />View Note
              </>
            ) : (
              <>
                <Icon className={styles.addNoteIcon} icon="ADD_NOTE" /> Add Note
              </>
            )}
          </button>
          <Popover
            open={isOpenNotePopover}
            classes={{ paper: styles.collectionNoteForm }}
            anchorEl={newMemoAnchor.current!}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            onClose={() => {
              setIsOpenNotePopover(false);
            }}
          >
            <CollectionPaperNote
              maxHeight={120}
              note={paperNote}
              collectionId={collection.id}
              paperId={paperId}
              isMine={!!itsMine}
            />
          </Popover>
        </div>
      </>
    );
  }

  return (
    <AddToReadLaterBtn
      paper={paper}
      pageType={pageType}
      actionArea={actionArea}
      dispatch={dispatch}
      myCollections={myCollections}
    />
  );
};

export default connect(mapStateToProps)(withStyles<typeof CollectionButton>(styles)(CollectionButton));
