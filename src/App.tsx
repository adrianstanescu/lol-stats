import { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainMenu from './components/Main/MainMenu';

import Home from './pages/Home';
import Matches from './pages/Matches';

function App() {
    return (
        <Fragment>
            <MainMenu />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/matches" element={<Matches />} />
            </Routes>
        </Fragment>
    );
}

export default App;
