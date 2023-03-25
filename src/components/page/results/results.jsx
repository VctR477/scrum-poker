import React, { useEffect, memo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import './results.css';
import {fetchResultData, fetchResultsList, setOpenedId} from "../../../actions/results-actions";
import { Button } from "../button";

export const Results = memo(() => {
    const dispatch = useDispatch();
    const resultList = useSelector(state => state.results.list);

    useEffect(() => {
        dispatch(fetchResultsList());
    }, []);

    const handleClick = (line) => {
        dispatch(setOpenedId(line));
        dispatch(fetchResultData(line));
    };

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
                        console.log({
                            date,
                            line,
                        })
                        const text = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
                        return (
                            <Button
                                key={ line }
                                text={ text }
                                onClick={ () => handleClick(line) }
                                type="result"
                            />
                        );
                    })
                }
            </div>
        </div>
    );
});
