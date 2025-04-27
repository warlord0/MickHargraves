import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '',
    Svg: 'dummy.svg',
    description: '',
  },
  {
    title: 'The Michael "Mick" Hargraves Universe',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        This site hosts all of the world building components for the Mick 
        Hargraves novels. It details all of the lore used to write the 
        series to maintain a consistent approach to each story.
      </>
    ),
  },
  {
    title: '',
    Svg: 'dummy.svg',
    description: '',
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
