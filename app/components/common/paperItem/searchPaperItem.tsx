import * as React from 'react';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import * as format from 'date-fns/format';
import classNames from 'classnames';
import { CurrentUser } from '../../../model/currentUser';
import Abstract from './abstract';
import Figures from './figures';
import PaperActionButtons from './paperActionButtons';
import Title from './title';
import BlockVenue from './blockVenue';
import BlockAuthorList from './blockAuthorList';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
import SavedCollections from './savedCollections';
import { PaperSource } from '../../../api/paper';
import TruncatedVenue from './truncatedVenue';
import TruncatedAuthorList from './truncatedAuthorList';
import Icon from '../../../icons';
const styles = require('./paperItem.scss');

export interface PaperItemProps {
  paper: Paper;
  savedAt: number | null; // unix time
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  searchQueryText: string;
  wrapperClassName: string;
  currentUser: CurrentUser;
  isMobile: boolean;
  sourceDomain?: PaperSource;
}

const NotIncludedWords: React.FC<{ missingKeywords: string[] }> = React.memo(props => {
  const { missingKeywords } = props;

  if (missingKeywords.length === 0) return null;

  const wordComponents = missingKeywords.map((word, i) => {
    return (
      <React.Fragment key={i}>
        <span className={styles.missingWord}>{word}</span>
        {i !== missingKeywords.length - 1 && ` `}
      </React.Fragment>
    );
  });

  return (
    <div className={styles.missingWordsWrapper}>
      {`Not included: `}
      {wordComponents}
    </div>
  );
});

const PaperItem: React.FC<PaperItemProps> = React.memo(props => {
  const {
    searchQueryText,
    paper,
    wrapperClassName,
    currentUser,
    pageType,
    actionArea,
    savedAt,
    sourceDomain,
    isMobile,
  } = props;
  const [showExpanded, setShowExpanded] = React.useState(false);
  const { doi, urls, relation } = paper;

  let historyContent = null;
  if (savedAt) {
    const lastVisitDate = format(savedAt, 'MMM DD, YYYY');
    const lastVisitFrom = distanceInWordsToNow(savedAt);
    historyContent = (
      <div className={styles.visitedHistory}>{`You visited at ${lastVisitDate} (${lastVisitFrom} ago)`}</div>
    );
  }

  let source;
  if (!!doi) {
    source = `https://doi.org/${doi}`;
  } else if (urls && urls.length > 0) {
    source = urls[0].url;
  } else {
    source = '';
  }

  return (
    <div className={`${wrapperClassName ? wrapperClassName : styles.paperItemWrapper}`}>
      <div className={styles.contentSection}>
        {!!relation && relation.savedInCollections.length >= 1 ? (
          <SavedCollections collections={relation.savedInCollections} />
        ) : null}
        {historyContent}
        <Title
          paperId={paper.id}
          paperTitle={paper.title}
          highlightTitle={paper.titleHighlighted}
          highlightAbstract={paper.abstractHighlighted}
          pageType={pageType}
          actionArea={actionArea}
          source={source}
        />
        <div className={styles.venueAndAuthorWrapper}>
          <TruncatedVenue
            showExpanded={showExpanded}
            journal={paper.journal}
            conferenceInstance={paper.conferenceInstance}
            publishedDate={paper.publishedDate}
            pageType={pageType}
            actionArea={actionArea}
          />
          {/* <BlockVenue
            journal={paper.journal}
            conferenceInstance={paper.conferenceInstance}
            publishedDate={paper.publishedDate}
            pageType={pageType}
            actionArea={actionArea}
          /> */}

          <TruncatedAuthorList
            showExpanded={showExpanded}
            paper={paper}
            authors={paper.authors}
            pageType={pageType}
            actionArea={actionArea}
          />

          {/* <BlockAuthorList paper={paper} authors={paper.authors} pageType={pageType} actionArea={actionArea} /> */}

          {isMobile && (
            <div className={styles.expandBtn} onClick={() => setShowExpanded(!showExpanded)}>
              <Icon
                className={classNames({
                  [styles.upArrow]: showExpanded,
                  [styles.downArrow]: !showExpanded,
                })}
                icon="ARROW_POINT_TO_UP"
              />
            </div>
          )}
        </div>
        <Abstract
          paperId={paper.id}
          pageType={pageType}
          actionArea={actionArea}
          abstract={paper.abstractHighlighted || paper.abstract}
          searchQueryText={searchQueryText}
          maxLength={isMobile ? 250 : undefined}
        />
        <Figures figures={paper.figures} paperId={paper.id} />
        <NotIncludedWords missingKeywords={paper.missingKeywords} />
        <PaperActionButtons
          currentUser={currentUser}
          paper={paper}
          pageType={pageType}
          actionArea={actionArea}
          hasCollection={false}
          sourceDomain={sourceDomain}
        />
      </div>
    </div>
  );
});

export default withStyles<typeof PaperItem>(styles)(PaperItem);
