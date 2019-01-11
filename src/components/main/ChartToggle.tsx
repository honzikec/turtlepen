/* Copyright 2019 Jan Kaiser */

import React, { Component } from 'react';

export class ChartToggle extends Component<{ open: boolean, hasError: boolean, onChartToggled: () => void }, {}> {

    constructor(props: any) {
        super(props);
        // bind "this" (stupid I have to do this :))
        this.onChartToggle = this.onChartToggle.bind(this);
    }

    public onChartToggle() {
        this.props.onChartToggled();
    }

    public render(): JSX.Element {
        const chartToggleClass = 'chart-toggle' + (this.props.hasError ? ' chart-toggle--has-error' : '');
        return (
            <button title='Toggle Chart' className={chartToggleClass} onClick={this.onChartToggle}>
                <span className='ico-chart'></span>
            </button>
        );
    }
}
