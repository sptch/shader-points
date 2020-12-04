import React, { useEffect, useMemo, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { Canvas, useFrame } from "react-three-fiber"
import "./styles.css"
import { BrowserRouter as Router, useHistory, Route, useLocation } from "react-router-dom";
import XYZModel from 'components/XYZModel'
import PLYModel from 'components/PLYModel'

const App = ()=>{
  const [local] = useState(window.location.hostname==='localhost')
  const [lift] = useState('models/Lift.ply')
  const [room] = useState('models/MaksyCrew.ply')

  return (
    <Router>
      <Route path='/hall' exact >
        <XYZModel url={local? 'models/32FFF.xyz': 'https://bby.blob.core.windows.net/$web/32FFF.xyz'} />
      </Route>
      <Route path='/room' >
        <PLYModel url={room} />
      </Route>
      <Route path='/lift' >
        <PLYModel url={lift} />
      </Route>
    </Router>
  )
}

ReactDOM.render(<App/>, document.getElementById("root"))
