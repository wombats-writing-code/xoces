//index.js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import _ from 'lodash'

import './styles/foundation.min.css'
import './styles/core.scss'

import reducer from './reducers'
import {setConfig} from './reducers/setConfig'

import XocesWidget from './widgets/XocesWidget';
import graphProvider from './components/graph'

let store = createStore(reducer)


module.exports = {
  config: (config) => {
  },

  widgets: {
     XocesWidget: {
       new: (config) => {
           let uid = _.uniqueId('xoces_widget_');

           return {
             render(arg) {
               let container;
               if (_.isString(arg.container)) {
                 container = document.getElementById(arg.container);
               } else {
                 container = arg.container;
               }

               let props = _.assign({}, config, arg);

               store.dispatch(setConfig(props))

               ReactDOM.render(
                 <Provider store={store}>
                   <XocesWidget {...props}/>
                 </Provider>,
                 container,
                 arg.callback
               )
             }
           }
        }
     },
   },
   libs: {
     graphProvider
   },
}
