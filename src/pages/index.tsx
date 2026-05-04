import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const dimensions = [
  {name: 'Maintainability', desc: 'Length, nesting, branching — how easy the code is to change.'},
  {name: 'Security', desc: 'Hardcoded secrets, eval sinks, unsafe blocks.'},
  {name: 'Complexity', desc: 'Project-level fan-out and dependency cycles.'},
  {name: 'Documentation', desc: 'Public-API doc coverage and TODO/FIXME inventory.'},
  {name: 'Test smell', desc: 'Test ratio, missing assertions, skipped tests.'},
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">{siteConfig.title}</Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/getting-started/install">Get started</Link>
          <Link className="button button--outline button--secondary button--lg" style={{marginLeft: '1rem'}} to="/rules/">Browse rules</Link>
        </div>
      </div>
    </header>
  );
}

function DimensionsSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Heading as="h2">Five dimensions</Heading>
        <p>codelens groups every finding under one of five named dimensions and emits an independent 0–100 score for each.</p>
        <div className={styles.cardGrid}>
          {dimensions.map((d) => (
            <Link key={d.name} className={styles.card} to="/concepts/dimensions">
              <Heading as="h3" className={styles.cardTitle}>{d.name}</Heading>
              <p className={styles.cardDesc}>{d.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickStartSection() {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <Heading as="h2">Quick start</Heading>
        <pre className={styles.code}>
          <code>{`git clone https://github.com/shubhamkaushal/codelens && cd codelens
cargo build --release -p codelens-cli
./target/release/codelens analyze ./src`}</code>
        </pre>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout title="codelens" description="Static code analysis for Rust, Python, and JavaScript/TypeScript">
      <HomepageHeader />
      <main>
        <DimensionsSection />
        <QuickStartSection />
      </main>
    </Layout>
  );
}
