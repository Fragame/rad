/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduzione',
      items: ['intro'],
    },
    {
      type: 'category',
      label: 'Parte Prima',
      collapsed: false,
      items: [
        'chapter1',
        'chapter2',
        'chapter3',
        'chapter4',
        'chapter5',
        'chapter6',
		'chapter7',
		'chapter8',
		'chapter9',
		'chapter10',
		'chapter11',
		'chapter12',
		'chapter13',
		'chapter14',
		'chapter15',
		'chapter16',
		'chapter17',
		'chapter18',
		'chapter19',
		'chapter20',
		'chapter21',
		'chapter22',
		'chapter23',
		'chapter24',
		'chapter25',
		'chapter26',
		'chapter27',
		'chapter28',
		'chapter29',
		'chapter30',
		'chapter31',
		],
    },
    {
      type: 'category',
      label: 'Appendici',
      items: [
        'chapterX',
        'appendix-a',
        'appendix-b',
      ],
    },
  ],
};

export default sidebars;