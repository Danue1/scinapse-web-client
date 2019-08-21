import { MyCollectionsState } from '../../../../containers/paperShowCollectionControlButton/reducer';
import { Paper } from '../../../../model/paper';
import { CurrentUser } from '../../../../model/currentUser';
import { Collection } from '../../../../model/collection';

export interface CollectionButtonProps {
  paper: Paper;
  myCollections: MyCollectionsState;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  hasCollection: boolean;
  currentUser: CurrentUser;
  collection: Collection | undefined;
  paperNote?: string;
  onRemove?: (paperId: number) => Promise<void>;
  handleAddToreadLater?: (paperId: number) => void;
}

export interface AddToCollectionBtnProps {
  paperId: number;
  myCollections: MyCollectionsState;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

export interface AddToReadLaterBtnProps {
  paperId: number;
  pageType: Scinapse.ActionTicket.PageType;
  handleAddToReadLater?: (paperId: number) => void;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

export interface RemoveToReadLaterBtnProps {
  paperId: number;
  pageType: Scinapse.ActionTicket.PageType;
  collectionId: number;
  onRemove?: (paperId: number) => Promise<void>;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}
