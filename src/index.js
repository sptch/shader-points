import React, { useEffect, useMemo, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { Canvas, useFrame } from "react-three-fiber"
import "./styles.css"
import { BrowserRouter as Router, Link, Switch, useHistory, Route, useLocation } from "react-router-dom";
import XYZModel from 'components/XYZModel'
import PLYModel from 'components/PLYModel'

const Home = ()=>{
  return <div>
  <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/hall">Hall</Link>
    </li>
    <li>
      <Link to="/room">Room</Link>
    </li>
    <li>
      <Link to="/lift">Lift</Link>
    </li>
  </ul>
  </div>
}

const App = ()=>{
  const [local] = useState(window.location.hostname==='localhost')

  return (
    <Router basename={local?"/":"/shader-points/"}>
      <Route path="/" exact >
        <Home/>
      </Route>
      <Route path='/hall' >
        <XYZModel url={local? 'models/32FFF.xyz': 'https://bby.blob.core.windows.net/$web/32FFF.xyz'} />
      </Route>
      <Route path='/room' >
        <PLYModel url='models/MaksyCrew.ply' />
      </Route>
      <Route path='/lift' >
        <PLYModel url='models/Lift.ply' />
      </Route>
    </Router>
  )
}

ReactDOM.render(<App/>, document.getElementById("root"))
