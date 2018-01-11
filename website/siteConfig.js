/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'Wix.com',
    image: '/haste/img/wix-logo.png',
    infoLink: 'https://www.wix.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'Haste',
  tagline: 'An extendable, blazing fast build system that cares about user experience',
  url: 'https://wix.github.io/haste',
  baseUrl: '/haste/',
  projectName: 'Haste',
  organizationName: 'wix',
  algolia: {
    apiKey: '37a51befaf5367b0c3a7f7dd11336115',
    indexName: 'haste',
  },
  headerLinks: [
    { doc: 'core-concepts', label: 'Getting Started' },
    { doc: 'api-reference', label: 'API Reference' },
    { page: 'help', label: 'Help' },
    { search: true },
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/logo.png',
  footerIcon: 'img/logo.png',
  favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: '#393939',
    secondaryColor: '#525252',
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    `Copyright © ${
      new Date().getFullYear()
    } Ronen Amiel & Ran Yitzhaki`,
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'agate',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/wix/haste',
};

module.exports = siteConfig;
