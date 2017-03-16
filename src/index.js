//index.js
import React from 'react'
import ReactDOM from 'react-dom'
import ChordWidget from './components/ChordWidget';
import _ from 'lodash'

module.exports = {
  config: (config) => {
    LibConfig = config;
  },

  widgets: {
     ChordWidget: {
       new: (config) => {
           let uid = _.uniqueId('chord_widget_');

           return {
             render(arg) {
               let container;
               if (_.isString(arg.container)) {
                 container = document.getElementById(arg.container);
               } else {
                 container = arg.container;
               }

               let props = _.assign({}, config, arg);
               let validatedProps = validateProps(props);

               ReactDOM.render(
                   <ChordWidget {...props}/>,
                   container,
                   arg.callback
               )
             }
           }
        }
     }
   }
}

function validateProps(props) {

  // if (!)

  return _.assign({}, props);
}
