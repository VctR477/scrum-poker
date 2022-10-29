import React from 'react';
import './app.css';
import { StackBox } from "./components/stack-box";

const votes = {
    '1': 1,
    '3': 3,
    '8': 8,
}

const myVotes = {
    'Front': {
        '8': true,
    }
}

const App = () => (
    <div className="App">
        <StackBox stackName={'Front'} numberOfVoters={ 14 } votes={ votes } myVotes={ myVotes }/>
    </div>
);

export default App;
