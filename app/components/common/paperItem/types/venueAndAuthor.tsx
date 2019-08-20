import { Journal } from '../../../../model/journal';
import { ConferenceInstance } from '../../../../model/conferenceInstance';
import { Paper } from '../../../../model/paper';
import { PaperAuthor } from '../../../../model/author';

export interface BlockVenueProps {
  journal: Journal | null;
  conferenceInstance: ConferenceInstance | null;
  publishedDate: string | null;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

export interface BlockAuthorListProps {
  paper: Paper;
  authors: PaperAuthor[];
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

export interface AuthorItemProps {
  author: PaperAuthor;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}
