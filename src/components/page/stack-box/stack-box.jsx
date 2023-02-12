import React from 'react';
import ReactTooltip from 'react-tooltip';
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

    return (
        <div className="stack-box">
            <ReactTooltip place="top" type="success" effect="float"/>
            <div className="stack-box__title">
                { stackName }
                <span
                    className="stack-box__count"
                    data-tip={ `Кол-во сотрудников оценивших ${stackName}: ${sumByStack}` }
                >
                    , { sumByStack }
                </span>
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
