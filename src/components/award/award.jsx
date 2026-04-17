import React, { useEffect, useMemo, useState } from 'react';
import './award.css';

const parseNumber = (value) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const normalized = String(value).replace(/\s/g, '').replace(',', '.');
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
};

const formatMoney = (value) => {
    const n = Number.isFinite(value) ? value : 0;
    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(n);
};

const FormulaSvg = () => {
    return (
        <svg width="980" height="120" viewBox="0 0 980 120" role="img" aria-label="Формула премии">
            <rect x="10" y="22" width="175" height="56" rx="12" fill="white" stroke="#D05C54" strokeWidth="2" />
            <text x="97" y="55" textAnchor="middle" fontSize="14" fill="#333">Размер премии</text>

            <text x="205" y="57" textAnchor="middle" fontSize="20" fill="#333">=</text>

            <rect x="225" y="22" width="70" height="56" rx="28" fill="white" stroke="#D05C54" strokeWidth="2" />
            <text x="260" y="57" textAnchor="middle" fontSize="16" fill="#333">ЦРП</text>

            <text x="312" y="57" textAnchor="middle" fontSize="20" fill="#333">×</text>

            <rect x="330" y="22" width="160" height="56" rx="12" fill="white" stroke="#D05C54" strokeWidth="2" />
            <text x="410" y="46" textAnchor="middle" fontSize="13" fill="#333">SC (стрима / КП)</text>
            <text x="410" y="64" textAnchor="middle" fontSize="11" fill="#555">ScoreCard</text>

            <text x="508" y="57" textAnchor="middle" fontSize="20" fill="#333">×</text>

            <rect x="525" y="22" width="70" height="56" rx="28" fill="white" stroke="#D05C54" strokeWidth="2" />
            <text x="560" y="57" textAnchor="middle" fontSize="16" fill="#333">VOC</text>

            <text x="612" y="57" textAnchor="middle" fontSize="20" fill="#333">×</text>

            <rect x="630" y="22" width="165" height="56" rx="12" fill="white" stroke="#D05C54" strokeWidth="2" />
            <text x="712" y="49" textAnchor="middle" fontSize="12" fill="#333">Оценка руководителя</text>
            <text x="712" y="66" textAnchor="middle" fontSize="11" fill="#555">50% CJO + 50% ФР</text>

            <text x="812" y="57" textAnchor="middle" fontSize="20" fill="#333">×</text>

            <rect x="830" y="22" width="54" height="56" rx="28" fill="white" stroke="#D05C54" strokeWidth="2" />
            <text x="857" y="57" textAnchor="middle" fontSize="16" fill="#333">H</text>

            <text x="902" y="57" textAnchor="middle" fontSize="20" fill="#333">+</text>

            <rect x="922" y="22" width="48" height="56" rx="12" fill="white" stroke="#D05C54" strokeWidth="2" />
            <text x="946" y="57" textAnchor="middle" fontSize="14" fill="#333">ПФР</text>
        </svg>
    );
};

