import React from 'react'
import {Route, IndexRoute} from 'react-router'

import App from '../Components/App'
import Connect from '../Components/Connect'
import Sign from '../Components/Sign'

export const routes = (
	<Route path='/' component={App}>
    <IndexRoute component={Connect} />
		<Route component={Connect} path='connect'/>
		<Route component={Sign} path='sign' />
  </Route>
)
