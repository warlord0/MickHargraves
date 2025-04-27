import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Comprehensive Lore',
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Explore the complete metaphysical framework of the Black Eyes & Broken 
        Souls universe, from the nature of the realms to the intricacies of 
        demonic hierarchy.
      </>
    ),
  },
  {
    title: 'Character Insights',
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        Understand the complex relationships between entities like Marchosias
        and Lilaeth, and how they fit into the broader supernatural landscape.
      </>
    ),
  },
  {
    title: 'Metaphysical Mechanics',
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        Delve into the mechanics of shadow travel, essence manipulation, and
        the nature of thin places where realms bleed together.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title="Home"
      description="Comprehensive lore documentation for Black Eyes & Broken Souls">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/lore/Cosmology and Metaphysics')}>
              Explore the Lore
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;