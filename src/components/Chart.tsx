/* Copyright 2018 Jan Kaiser */

import React, { Component, RefObject } from 'react';
import * as n3 from 'n3';
import * as d3 from 'd3';
import { N3Error } from '../models/N3Error.model';

export interface Graph {
    nodes: Array<any>;
    links: Array<any>;
}

export class Chart extends Component<
    { config: { triples?: Array<n3.Quad>, error?: N3Error } },
    { graph?: Graph, error?: N3Error }
    > {

    private _chartElement: RefObject<HTMLDivElement>;
    private _svg: d3.Selection<SVGSVGElement, {}, HTMLElement, any> | null = null;

    // initial state before we get some from the App component
    public state: { graph?: Graph, error?: N3Error } = { graph: { nodes: [], links: [] } };

    constructor(props: any) {
        super(props);
        this._chartElement = React.createRef();
    }

    public triplesToGraph(triples: Array<n3.Quad>): void {

        if (this.props.config.error) {
            console.error('has error...');
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

    public setChart(graph: Graph): void {
        if (this._svg === null) {
            return;
        }
        this._svg.html('');
        // ==================== Add Marker ====================
        this._svg.append('svg:defs');

        // ==================== Add Links ====================
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

        // ==================== Add Node =====================
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

        // ==================== Add Arrows ====================
        const arrows = this._svg.selectAll('.arrow')
            .data(graph.links)
            .enter()
            .append('polygon')
            .attr('class', 'chart__arrow')
            .attr('id', (d, i) => 'link-arrow-' + i);

        // ==================== Add Link Names =====================
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

        // ==================== Add Node Names =====================
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

        // ==================== Force ====================
        force.on('tick', () => {
            nodes
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            arrows
                .attr('points', '-5,0 0,5 0,-5')
                .attr('style', d => {
                    // some trigonometry magic to position and rotate stuff (TODO: refactor!)
                    const angle = this.angle(d.target.x, d.target.y, d.source.x, d.source.y);
                    const angleDeg = angle * 180 / Math.PI;
                    const plusX = Math.cos(angle) * 16;
                    const plusY = Math.sin(angle) * 16;
                    let style = 'transform: translate(' + (d.target.x + plusX) + 'px, ' + (d.target.y + plusY) + 'px) ';
                    style += 'rotate(' + angleDeg + 'deg);';
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

    public componentDidUpdate(nextProps: { config: { triples: Array<n3.Quad>, error?: N3Error } }): void {
        if (nextProps.config) {
            this.triplesToGraph(nextProps.config.triples);
        }
    }

    public componentDidMount(): void {
        this._svg = d3.select('#svg-container').append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        // initial chart draw
        if (this.props.config.triples) {
            this.triplesToGraph(this.props.config.triples);
        }
    }

    public render(): JSX.Element {
        return (
            <div className='chart' id='svg-container' ref={this._chartElement}>
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
}
