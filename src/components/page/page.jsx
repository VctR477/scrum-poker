import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { StackBox } from '../stack-box';
import { Button } from '../button';
import { STACKS } from '../../constants';
import './page.css';
import { myActionCreator, myActionCreator2 } from "../../actions";

const totalPeople = 38;
const voitedPeople = 35;
const myVotes = {
    'Front': {
        '8': true,
    },
    'Test': {
        '3': true,
    },
};

const userData = {
    isAdmin: false,
    isOpen: false,
    isReady: false,
    myVotes: {
        'Front': {
            '8': true,
        },
        'Test': {
            '3': true,
        },
    },
}

const common = {
    totalPeople: 38,
    voitedPeople: 35,
    result: {
        'Front': {
            '1': 9,
            '3': 3,
            '8': 8,
        },
        'Middle': {
            '2': 8,
            '20': 3,
            '13': 5,
        },
        'Pega': {
            '2': 1,
            '5': 3,
            '40': 4,
        },
        'Test': {
            '?': 4,
            '1': 7,
            '2': 2,
        },
        'Analyst': {
            '3': 4,
            '5': 2,
            '8': 3,
        },
    },
}

const result = {
    'Front': {
        '1': 9,
        '3': 3,
        '8': 8,
    },
    'Middle': {
        '2': 8,
        '20': 3,
        '13': 5,
    },
    'Pega': {
        '2': 1,
        '5': 3,
        '40': 4,
    },
    'Test': {
        '?': 4,
        '1': 7,
        '2': 2,
    },
    'Analyst': {
        '3': 4,
        '5': 2,
        '8': 3,
    },
};


export const Page = () => {
    const dispatch = useDispatch();

    const count = useSelector(state => state.count);

    const fn = () => {
        dispatch(myActionCreator());
    };

    const asyncFn = () => {
        dispatch(myActionCreator2(234234));
    };

    return (
        <div className="page">
            <div className="page__stacks">
                { STACKS.map((stack) => {
                    return (
                        <StackBox
                            key={ stack }
                            stackName={ stack }
                            votes={ result[stack] }
                            myVotes={ myVotes }
                        />
                    );
                }) }
            </div>
            <div className="page__controls">
                <div className="page__controls-header">
                    Проголосовали
                    <br />
                    { count } из { totalPeople }
                </div>
                <Button text="Я оценил" onClick={ fn }/>
                <Button text="Я не оценил" onClick={ asyncFn }/>
            </div>
        </div>
    );
};
