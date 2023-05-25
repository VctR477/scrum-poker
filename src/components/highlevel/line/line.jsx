import React from 'react';
import ReactTooltip from 'react-tooltip';
import { CardRow } from '../card-row';
import { HIGHLEVEL_SCALE } from '../../../constants';
import './stack-box.css';

export const Line = (props) => {
    const {
        ready,
        isOpen,
        vote,
        onReject,
        result,
    } = props;

    return (
        <div className="stack-box">
            <ReactTooltip place="top" type="success" effect="float"/>
            <div className="stack-box__title">
                Примерный срок выполнения задачи
                <span
                    className="stack-box__count"
                    data-tip={ `Кол-во проголосовавших сотрудников: ${ready}` }
                >
                    , { ready }
                </span>
            </div>
            <div className="line line__highlevel">
                { Object.keys(HIGHLEVEL_SCALE).map((key) => (
                    <CardRow
                        key={ key }
                        value={ key }
                        isChosen={ vote && vote === key }
                        amount={ result && result[key] ? result[key] : 0 }
                        onReject={ onReject }
                        isOpen={ isOpen }
                    />
                )) }
            </div>
        </div>
    );
};
