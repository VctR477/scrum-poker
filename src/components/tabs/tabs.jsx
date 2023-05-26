import React from 'react';
import { useLocation } from "react-router-dom";
import './tabs.css';

const URLS = [
    {
        href: '/',
        text: 'Оценка задачи',
    },
    {
        href: '/satisfaction',
        text: 'Оценка спринта',
    },
    {
        href: '/highlevel',
        text: 'Верхнеуровневая оценка',
    },
];

export const Tabs = ({ isAdmin, children }) => {
    const { pathname } = useLocation();
    let targetPath = isAdmin ? pathname.replace('/admin', '') : pathname;
    if (!targetPath) {
        targetPath = '/';
    }
    return (
        <div className="tabs">
            <div className="tabs__tabs">
                {
                    URLS.map(({ href, text }) => (
                        <a
                            key={ text }
                            className={ `tabs__link${targetPath === href ? ' tabs__link--select' : ''}` }
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
