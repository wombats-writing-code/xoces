//index.js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import _ from 'lodash'

import './styles/foundation.min.css'
import './styles/core.scss'

import reducer from './reducers'
import {setConfig, setConfigTree} from './reducers/setConfig'

import XocesWidget from './widgets/XocesWidget';
import ChordWidget from './widgets/ChordWidget';
import TreeWidget from './widgets/TreeWidget';
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
             let container = _getContainer(arg.container);
             let props = _.assign({}, config, arg, {
               __widgetType: 'XocesWidget'
             });

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
     ChordWidget: {
       new: (config) => {
         let uid = _.uniqueId('xoces_chord_widget_');

         return {
           render(arg) {
             let container = _getContainer(arg.container);
             let props = _.assign({}, config, arg, {
               __widgetType: 'ChordWidget'
             });

             store.dispatch(setConfig(props))

             ReactDOM.render(
               <Provider store={store}>
                 <ChordWidget {...props}/>
               </Provider>,
               container,
               arg.callback
             )
           }
         }
      }
     },
     TreeWidget: {
       new: (config) => {
         let uid = _.uniqueId('xoces_tree_widget_');

         return {
           render(arg) {
             let container = _getContainer(arg.container);
             let props = _.assign({}, config, arg, {
               __widgetType: 'TreeWidget'
             });

             store.dispatch(setConfigTree(props))

             ReactDOM.render(
               <Provider store={store}>
                 <TreeWidget {...props}/>
               </Provider>,
               container,
               arg.callback
             )
           }
         }
        }
     }
   },
   libs: {
     graphProvider
   },
}

function _getContainer(container) {
  if (_.isString(container)) {
    return document.getElementById(container);
  } else if (container) {
    return container;
  }

  return container = document.body;
}
