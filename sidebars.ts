import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: ['getting-started/install', 'getting-started/first-analysis', 'getting-started/reading-output'],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: ['concepts/dimensions', 'concepts/analyzers-and-findings', 'concepts/severity-and-scoring'],
    },
    {
      type: 'category',
      label: 'CLI reference',
      items: ['cli/analyze', 'cli/list', 'cli/init'],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: ['configuration/codelens-toml', 'configuration/per-rule-config', 'configuration/baselines-and-fail-on'],
    },
    {
      type: 'category',
      label: 'Output formats',
      items: ['output/terminal', 'output/json', 'output/json-schema', 'output/markdown', 'output/sarif'],
    },
    {
      type: 'category',
      label: 'Rules reference',
      link: { type: 'doc', id: 'rules/index' },
      items: [
        'rules/MAINT001-cyclomatic',
        'rules/MAINT003-fn-length',
        'rules/MAINT004-file-length',
        'rules/MAINT005-deep-nesting',
        'rules/DOC001-public-api-undoc',
        'rules/DOC002-todo-fixme',
        'rules/SEC001-hardcoded-secret',
        'rules/SEC002-eval-sink',
        'rules/SEC101-rust-unsafe',
        'rules/coming-soon',
      ],
    },
    {
      type: 'category',
      label: 'Extending',
      items: ['extending/add-a-language', 'extending/add-an-analyzer'],
    },
    'architecture',
  ],
};

export default sidebars;
