import { Test } from "./abTest";

export const signUpContextTest: Test = {
  name: "signUpContextText",
  userGroup: [{ groupName: "control", weight: 1 }, { groupName: "positive", weight: 1 }],
};

export const paperFromSearchTest: Test = {
  name: "paperFromSearch",
  userGroup: [
    { groupName: "control", weight: 1 },
    { groupName: "3", weight: 2 },
    { groupName: "5", weight: 2 },
    { groupName: "7", weight: 2 },
  ],
};

export const queryLoverTest: Test = {
  name: "queryLover",
  userGroup: [
    { groupName: "control", weight: 1 },
    { groupName: "2", weight: 5 },
    { groupName: "3", weight: 5 },
    { groupName: "4", weight: 2 },
    { groupName: "6", weight: 2 },
  ],
};

export const completeBlockSignUpTest: Test = {
  name: "completeBlockSignUp",
  userGroup: [
    { groupName: "control", weight: 4 },
    { groupName: "blackLayer", weight: 2 },
    { groupName: "closeIconTop", weight: 1 },
    { groupName: "closeIconBottom", weight: 1 },
  ],
};

export const nextPageFromSearchTest: Test = {
  name: "nextPageFromSearch",
  userGroup: [{ groupName: "control", weight: 1 }, { groupName: "block", weight: 3 }],
};

export const bannerTest: Test = {
  name: "signBannerAtSearch-banner",
  userGroup: [{ groupName: "control", weight: 1 }, { groupName: "banner", weight: 2 }],
};

export const signButtonTextTest: Test = {
  name: "signBannerAtSearch-signButtonText",
  userGroup: [
    { groupName: "joinnow", weight: 1 },
    { groupName: "registernow", weight: 1 },
    { groupName: "signup", weight: 1 },
    { groupName: "yesofcourse", weight: 1 },
  ],
};

export const bodyTextTest: Test = {
  name: "signBannerAtSearch-bodyText",
  userGroup: [{ groupName: "a", weight: 1 }, { groupName: "b", weight: 1 }, { groupName: "c", weight: 1 }],
};

export const titleTextTest: Test = {
  name: "signBannerAtSearch-titleText",
  userGroup: [
    { groupName: "unlimited", weight: 1 },
    { groupName: "areyouresearcher", weight: 1 },
    { groupName: "bemember", weight: 1 },
  ],
};

export const viewPDFSignUpMainTextTest: Test = {
  name: "viewPDFSignUp-mainText",
  userGroup: [{ groupName: "control", weight: 1 }, { groupName: "unlimited", weight: 3 }],
};

export const signBannerAtPaperShowTest: Test = {
  name: "signBannerAtPaperShow-banner",
  userGroup: [{ groupName: "control", weight: 1 }, { groupName: "banner", weight: 2 }],
};

export const signBannerAtPaperShowTitleTextTest: Test = {
  name: "signBannerAtPaperShow-titleText",
  userGroup: [
    { groupName: "onlymember", weight: 1 },
    { groupName: "youcanmore", weight: 1 },
    { groupName: "enjoyeverything", weight: 1 },
  ],
};

export const signBannerAtPaperShowTitleTextKeyverbTest: Test = {
  name: "signBannerAtPaperShow-titleText-keyverb",
  userGroup: [{ groupName: "enjoy", weight: 1 }, { groupName: "browse", weight: 1 }],
};
