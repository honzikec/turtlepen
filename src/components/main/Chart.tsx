/* Copyright 2019 Jan Kaiser */

import React, { Component, RefObject } from 'react';
import ReactPanZoom from '@ajainarayanan/react-pan-zoom';
import * as n3 from 'n3';
import * as d3 from 'd3';
import { N3Error } from './../../models/N3Error.model';
import { Graph } from './../../models/Graph.model';

export class Chart extends Component<
    { config: { triples?: Array<n3.Quad>, error?: N3Error } },
    { error?: N3Error, zoom: number }
    > {

    private _chartElement: RefObject<HTMLDivElement>;
    private _svg: d3.Selection<d3.BaseType, {}, HTMLElement, any> | null = null;
    private _zoomStep = .2;

    // initial state before we get some from the App component
    public state: { error?: N3Error, zoom: number } = { zoom: 1 };

    constructor(props: any) {
        super(props);
        this._chartElement = React.createRef();

        // stupid "this" binding
        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
    }

    /**
     * Turns the n3.Quads to a d3-compatible structure
     * and calls a method to build the chart
     *
     * @param {Array<n3.Quad>} [triples]
     * @returns {void}
     * @memberof Chart
     */
    public triplesToGraph(triples?: Array<n3.Quad>): void {
        if (!triples || this.props.config.error) {
            this.resetChart();
            return;
        }

        // graph
        const graph: Graph = { nodes: [], links: [] };

        // initial Graph from triples
        triples.forEach(triple => {
            const subject = triple.subject;
            const predicate = triple.predicate;
            const object = triple.object;

            let subjNode: any = this.findNode(graph, subject.id);
            let objNode: any = this.findNode(graph, object.id);

            if (!subjNode) {
                subjNode = { id: subject.id, label: subject.value, weight: 1 };
                graph.nodes.push(subjNode);
            }

            if (objNode == null) {
                objNode = { id: object.id, label: object.value, weight: 1 };
                graph.nodes.push(objNode);
            }

            graph.links.push({ source: subjNode, target: objNode, predicate: predicate.id, weight: 1 });
        });

        this.setChart(graph);

    }

    /**
     * Resets the Chart SVG to blank
     *
     * @returns {void}
     * @memberof Chart
     */
    public resetChart(): void {
        if (this._svg === null) {
            return;
        }
        this._svg.html('');
    }

    /**
     * Builds the SVG visualisation of the TURTLE triples
     *
     * @param {Graph} graph
     * @returns {void}
     * @memberof Chart
     */
    public setChart(graph: Graph): void {
        if (this._svg === null) {
            return;
        }
        this._svg.html('');

        // Add Links
        const links = this._svg.selectAll('.chart__link')
            .data(graph.links)
            .enter()
            .append('line')
            .attr('class', 'chart__link')
            .attr('id', (d, i) => 'link-' + i)
            .on('mouseenter', (a, i) => {
                if (this._svg) {
                    this._svg.select('#link-text-' + i)
                        .attr('class', 'chart__text chart__text--hover');
                    this._svg.select('#link-arrow-' + i)
                        .attr('class', 'chart__arrow chart__arrow--hover');
                }
            })
            .on('mouseleave', (a, i) => {
                if (this._svg) {
                    this._svg.select('#link-text-' + i)
                        .attr('class', 'chart__text');
                    this._svg.select('#link-arrow-' + i)
                        .attr('class', 'chart__arrow');
                }
            })
            .attr('stroke-width', 2);

        // Add Nodes
        const nodes = this._svg.selectAll('.chart__node')
            .data(graph.nodes)
            .enter()
            .append('circle')
            .attr('class', 'chart__node')
            .on('mouseenter', (a, i) => this._svg && this._svg.select('#node-text-' + i)
                .attr('class', 'chart__text chart__text--hover'))
            .on('mouseleave', (a, i) => this._svg && this._svg.select('#node-text-' + i)
                .attr('class', 'chart__text'))
            .attr('r', 10);

        // Add Link Arrows
        const arrows = this._svg.selectAll('.arrow')
            .data(graph.links)
            .enter()
            .append('polygon')
            .attr('class', 'chart__arrow')
            .attr('id', (d, i) => 'link-arrow-' + i);

        // Add Link Texts
        const linkTexts = this._svg.selectAll('.link-text')
            .data(graph.links)
            .enter()
            .append('text')
            .attr('class', 'chart__text')
            .attr('id', (d, i) => 'link-text-' + i)
            .on('mouseenter', (a, i) => this._svg && this._svg.select('#link-text-' + i)
                .attr('class', 'chart__text chart__text--hover') && this._svg.select('#link-' + i)
                    .attr('class', 'chart__link chart__link--hover'))
            .on('mouseleave', (a, i) => this._svg && this._svg.select('#link-text-' + i)
                .attr('class', 'chart__text') && this._svg.select('#link-' + i)
                    .attr('class', 'chart__link'))
            .text(d => d.predicate);

        // Add Node Texts
        const nodeTexts = this._svg.selectAll('.node-text')
            .data(graph.nodes)
            .enter()
            .append('text')
            .attr('class', 'chart__text')
            .attr('id', (d, i) => 'node-text-' + i)
            .text(d => d.label);

        const centerTop = this._chartElement
            && this._chartElement.current ? this._chartElement.current.clientWidth / 2 : 400;
        const centerLeft = this._chartElement
            && this._chartElement.current ? this._chartElement.current.clientHeight / 2 : 300;

        const force = d3
            .forceSimulation()
            .nodes(graph.nodes)
            .force('link', d3.forceLink())
            .force('charge', d3.forceManyBody().strength(-30))
            .force('center', d3.forceCenter(centerTop, centerLeft));

        // Force
        force.on('tick', () => {
            nodes
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            arrows
                .attr('points', '-5,0 0,5 0,-5')
                .attr('style', d => {
                    // some trigonometry magic to position and rotate the arrows
                    const angle = this.angle(d.target.x, d.target.y, d.source.x, d.source.y);
                    const trf = this.getArrowTransformation(angle);
                    let style = 'transform: translate(' + (d.target.x + trf.x) + 'px, ' + (d.target.y + trf.y) + 'px) ';
                    style += 'rotate(' + angle * 180 / Math.PI + 'deg);';
                    return style;
                });

            nodeTexts
                .attr('x', d => d.x + 20)
                .attr('y', d => d.y + 5);

            linkTexts
                .attr('x', d => 8 + (d.source.x + d.target.x) / 2)
                .attr('y', d => 8 + (d.source.y + d.target.y) / 2);

            links
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

        });
    }

    /**
     * Zooms the chart in by set step
     *
     * @memberof Chart
     */
    public zoomIn(): void {
        this.setState({
            zoom: this.state.zoom + this._zoomStep
        });
    }

    /**
     * Zooms the chart out by set step
     *
     * @memberof Chart
     */
    public zoomOut(): void {
        this.setState({
            zoom: this.state.zoom - this._zoomStep
        });
    }

    public componentDidMount(): void {
        const chartEl = this && this._chartElement && this._chartElement.current || new HTMLElement();

        this._svg = d3.select('#svg')
            .attr('width', chartEl.clientWidth)
            .attr('height', chartEl.clientHeight);

        // initial chart draw
        if (this.props.config.triples) {
            this.triplesToGraph(this.props.config.triples);
        }
    }

    public componentDidUpdate(props: any): void {
        if (props.config !== this.props.config) {
            this.triplesToGraph(this.props.config.triples);
        }
    }

    public render(): JSX.Element {
        let controls: JSX.Element = <React.Fragment></React.Fragment>;

        if (this.props.config.error) {
            controls =
                <div className='chart__message'>
                    <p>
                        <span className='ico-invalid'></span><br />
                        Sorry, looks like your turtle is invalid &#9785;
                    </p>
                </div>;
        } else if (!this.props.config.triples || this.props.config.triples.length === 0) {
            controls =
                <div className='chart__message'>
                    <p>
                        <span className='ico-missing'></span><br />
                        Sorry, looks like your turtle is missing &#9785;
                    </p>
                </div>;
        } else {
            controls =
                <div className='chart__svg-controls'>
                    <button type='button' onClick={this.zoomOut} title='Zoom out'>
                        <span className='ico-zoom-out'></span>
                    </button>
                    <button type='button' onClick={this.zoomIn} title='Zoom in'>
                        <span className='ico-zoom-in'></span>
                    </button>
                </div>;
        }
        return (
            <div className='chart' id='svg-container' ref={this._chartElement}>
                <ReactPanZoom className='chart__panzoom' zoom={this.state.zoom}>
                    <svg id='svg' className='chart__svg'></svg>
                </ReactPanZoom>
                {controls}
            </div>
        );
    }

    private findNode(graph: Graph, id: string): any {
        return graph.nodes.find(n => n.id === id);
    }

    private angle(cx: number, cy: number, ex: number, ey: number): number {
        const dy = ey - cy;
        const dx = ex - cx;
        const theta = Math.atan2(dy, dx);
        return theta;
    }

    private getArrowTransformation(angle: number): { x: number, y: number } {
        return { x: Math.cos(angle) * 16, y: Math.sin(angle) * 16 };
    }
}
