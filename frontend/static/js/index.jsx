// Import webpack entry files
import '../css/style.scss';
import './bootstrap/config';
import 'jquery';

import React from 'react';
import {render} from 'react-dom';
import ApolloApp from './ApolloApp';

// ReactDOM.render(<App />, document.getElement.ById('content'));
render(<ApolloApp/>, document.getElementById('root'));
