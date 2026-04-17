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
            <text x="260" y="57" textAnchor="middle" fontSize="16" fill="#333">ЦПР</text>

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
    const [cprManual, setCprManual] = useState(false);
    const [cprValue, setCprValue] = useState('');
    const [sc, setSc] = useState('1');
    const [voc, setVoc] = useState('1');

    const [inStaff, setInStaff] = useState(true);
    const [includedPercent, setIncludedPercent] = useState('51');
    const [daysInPath, setDaysInPath] = useState('60');

    const cprAuto = useMemo(() => {
        const salary = parseNumber(salaryPerMonth);
        const pct = parseNumber(targetPercent);
        return salary * 3 * (pct / 100);
    }, [salaryPerMonth, targetPercent]);

    useEffect(() => {
        if (!cprManual) {
            setCprValue(String(cprAuto || 0));
        }
    }, [cprAuto, cprManual]);

    const cpr = useMemo(() => {
        return cprManual ? parseNumber(cprValue) : cprAuto;
    }, [cprAuto, cprManual, cprValue]);

    const eligibility = useMemo(() => {
        const pct = parseNumber(includedPercent);
        const days = parseNumber(daysInPath);
        const ok = Boolean(inStaff) && pct >= 51 && days >= 60;
        return {
            ok,
            pct,
            days,
        };
    }, [inStaff, includedPercent, daysInPath]);

    const premium = useMemo(() => {
        const scN = parseNumber(sc);
        const vocN = parseNumber(voc);
        // По условиям страницы: H всегда 1, Оценка всегда 1, ПФР не учитываем.
        return cpr * scN * vocN;
    }, [cpr, sc, voc]);

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
                        Поэтому расчёт: <b>Размер премии = ЦПР × SC × VOC</b>.{' '}
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
                            <b>ЦПР</b> — целевой размер премии. Обычно считаем от <b>оклада за месяц</b> и <b>целевого % премии</b> (формула <b>оклад × 3 × %</b>), но при нестандартном случае можно ввести ЦПР вручную.<br /><br />
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
                            <div className="award__label">Целевой % премии</div>
                            <input
                                className="award__input"
                                value={ targetPercent }
                                onChange={ (e) => setTargetPercent(e.target.value) }
                                inputMode="decimal"
                                placeholder="15"
                            />
                        </div>

                        <div className="award__field">
                            <div className="award__label">ЦПР</div>
                            <input
                                className={ `award__input${cprManual ? '' : ' award__input--readonly'}` }
                                value={ cprManual ? cprValue : formatMoney(cprAuto) }
                                onChange={ cprManual ? (e) => setCprValue(e.target.value) : undefined }
                                readOnly={ !cprManual }
                                inputMode="decimal"
                                placeholder="введите ЦПР"
                            />
                            <div className="award__muted" style={{ fontSize: 12 }}>
                                Узнай ЦПР у руководителя.
                            </div>
                        </div>

                        <div className="award__field award__field--checkboxAlign">
                            <label className="award__checkboxRow">
                                <input
                                    type="checkbox"
                                    checked={ cprManual }
                                    onChange={ (e) => setCprManual(e.target.checked) }
                                />
                                <span className="award__label">Ввести ЦПР вручную</span>
                            </label>
                        </div>

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

                        <div className="award__field">
                            <div className="award__label">В штате Банка</div>
                            <label className="award__checkboxRow">
                                <input
                                    type="checkbox"
                                    checked={ inStaff }
                                    onChange={ (e) => setInStaff(e.target.checked) }
                                />
                                Да
                            </label>
                        </div>

                        <div className="award__field">
                            <div className="award__label">Включён в КП, %</div>
                            <input
                                className="award__input"
                                value={ includedPercent }
                                onChange={ (e) => setIncludedPercent(e.target.value) }
                                inputMode="decimal"
                                placeholder="51"
                            />
                        </div>

                        <div className="award__field">
                            <div className="award__label">Дней в КП за квартал</div>
                            <input
                                className="award__input"
                                value={ daysInPath }
                                onChange={ (e) => setDaysInPath(e.target.value) }
                                inputMode="numeric"
                                placeholder="60"
                            />
                        </div>
                    </div>

                    <div className="award__result">
                        <div className={ `award__pill ${eligibility.ok ? 'award__pill--ok' : 'award__pill--bad'}` }>
                            Выплата возможна: <b>{ eligibility.ok ? 'да' : 'нет' }</b>
                        </div>

                        <div className="award__muted">
                            Проверка условий: штат = <b>{ inStaff ? 'да' : 'нет' }</b>, включение = <b>{ formatMoney(eligibility.pct) }%</b> (нужно ≥ 51%),
                            дней = <b>{ formatMoney(eligibility.days) }</b> (нужно ≥ 60).
                        </div>

                        <div>
                            <div className="award__label">Расчётная премия (без ПФР, при H=1 и Оценка=1)</div>
                            <div className="award__bigNumber">{ formatMoney(premium) } ₽</div>
                        </div>

                        <div className="award__muted">
                            ⚠️ Важно: НДФЛ в расчёт не включён — при необходимости учтите его самостоятельно.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

