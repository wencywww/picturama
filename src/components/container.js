import fs from 'fs';
import React from 'react';
import { connect } from 'react-redux';

import Library from './library';
import Settings from './settings';
import Progress from './progress';

import config from './../config';

@connect(state => ({
  photos: state.photos
}))

export default class Container extends React.Component {
  static propTypes = {
    className: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.areSettingsExisting = this.areSettingsExisting.bind(this);

    this.state = { settingsExists: false, scrollTop: 0, isImporting: false };
  }

  handleScrollTop(scrollTop) {
    this.refs.container.scrollTop = scrollTop;
  }

  areSettingsExisting() {
    let state = this.state;
    state.settingsExists = fs.existsSync(config.settings);
    this.setState(state);
  }

  handleImport(store) {
    let state = this.state;
    state.isImporting = store.importing;
    this.setState(state);
  }

  componentDidMount() {
    this.areSettingsExisting();
    //PhotoStore.listen(this.handleImport.bind(this));
  }

  render() {
    let content = <Settings setSavedFile={this.areSettingsExisting}/>;

    if (this.state.settingsExists)
      content = <Library setScrollTop={this.handleScrollTop.bind(this)}/>;

    if (this.state.isImporting)
      content = <Progress />;

    return (
      <div id="container" ref="container" className={this.props.className}>
        {content}
      </div>
    );
  }
}
