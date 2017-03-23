import React, {Component} from 'react'
import _ from 'lodash'

import {CHORD_VIEW, TREE_VIEW} from '../../reducers'
import TreeImageLight from './assets/tree-view-light.png'
import ChordImageLight from './assets/chord-view-light.png'

import TreeImageDark from './assets/tree-view-dark.png'
import ChordImageDark from './assets/chord-view-dark.png'

import './BreadcrumbsNav.scss'

class BreadcrumbsNav extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let props = this.props;
    let button;
    if (props.breadcrumbs.length === props.hierarchy.length - 1) {
      if (this.props.view === CHORD_VIEW) {
        button = (
          <button className="xoces-button chord-tree-button"
                  onClick={() => props.onChangeView(TREE_VIEW, _.last(props.breadcrumbs))}
          >
            <img src={props.schemeName === 'dark' ? TreeImageLight : TreeImageDark} />
          </button>
        )
      } else {
        button = (
          <button className="xoces-button chord-tree-button"
                  onClick={() => props.onChangeView(CHORD_VIEW, _.last(props.breadcrumbs))}
          >
            <img src={props.schemeName === 'dark' ? ChordImageLight : ChordImageDark} />
          </button>
        )
      }

    }

    return (
      <div className={`xoces-breadcrumbs-nav clearfix ${this.props.schemeName}`}>
        {_.map(props.breadcrumbs, (crumb, idx) => {
          let lastStyle = (idx === props.breadcrumbs.length - 1) ? 'last' : null

          return (
            <div key={`crumb_${crumb.id}`} className="xoces-breadcrumb" onClick={(e) => props.onClickBreadcrumb(crumb)}>
              <p className={`breadcrumb__text ${lastStyle}`}>
                {crumb[props.entityLabelKey]} &thinsp;
                <span className="crumb__type">({_.capitalize(crumb.type)})</span>
              </p>
            </div>
          )
        })}

        {button}
      </div>
    )
  }
}

export default BreadcrumbsNav
