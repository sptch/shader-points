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
      <Link to="/will-not-match">Lift</Link>
    </li>
  </ul>
  </div>
}

const App = ()=>{
  const [local] = useState(window.location.hostname==='localhost')

  return (
    <Router>
      <Route path="/" exact >
        <Home/>
      </Route>
      <Route path='/hall' exact >
        <XYZModel url={local? 'models/32FFF.xyz': 'https://bby.blob.core.windows.net/$web/32FFF.xyz'} />
      </Route>
      <Route path='/room' exact >
        <PLYModel url='models/MaksyCrew.ply' />
      </Route>
      <Route path='/lift' exact >
        <PLYModel url='models/Lift.ply' />
      </Route>
    </Router>
  )
}

ReactDOM.render(<App/>, document.getElementById("root"))
