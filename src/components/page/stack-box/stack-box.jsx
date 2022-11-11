import React from 'react';
import { CardColumn } from './card-column';
import { SCALE } from '../../../constants';
import './stack-box.css';

export const StackBox = (props) => {
    const {
        stackName,
        resultByStack,
        myVotes,
        onReject,
        sumByStack,
        isOpen,
    } = props;

    // const numberOfVoters = votes ? Object.keys(votes).reduce((acc, item) => {
    //     const sum = acc + votes[item];
    //     return sum;
    // }, 0) : 0;

    return (
        <div className="stack-box">
            <div className="stack-box__title">
                { stackName }, { sumByStack }
            </div>
            <div className="cards-box">
                { SCALE.map((item) => (
                    <CardColumn
                        key={ item }
                        value={ item }
                        isChosen={ myVotes && myVotes[stackName] && myVotes[stackName] === item }
                        amount={ resultByStack && resultByStack[item] ? resultByStack[item] : 0 }
                        stackName={ stackName }
                        onReject={ onReject }
                        isOpen={ isOpen }
                    />
                )) }
            </div>
        </div>
    );
};
