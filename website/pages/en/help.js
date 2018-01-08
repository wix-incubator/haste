/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

class Help extends React.Component {
  render() {
    const supportLinks = [
      {
        content:
          'Learn more using the [documentation on this site.](/haste/docs/core-concepts.html)',
        title: 'Browse the documentation',
      },
      {
        content: "Open [Issues](https://github.com/wix/haste/issues/new) or [Pull Requests](https://github.com/wix/haste/compare) for bugs you find or any new features you may want. Please make sure to go over the [contributing guide](https://github.com/wix/haste/blob/master/CONTRIBUTING.md).",
        title: 'Github',
      },
      {
        content:
          'Have a look at the [changelog](https://github.com/wix/haste/blob/master/CHANGELOG.md)',
        title: 'Stay up to date',
      },
    ];

    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h2>Need help?</h2>
            </header>
            <p>Haste is actively maintained, If you need any help, please use one of the mechanisms below</p>
            <GridBlock contents={supportLinks} layout="threeColumn" />
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Help;
