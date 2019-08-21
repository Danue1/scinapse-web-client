import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { denormalize } from 'normalizr';
import Popover from '@material-ui/core/Popover';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '../../../helpers/withStylesHelper';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { AppState } from '../../../reducers';
import { collectionSchema } from '../../../model/collection';
import { MyCollectionsState } from '../../../containers/paperShowCollectionControlButton/reducer';
import CollectionPaperNote from '../../collectionPaperNote';
import { blockUnverifiedUser, AUTH_LEVEL } from '../../../helpers/checkAuthDialog';
import {
  CollectionButtonProps,
  AddToReadLaterBtnProps,
  AddToCollectionBtnProps,
  RemoveToReadLaterBtnProps,
} from './types/collectionButton';
import { getUserGroupName } from '../../../helpers/abTestHelper';
import { READ_LATER_EXPERIMENT } from '../../../constants/abTestGlobalValue';
const styles = require('./collectionButton.scss');

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
    myCollections: state.myCollections,
    collection: denormalize(state.collectionShow.mainCollectionId, collectionSchema, state.entities),
  };
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

const RemoveToReadLaterBtn: React.FC<RemoveToReadLaterBtnProps> = ({ paperId, onRemove, collectionId }) => {
  const dropdownMenuEl = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setIsOpen(false);
      }}
    >
      <div ref={dropdownMenuEl}>
        <button className={styles.deleteReadLaterBtnWrapper} onClick={() => setIsOpen(!isOpen)}>
          <Icon className={styles.bookmarkIcon} icon="BOOKMARK" />
          <span className={styles.deleteReadLaterBtnContext} />
        </button>
        <Popper
          className={styles.removeFromReadLaterDropdown}
          modifiers={{
            preventOverflow: {
              enabled: false,
            },
            flip: {
              enabled: false,
            },
          }}
          open={isOpen}
          anchorEl={dropdownMenuEl.current}
          placement="bottom-end"
          disablePortal
        >
          <div
            className={styles.menuItem}
            onClick={() => {
              setIsOpen(false);
              if (!!onRemove) {
                onRemove(paperId);
              }
            }}
          >
            Remove from Read Later
          </div>
          <Link
            className={styles.menuItem}
            onClick={() => {
              setIsOpen(false);
            }}
            to={`/collections/${collectionId}`}
          >
            Go Read Later
          </Link>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

const AddToReadLaterBtn: React.FC<AddToReadLaterBtnProps> = ({
  actionArea,
  pageType,
  paperId,
  handleAddToReadLater,
}) => {
  return (
    <button
      className={styles.addCollectionBtnWrapper}
      onClick={async () => {
        const isBlocked = await blockUnverifiedUser({
          authLevel: AUTH_LEVEL.VERIFIED,
          actionArea: actionArea || pageType,
          actionLabel: 'addToReadLater',
          userActionType: 'addToReadLater',
        });

        trackActionToClickCollectionButton(paperId, pageType, actionArea || pageType);

        if (!isBlocked && handleAddToReadLater) {
          handleAddToReadLater(paperId);
        }
      }}
    >
      <Icon className={styles.bookmarkIcon} icon="BOOKMARK" />
      <span className={styles.addReadLaterBtnContext} />
    </button>
  );
};

const AddToCollectionBtn: React.FC<AddToCollectionBtnProps> = ({ actionArea, pageType, paperId, myCollections }) => {
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

        trackActionToClickCollectionButton(paperId, pageType, actionArea || pageType);

        if (!isBlocked) {
          handleAddToCollection(myCollections, paperId);
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
  handleAddToReadLater,
  myCollections,
  currentUser,
  collection,
  isMobile,
}) => {
  const itsMine = collection && collection.createdBy.id === currentUser.id ? true : false;
  const newMemoAnchor = React.useRef<HTMLDivElement | null>(null);
  const [isOpenNotePopover, setIsOpenNotePopover] = React.useState(false);
  const [showReadLaterBtn, setShowReadLaterBtn] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
    setShowReadLaterBtn(getUserGroupName(READ_LATER_EXPERIMENT) === 'rl');
  }, []);

  React.useEffect(
    () => {
      if (!!paper.relation && paper.relation.savedInCollections.length > 0) {
        paper.relation.savedInCollections.map(collection => {
          if (collection.readLater) {
            setIsSaved(true);
          }
        });
      }
    },
    [paper.relation]
  );

  if (hasCollection && onRemove && itsMine && collection && isMobile) {
    return (
      <RemoveToReadLaterBtn
        paperId={paper.id}
        pageType={pageType}
        actionArea={actionArea}
        collectionId={myCollections.collectionIds[0]}
        onRemove={onRemove}
      />
    );
  }

  if (hasCollection && onRemove && itsMine && collection) {
    return (
      <>
        <button
          className={styles.removeCollectionBtnWrapper}
          onClick={() => {
            onRemove(paper.id);
            ActionTicketManager.trackTicket({
              pageType,
              actionType: 'fire',
              actionArea: actionArea || pageType,
              actionTag: 'removeFromCollection',
              actionLabel: String(paper.id),
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
                  actionLabel: String(paper.id),
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
              paperId={paper.id}
              isMine={!!itsMine}
            />
          </Popover>
        </div>
      </>
    );
  }

  if (!showReadLaterBtn && !isMobile) {
    return (
      <AddToCollectionBtn
        paperId={paper.id}
        pageType={pageType}
        actionArea={actionArea}
        myCollections={myCollections}
      />
    );
  }

  return isSaved ? (
    <RemoveToReadLaterBtn
      paperId={paper.id}
      pageType={pageType}
      actionArea={actionArea}
      collectionId={myCollections.collectionIds[0]}
      onRemove={onRemove}
    />
  ) : (
    <AddToReadLaterBtn
      paperId={paper.id}
      pageType={pageType}
      actionArea={actionArea}
      handleAddToReadLater={handleAddToReadLater}
    />
  );
};

export default connect(mapStateToProps)(withStyles<typeof CollectionButton>(styles)(CollectionButton));
