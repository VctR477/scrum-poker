import React from 'react';
import ReactTooltip from 'react-tooltip';
import { CardColumn } from '../card-column';
import { SATISFACTION_SCALE } from '../../../constants';
import './stack-box.css';

const getColor = (value) => {
    const average = Number(value);
    if (!average) {
        return null;
    }

    if (average < 5) {
        return 'negative';
    }

    if (average < 8) {
        return 'attention';
    }

    return 'positive';
};

export const Line = (props) => {
    const {
        ready,
        isOpen,
        vote,
        onReject,
        result,
        average,
    } = props;

    const averageColor = isOpen ? getColor(average) : null;

    return (
        <div className="stack-box">
            <ReactTooltip place="top" type="success" effect="float"/>
            <div className="stack-box__title">
                Оцените удовлетворённость прошедшим спринтом
                <span
                    className="stack-box__count"
                    data-tip={ `Кол-во проголосовавших сотрудников: ${ready}` }
                >
                    , { ready }
                </span>
            </div>
            <div className="line">
                { SATISFACTION_SCALE.map((item) => (
                    <CardColumn
                        key={ item }
                        value={ item }
                        isChosen={ vote && vote === item }
                        amount={ result && result[item] ? result[item] : 0 }
                        onReject={ onReject }
                        isOpen={ isOpen }
                        color={ isOpen ? getColor(item) : null }
                    />
                )) }
                { isOpen && (
                    <span className={ `average ${averageColor ? averageColor : ''}` }> ~ { average }</span>
                ) }
            </div>
        </div>
    );
};
