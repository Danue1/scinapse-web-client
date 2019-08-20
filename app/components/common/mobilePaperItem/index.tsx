import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import Title from '../paperItem/title';
import { PaperItemProps } from '../paperItem/searchPaperItem';
import VenueAndAuthor from './venueAndAuthor';
import Abstract from '../paperItem/abstract';
import PaperActionButtons from '../paperItem/paperActionButtons';
const styles = require('./mobilePaperItem.scss');

const MAX_LENGTH_OF_MOBILE_ABSTRACT = 250;

const MobilePaperItem: React.FC<PaperItemProps> = React.memo(props => {
  const { searchQueryText, paper, wrapperClassName, currentUser, pageType, actionArea, sourceDomain } = props;
  const { doi, urls } = paper;

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
        <Title
          paperId={paper.id}
          paperTitle={paper.title}
          highlightTitle={paper.titleHighlighted}
          highlightAbstract={paper.abstractHighlighted}
          pageType={pageType}
          actionArea={actionArea}
          source={source}
          titleClassName={styles.mobileTitle}
        />
        <VenueAndAuthor paper={paper} pageType={pageType} actionArea={actionArea} />
        <Abstract
          paperId={paper.id}
          pageType={pageType}
          actionArea={actionArea}
          abstract={paper.abstractHighlighted || paper.abstract}
          searchQueryText={searchQueryText}
          className={styles.mobileAbstract}
          maxLength={MAX_LENGTH_OF_MOBILE_ABSTRACT}
        />
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

export default withStyles<typeof MobilePaperItem>(styles)(MobilePaperItem);
