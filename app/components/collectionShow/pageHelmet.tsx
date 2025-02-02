import React from 'react';
import Helmet from 'react-helmet';
import { Collection } from '../../model/collection';

const PageHelmet: React.FC<{ userCollection?: Collection }> = ({ userCollection }) => {
  if (!userCollection) return null;

  return (
    <Helmet>
      <title>{userCollection.title} | Scinapse</title>
      <link rel="canonical" href={`https://scinapse.io/collections/${userCollection.id}`} />
      <meta itemProp="name" content={`${userCollection.title} | Scinapse`} />
      <meta
        name="description"
        content={`${userCollection.createdBy.firstName} ${userCollection.createdBy.lastName || ''}'s ${
          userCollection.title
        } collection`}
      />
      <meta
        name="twitter:description"
        content={`${userCollection.createdBy.firstName} ${userCollection.createdBy.lastName || ''}'s ${
          userCollection.title
        } collection`}
      />
      <meta name="twitter:card" content={`${userCollection.title} | Scinapse`} />
      <meta name="twitter:title" content={`${userCollection.title} | Scinapse`} />
      <meta property="og:title" content={`${userCollection.title} | Scinapse`} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`https://scinapse.io/collections/${userCollection.id}`} />
      <meta
        property="og:description"
        content={`${userCollection.createdBy.firstName} ${userCollection.createdBy.lastName || ''}'s ${
          userCollection.title
        } collection`}
      />
    </Helmet>
  );
};

export default PageHelmet;
