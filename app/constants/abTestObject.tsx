import { Test } from './abTest';
import {
  DUMMY_TEST,
  WEIGHTED_CITATION_EXPERIMENT,
  STRICT_SORT_EXPERIMENT,
  READ_LATER_EXPERIMENT,
} from './abTestGlobalValue';

export const dummy: Test = {
  name: DUMMY_TEST,
  userGroup: [{ groupName: 'a', weight: 1 }, { groupName: 'b', weight: 1 }],
};

export const weightedCitation: Test = {
  name: WEIGHTED_CITATION_EXPERIMENT,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'wc', weight: 3 }],
};

export const strictSort: Test = {
  name: STRICT_SORT_EXPERIMENT,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'ss', weight: 3 }],
};

export const readLater: Test = {
  name: READ_LATER_EXPERIMENT,
  userGroup: [{ groupName: 'control', weight: 1 }, { groupName: 'rl', weight: 1 }],
};
