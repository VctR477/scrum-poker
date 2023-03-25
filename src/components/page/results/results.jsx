import React, { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResultData, fetchResultsList, setOpenedId } from '../../../actions/results-actions';
import { Button } from '../button';

import './results.css';
import {STACKS} from "../../../constants";
import {StackBox} from "../stack-box";

export const Results = memo(() => {
    const dispatch = useDispatch();
    const resultList = useSelector(state => state.results.list);
    const openedData = useSelector(state => state.results.openedData);
    const openedId = useSelector(state => state.results.openedId);

    const selectedResult = openedData[openedId];

    useEffect(() => {
        dispatch(fetchResultsList());
    }, []);

    const handleClick = (line) => {
        dispatch(setOpenedId(line));
        dispatch(fetchResultData(line));
    };

    const handleClose = () => {
        dispatch(setOpenedId(null));
    }

    if (!resultList || !resultList.length) {
        return null;
    }

    return (
        <div>
            <div className="title">
                Результаты голосований:
            </div>
            <div className="results">
                {
                    resultList.map((line) => {
                        const date = new Date(line);

                        const text = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
                        return (
                            <Button
                                key={ line }
                                text={ text }
                                onClick={ () => handleClick(line) }
                                type="result"
                                extraClass={ String(openedId) === String(line) ? 'button-result--selected ' : '' }
                            />
                        );
                    })
                }
            </div>
            {
                selectedResult && (
                    <div className="modal">
                        <div
                            onClick={ handleClose }
                            className="close-modal"
                        />
                        <div className="page results-page">
                            <div className="page__stacks">
                                { STACKS.map((stack) => {
                                    return (
                                        <StackBox
                                            key={ stack }
                                            stackName={ stack }
                                            resultByStack={ selectedResult.result[stack] }
                                            myVotes={ null }
                                            onReject={ null }
                                            sumByStack={ selectedResult.sumByStack[stack] }
                                            isOpen={ selectedResult.isOpen }
                                        />
                                    );
                                }) }
                            </div>
                            <div className="page__controls">
                                <div className="page__controls-header">
                                    Проголосовали
                                    <br />
                                    { selectedResult.ready } из { selectedResult.all }
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
});
