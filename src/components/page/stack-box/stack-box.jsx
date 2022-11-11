import React from 'react';
import { CardColumn } from './card-column';
import { SCALE } from '../../../constants';
import './stack-box.css';

export const StackBox = (props) => {
    const {
        stackName,
        votes,
        myVotes,
        onReject,
    } = props;

    const numberOfVoters = votes ? Object.keys(votes).reduce((acc, item) => {
        const sum = acc + votes[item];
        return sum;
    }, 0) : 0;

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
                        isChosen={ myVotes && myVotes[stackName] && myVotes[stackName] === item }
                        amount={ votes && votes[item] ? votes[item] : 0 }
                        stackName={ stackName }
                        onReject={ onReject }
                    />
                )) }
            </div>
        </div>
    );
};
