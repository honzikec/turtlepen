import React, { Component } from 'react';
import * as n3 from 'n3';
import * as d3 from 'd3';


export interface IGraph {
    nodes: Array<any>;
    links: Array<any>;
}

export class Chart extends Component<{ triples?: Array<n3.Quad> }, { graph?: IGraph }> {

    private svg: d3.Selection<SVGSVGElement, {}, HTMLElement, any> | null = null;

    private findNode(graph: IGraph, id: string): any {
        return graph.nodes.find(n => n.id === id);
    }

    triplesToGraph(triples: Array<n3.Quad>): void {

        //Graph
        let graph: IGraph = { nodes: [], links: [] };

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

        this.setState({ graph: graph }, () => {
            this.setChart();
        });

    }

    setChart() {
        if (this.svg === null || !this.state || !this.state.graph) {
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
            .data(this.state.graph.links)
            .enter()
            .append("line")
            .attr("marker-end", "url(#end)")
            .attr("class", "link")
            .attr("stroke-width", 1);

        // ==================== Add Link Names =====================
        let linkTexts = this.svg.selectAll(".link-text")
            .data(this.state.graph.links)
            .enter()
            .append("text")
            .attr("class", "link-text")
            .text(function (d) { return d.predicate; });

        // ==================== Add Link Names =====================
        let nodeTexts = this.svg.selectAll(".node-text")
            .data(this.state.graph.nodes)
            .enter()
            .append("text")
            .attr("class", "node-text")
            .text(function (d) { return d.label; });

        // ==================== Add Node =====================
        let nodes = this.svg.selectAll(".node")
            .data(this.state.graph.nodes)
            .enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 10);

        let force = d3
            .forceSimulation()
            .nodes(this.state.graph.nodes)
            .force("link", d3.forceLink())
            .force("charge", d3.forceManyBody().strength(-5))
            .force("center", d3.forceCenter(800 / 2, 600 / 2));

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

    componentWillReceiveProps(nextProps: { triples?: Array<n3.Quad> }) {
        if (nextProps.triples) {
            this.triplesToGraph(nextProps.triples);
        }
    }

    componentDidMount() {
        this.svg = d3.select("#svg-container").append("svg")
            .attr("width", 800)
            .attr("height", 600);
    }

    render() {
        return (
            <div id="svg-container"></div>
        );
    }
}