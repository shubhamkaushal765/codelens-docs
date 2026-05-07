import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: [
        'getting-started/install',
        'getting-started/first-analysis',
        'getting-started/reading-output',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/dimensions',
        'concepts/analyzers-and-findings',
        'concepts/severity-and-scoring',
      ],
    },
    {
      type: 'category',
      label: 'CLI reference',
      items: [
        'cli/analyze',
        'cli/list',
        'cli/init',
        'cli/show',
        'cli/report',
        'cli/diff',
        'cli/baseline',
        'cli/watch',
        'cli/install-hook',
        'cli/lsp',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: [
        'configuration/codelens-toml',
        'configuration/per-rule-config',
        'configuration/baselines-and-fail-on',
      ],
    },
    {
      type: 'category',
      label: 'Output formats',
      items: [
        'output/terminal',
        'output/json',
        'output/json-schema',
        'output/markdown',
        'output/sarif',
      ],
    },
    {
      type: 'category',
      label: 'Rules reference',
      link: { type: 'doc', id: 'rules/index' },
      items: [
        'rules/suppression',
        {
          type: 'category',
          label: 'Maintainability',
          items: [
            'rules/MAINT001-cyclomatic',
            'rules/MAINT002-cognitive',
            'rules/MAINT003-fn-length',
            'rules/MAINT004-file-length',
            'rules/MAINT005-deep-nesting',
            'rules/MAINT006-too-many-params',
            'rules/MAINT007-return-complexity',
          ],
        },
        {
          type: 'category',
          label: 'Security',
          items: [
            'rules/SEC001-hardcoded-secret',
            'rules/SEC002-eval-sink',
            'rules/SEC003-shell-injection',
            'rules/SEC004-weak-crypto',
            'rules/SEC005-insecure-deser',
            'rules/SEC006-sql-injection',
            'rules/SEC007-path-traversal',
            'rules/SEC101-rust-unsafe',
          ],
        },
        {
          type: 'category',
          label: 'Complexity',
          items: [
            'rules/CPLX001-fan-out',
            'rules/CPLX002-cyclic-deps',
            'rules/CPLX003-duplicate-code',
          ],
        },
        {
          type: 'category',
          label: 'Documentation',
          items: [
            'rules/DOC001-public-api-undoc',
            'rules/DOC002-todo-fixme',
            'rules/DOC003-empty-doc',
          ],
        },
        {
          type: 'category',
          label: 'Test smell',
          items: [
            'rules/TEST001-test-ratio',
            'rules/TEST002-no-asserts',
            'rules/TEST003-skipped',
            'rules/TEST004-flaky-time',
            'rules/TEST005-assert-count',
          ],
        },
        {
          type: 'category',
          label: 'Dependencies',
          items: [
            'rules/DEP001-vulnerable-deps',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Integrations',
      items: [
        'integrations/github-action',
        'integrations/lsp',
      ],
    },
    {
      type: 'category',
      label: 'Extending',
      items: [
        'extending/add-a-language',
        'extending/add-an-analyzer',
      ],
    },
    {
      type: 'category',
      label: 'Design',
      items: ['design/color-system'],
    },
    'architecture',
  ],
};

export default sidebars;
