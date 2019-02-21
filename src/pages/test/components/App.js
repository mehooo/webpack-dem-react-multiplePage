import React from 'react'
import { hot } from 'react-hot-loader'
import Common from '../../../commons/components/common'
import ComponentD from './ComponentD'


const App = () => (
    <div>
        Test Change<br />
        <Common/>
        <ComponentD/>
    </div>
)

export default hot(module)(App)