import React, {Component} from 'react'
import _ from 'lodash'

import './BreadcrumbsNav.scss'

class BreadcrumbsNav extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let props = this.props;

    return (
      <div className={`breadcrumbs-nav clearfix ${this.props.schemeName}`}>
        {_.map(props.breadcrumbs, (crumb, idx) => {
          let lastStyle = (idx === props.breadcrumbs.length - 1) ? 'last' : null

          return (
            <div key={`crumb_${crumb.id}`} className="breadcrumb">
              <p className={`breadcrumb__text ${lastStyle}`}>{crumb[props.entityLabelKey]}</p>
            </div>
          )
        })}
      </div>
    )
  }
}

export default BreadcrumbsNav
