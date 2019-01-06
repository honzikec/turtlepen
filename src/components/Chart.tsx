import React, { Component, RefObject } from 'react';
import * as n3 from 'n3';
import * as d3 from 'd3';
import { N3Error } from '../models/N3Error.model';


export interface Graph {
    nodes: Array<any>;
    links: Array<any>;
}

export class Chart extends Component<{ config: { triples?: Array<n3.Quad>, error?: N3Error } }, { graph?: Graph, error?: N3Error }> {
    private _chartElement: RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);
        this._chartElement = React.createRef()
    }

    // initial state before we get some from the App component
    public state: { graph?: Graph, error?: N3Error } = { graph: { nodes: [], links: [] } };

    private svg: d3.Selection<SVGSVGElement, {}, HTMLElement, any> | null = null;

    private findNode(graph: Graph, id: string): any {
        return graph.nodes.find(n => n.id === id);
    }

    triplesToGraph(triples: Array<n3.Quad>): void {

        if (this.props.config.error) {
            console.error('has error...');
            return;
        }

        //Graph
        let graph: Graph = { nodes: [], links: [] };

        //Initial Graph from triples
        triples.forEach((triple) => {
            let subject = triple.subject;
            let predicate = triple.predicate;
            let object = triple.object;

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

    setChart(graph: Graph) {
        if (this.svg === null) {
            return;
        }
        this.svg.html('');
        // ==================== Add Marker ====================
        this.svg.append("svg:defs");
        this.svg.selectAll("marker")
            .data(["end"])
            .enter().append("svg:marker")
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 30)
            .attr("refY", -0.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("svg:polyline")
            .attr("points", "0,-5 10,0 0,5");

        // ==================== Add Links ====================
        let links = this.svg.selectAll(".link")
            .data(graph.links)
            .enter()
            .append("line")
            .attr("marker-end", "url(#end)")
            .attr("class", "link")
            .attr("stroke-width", 1);

        // ==================== Add Link Names =====================
        let linkTexts = this.svg.selectAll(".link-text")
            .data(graph.links)
            .enter()
            .append("text")
            .attr("class", "link-text")
            .text(function (d) { return d.predicate; });

        // ==================== Add Link Names =====================
        let nodeTexts = this.svg.selectAll(".node-text")
            .data(graph.nodes)
            .enter()
            .append("text")
            .attr("class", "node-text")
            .text(function (d) { return d.label; });

        // ==================== Add Node =====================
        let nodes = this.svg.selectAll(".node")
            .data(graph.nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 10);

        let centerTop = this._chartElement && this._chartElement.current ? this._chartElement.current.clientWidth / 2 : 400;
        let centerLeft = this._chartElement && this._chartElement.current ? this._chartElement.current.clientHeight / 2 : 300;

        let force = d3
            .forceSimulation()
            .nodes(graph.nodes)
            .force("link", d3.forceLink())
            .force("charge", d3.forceManyBody().strength(-30))
            .force("center", d3.forceCenter(centerTop, centerLeft));

        // ==================== Force ====================
        force.on("tick", function () {
            nodes
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });

            links
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            nodeTexts
                .attr("x", function (d) { return d.x + 12; })
                .attr("y", function (d) { return d.y + 3; });

            linkTexts
                .attr("x", function (d) { return 4 + (d.source.x + d.target.x) / 2; })
                .attr("y", function (d) { return 4 + (d.source.y + d.target.y) / 2; });
        });
    }

    componentDidUpdate(nextProps: { config: { triples: Array<n3.Quad>, error?: N3Error } }) {
        if (nextProps.config) {
            this.triplesToGraph(nextProps.config.triples);
        }
    }

    componentDidMount() {
        this.svg = d3.select("#svg-container").append("svg")
            .attr("width", '100%')
            .attr("height", '100%');
    }

    render() {
        return (
            <div className="chart" id="svg-container" ref={this._chartElement}>
            </div>
        );
    }
}