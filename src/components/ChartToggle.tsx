import React, { Component } from "react";


export class ChartToggle extends Component<{ open: boolean, onChartToggled: () => void }, {}> {

    constructor(props: any) {
        super(props);
        // bind "this" (stupid I have to do this :))
        this.onChartToggle = this.onChartToggle.bind(this);
    }

    public onChartToggle() {
        this.props.onChartToggled();
    }

    public render(): JSX.Element {
        return (
            <a className="chart-toggle" onClick={this.onChartToggle}></a>
        );
    }
}