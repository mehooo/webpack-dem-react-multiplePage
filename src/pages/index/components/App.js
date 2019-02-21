import React from 'react'
import { hot } from 'react-hot-loader'
import Common from '../../../commons/components/common'
import ComponentA from './ComponentA'

console.log(module);
const App = () => (
    <div>
        Index Changing!<br />
        <Common/>
        <ComponentA/>
    </div>
)

export default hot(module)(App)
// export default App