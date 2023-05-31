import React from 'react';
import { useLocation } from "react-router-dom";
import './tabs.css';

const getUrls = (isAdmin) => ([
    {
        href: `/${isAdmin ? 'admin' : ''}`,
        text: 'Оценка задачи',
    },
    {
        href: `/satisfaction${isAdmin ? '/admin' : ''}`,
        text: 'Оценка спринта',
    },
    {
        href: `/highlevel${isAdmin ? '/admin' : ''}`,
        text: 'Верхнеуровневая оценка',
    },
]);



export const Tabs = ({ isAdmin, children }) => {
    const { pathname } = useLocation();

    const urls = getUrls(isAdmin);

    return (
        <div className="tabs">
            <div className="tabs__tabs">
                {
                    urls.map(({ href, text }) => (
                        <a
                            key={ text }
                            className={ `tabs__link${pathname === href ? ' tabs__link--select' : ''}` }
                            href={ href }
                        >
                            { text }
                        </a>
                    ))
                }
                <div className="tabs__filler"/>
            </div>
            <div className="tabs__content">{ children }</div>
        </div>
    );
};