export const Award = () => {
    const [salaryPerMonth, setSalaryPerMonth] = useState('');
    const [targetPercent, setTargetPercent] = useState('15');
    const [sc, setSc] = useState('1');
    const [voc, setVoc] = useState('1');

    useEffect(() => {
        const defaultTitle = 'ONA · Scrum Poker';
        const awardTitle = 'ONA · Расчёт квартальной премии';
        document.title = awardTitle;
        return () => {
            document.title = defaultTitle;
        };
    }, []);

    const crp = useMemo(() => {
        const salary = parseNumber(salaryPerMonth);
        const cpp = parseNumber(targetPercent);
        return salary * 3 * (cpp / 100);
    }, [salaryPerMonth, targetPercent]);

    const premium = useMemo(() => {
        const scN = parseNumber(sc);
        const vocN = parseNumber(voc);
        // По условиям страницы: H всегда 1, Оценка всегда 1, ПФР не учитываем.
        return crp * scN * vocN;
    }, [crp, sc, voc]);

    return (
        <div className="award">
            <div className="award__grid">
                <div className="award__card">
                    <h2 className="award__title">Калькулятор премии (клиентский путь)</h2>

                    <div className="award__svgWrap">
                        <FormulaSvg />
                    </div>

                    <div className="award__muted" style={{ marginTop: 10 }}>
                        На этой странице применяем упрощение: <b>H = 1</b>, <b>Оценка руководителя = 1</b>, <b>ПФР не учитываем</b>.
                        Поэтому расчёт: <b>Размер премии = ЦРП × SC × VOC</b>.{' '}
                        <a
                            href="https://confluence.moscow.alfaintra.net/spaces/ONA/pages/2249274173/%D0%9F%D1%80%D0%B5%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5+%D1%83%D1%87%D0%B0%D1%81%D1%82%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2+%D0%9A%D0%BB%D0%B8%D0%B5%D0%BD%D1%82%D1%81%D0%BA%D0%B8%D1%85+%D0%BF%D1%83%D1%82%D0%B5%D0%B9"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Подробнее на странице
                        </a>
                    </div>

                    <div className="award__card" style={{ marginTop: 16 }}>
                        <h3 className="award__title">Условия премирования за квартал</h3>
                        <div className="award__muted">
                            - сотрудник в штате Банка<br />
                            - включён в клиентский путь не менее 51% (≥ 51%)<br />
                            - отработал в КП не менее 60 дней за расчётный квартал
                        </div>
                    </div>

                    <div className="award__card" style={{ marginTop: 16 }}>
                        <h3 className="award__title">Расшифровка</h3>
                        <div className="award__muted">
                            <b>ЦРП</b> — целевой размер премии. В этом калькуляторе считаем от <b>оклада за месяц</b> и <b>ЦПП</b> (формула <b>оклад × 3 × ЦПП</b>).<br /><br />
                            <b>ЦПП</b> — целевой процент премии (по умолчанию 15%).<br />
                            <b>SC</b> — ScoreCard (КПЭ для КП/стрима).<br />
                            <b>VOC</b> — Voice of Client (метрика “голос клиента”).<br />
                            <b>Оценка</b> — 50% CJO + 50% ФР (диапазон 5%–150%).<br />
                            <b>H</b> — поправочный коэффициент 0..1.<br />
                            <b>ПФР</b> — премиальный фонд руководителя (диапазон 5%–150%).
                        </div>
                    </div>
                </div>

                <div className="award__card award__card--inputs">
                    <h3 className="award__title">Ввод значений</h3>

                    <div className="award__form">
                        <div className="award__field">
                            <div className="award__label">Оклад за месяц (₽)</div>
                            <input
                                className="award__input"
                                value={ salaryPerMonth }
                                onChange={ (e) => setSalaryPerMonth(e.target.value) }
                                inputMode="decimal"
                                placeholder="например 150000"
                            />
                        </div>

                        <div className="award__field">
                            <div className="award__label">ЦПП (целевой % премии)</div>
                            <input
                                className="award__input"
                                value={ targetPercent }
                                onChange={ (e) => setTargetPercent(e.target.value) }
                                inputMode="decimal"
                                placeholder="15"
                            />
                            <div className="award__muted" style={{ fontSize: 12 }}>
                                Узнай ЦПП у руководителя.
                            </div>
                        </div>

                        <div className="award__field">
                            <div className="award__label">ЦРП (оклад × 3 × ЦПП)</div>
                            <input
                                className="award__input award__input--readonly"
                                value={ formatMoney(crp) }
                                readOnly
                                inputMode="decimal"
                                placeholder="0"
                            />
                        </div>

                        <div className="award__scvoc">
                            <div className="award__field">
                                <div className="award__label">SC (коэффициент)</div>
                                <input
                                    className="award__input"
                                    value={ sc }
                                    onChange={ (e) => setSc(e.target.value) }
                                    inputMode="decimal"
                                    placeholder="например 1"
                                />
                            </div>

                            <div className="award__field">
                                <div className="award__label">VOC (коэффициент)</div>
                                <input
                                    className="award__input"
                                    value={ voc }
                                    onChange={ (e) => setVoc(e.target.value) }
                                    inputMode="decimal"
                                    placeholder="например 1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="award__result">
                        <div>
                            <div className="award__label">Расчётная премия (без ПФР, при H=1 и Оценка=1)</div>
                            <div className="award__bigNumber">{ formatMoney(premium) } ₽</div>
                        </div>

                        <div className="award__important">
                            <div className="award__important-title">
                                <span className="award__important-title-bold">⚠️ Важно</span>
                                <span className="award__important-title-note"> (учтите эти пункты самостоятельно)</span>
                            </div>
                            <ul className="award__important-list">
                                <li>НДФЛ в расчёт не включён.</li>
                                <li>
                                    Если квартал отработан не полностью, но вы в КП не менее 60 дней, итоговая сумма будет
                                    пропорциональна отработанным дням.
                                </li>
                                <li>Вы должны быть в штате Банка и включены в КП ≥ 51%.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

