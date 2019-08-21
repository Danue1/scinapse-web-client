import * as React from 'react';
import * as store from 'store';
import { Paper } from '../../../../model/paper';
import { CurrentUser } from '../../../../model/currentUser';
import { withStyles } from '../../../../helpers/withStylesHelper';
import PaperItem from '../../../common/paperItem/searchPaperItem';
import ArticleSpinner from '../../../common/spinner/articleSpinner';
import { RESEARCH_HISTORY_KEY, HistoryPaper } from '../../../researchHistory';
import PaperAPI, { PaperSource } from '../../../../api/paper';
import MobilePaperItem from '../../../common/mobilePaperItem';
const styles = require('./searchList.scss');

interface SearchListProps {
  isMobile: boolean;
  currentUser: CurrentUser;
  papers: Paper[];
  searchQueryText: string;
  isLoading: boolean;
}

const SearchList: React.FC<SearchListProps> = props => {
  const { isMobile, currentUser, papers, searchQueryText, isLoading } = props;
  const historyPapers: HistoryPaper[] = store.get(RESEARCH_HISTORY_KEY) || [];
  const [sourceDomains, setSourceDomains] = React.useState<PaperSource[]>([]);

  React.useEffect(
    () => {
      PaperAPI.getSources(papers.map(p => p.id)).then(domains => {
        setSourceDomains(domains);
      });
    },
    [papers]
  );

  if (!papers || !searchQueryText) return null;

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner className={styles.loadingSpinner} />
      </div>
    );
  }

  const searchItems = papers.map(paper => {
    const matchedPaper = historyPapers.find(p => p.id === paper.id);
    let savedAt = null;
    if (matchedPaper) {
      savedAt = matchedPaper.savedAt;
    }

    return (
      <PaperItem
        key={paper.id}
        paper={paper}
        pageType="searchResult"
        actionArea="searchResult"
        searchQueryText={searchQueryText}
        currentUser={currentUser}
        wrapperClassName={styles.searchItemWrapper}
        savedAt={savedAt}
        sourceDomain={sourceDomains.find(source => source.paperId === paper.id)}
      />
    );
  });

  return <div className={styles.searchItems}>{searchItems}</div>;
};

export default withStyles<typeof SearchList>(styles)(SearchList);
