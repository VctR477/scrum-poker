import React from 'react';
import { CardColumn } from '../card-column';
import { SCALE } from '../../constants';
import './stack-box.css';

export const StackBox = (props) => {
    const {
        stackName,
        numberOfVoters,
        votes,
        myVotes,
    } = props;

    return (
        <div className="stack-box">
            <div className="stack-box__title">
                { stackName }, { numberOfVoters }
            </div>
            <div className="cards-box">
                { SCALE.map((item) => (
                    <CardColumn
                        key={ item }
                        value={ item }
                        isChosen={ myVotes && myVotes[stackName] && myVotes[stackName][item] }
                        amount={ votes[item] }
                    />
                )) }
            </div>
        </div>
    );
};
