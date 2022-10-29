import React from 'react';
import { StackBox } from '../stack-box';
import { Button } from '../button';
import { STACKS } from '../../constants';
import './page.css';

const myVotes = {
    'Front': {
        '8': true,
    },
    'Test': {
        '3': true,
    },
}

const data = {
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
    return (
        <div className="page">
            <div className="page__stacks">
                { STACKS.map((stack) => {
                    return (
                        <StackBox
                            key={ stack }
                            stackName={ stack }
                            votes={ data[stack] }
                            myVotes={ myVotes }
                        />
                    );
                }) }
            </div>
            <div className="page__controls">
                <Button text="Я оценил" disabled={ true }/>
                <Button text="Я оценил"/>
                <Button text="Вскрываемся" type="open" disabled={ true }/>
                <Button text="Вскрываемся" type="open"/>
                <Button text="Заново" type="repeat" disabled={ true }/>
                <Button text="Заново" type="repeat"/>
            </div>
        </div>
    );
};
