import { Component, OnInit, AfterContentInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-diagrama',
  templateUrl: './diagrama.component.html',
  styleUrls: ['./diagrama.component.css']
})
export class DiagramaComponent implements OnInit, AfterContentInit {

  links = [
    { source: 'Microsoft', target: 'Amazon', type: 'licensing' },
    { source: 'Microsoft', target: 'HTC', type: 'licensing' },
    { source: 'Samsung', target: 'Apple', type: 'suit' },
    { source: 'Motorola', target: 'Apple', type: 'suit' },
    { source: 'Nokia', target: 'Apple', type: 'resolved' },
    { source: 'HTC', target: 'Apple', type: 'suit' },
    { source: 'Kodak', target: 'Apple', type: 'suit' },
    { source: 'Microsoft', target: 'Barnes & Noble', type: 'suit' },
    { source: 'Microsoft', target: 'Foxconn', type: 'suit' },
    { source: 'Oracle', target: 'Google', type: 'suit' },
    { source: 'Apple', target: 'HTC', type: 'suit' },
    { source: 'Microsoft', target: 'Inventec', type: 'suit' },
    { source: 'Samsung', target: 'Kodak', type: 'resolved' },
    { source: 'LG', target: 'Kodak', type: 'resolved' },
    { source: 'RIM', target: 'Kodak', type: 'suit' },
    { source: 'Sony', target: 'LG', type: 'suit' },
    { source: 'Kodak', target: 'LG', type: 'resolved' },
    { source: 'Apple', target: 'Nokia', type: 'resolved' },
    { source: 'Qualcomm', target: 'Nokia', type: 'resolved' },
    { source: 'Apple', target: 'Motorola', type: 'suit' },
    { source: 'Microsoft', target: 'Motorola', type: 'suit' },
    { source: 'Motorola', target: 'Microsoft', type: 'suit' },
    { source: 'Huawei', target: 'ZTE', type: 'suit' },
    { source: 'Ericsson', target: 'ZTE', type: 'suit' },
    { source: 'Kodak', target: 'Samsung', type: 'resolved' },
    { source: 'Apple', target: 'Samsung', type: 'suit' },
    { source: 'Kodak', target: 'RIM', type: 'suit' },
    { source: 'Nokia', target: 'Qualcomm', type: 'suit' }
  ];

  nodes = {};

  width = 960;
  height = 500;

  svg: any;

  force: any;

  path: any;

  circle: any;

  text: any;


  constructor() {
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    // d3.select('p').style('color', 'red');
    // ALGO

    this.links.forEach( (link) => {
      link['source'] = this.nodes[link['source']] || (this.nodes[link['source']] = { name: link['source'] });
      link['target'] = this.nodes[link['target']] || (this.nodes[link['target']] = { name: link['target'] });
    });

    this.svg = d3.select('p').append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.svg.append('defs').selectAll('marker')
      .data(['suit', 'licensing', 'resolved'])
      .enter().append('marker')
      .attr('id', function (d) { return d; })
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15)
      .attr('refY', -1.5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5');

    // this.force = d3.forceSimulation()
    //   .nodes(d3.values(this.nodes))
    //   .links(this.links)
    //   .size([this.width, this.height])
    //   .linkDistance(60)
    //   .charge(-300)
    //   .on('tick', this.tick)
    //   .start();
    this.force = d3.forceSimulation(d3.values(this.nodes))
    .force('link', d3.forceLink(this.links))
    // .size([this.width, this.height])
    // .linkDistance(60)
    // .charge(-300)
    .on('tick', this.tick);
    // .start();

    this.path = this.svg.append('g').selectAll('path')
      .data(this.force.links())
      .enter().append('path')
      .attr('class', function (d) { return 'link ' + d.type; })
      .attr('marker-end', function (d) { return 'url(#' + d.type + ')'; });

    this.circle = this.svg.append('g').selectAll('circle')
      .data(this.force.nodes())
      .enter().append('circle')
      .attr('r', 6)
      .call(this.force.drag);
    this.text = this.svg.append('g').selectAll('text')
      .data(this.force.nodes())
      .enter().append('text')
      .attr('x', 8)
      .attr('y', '.31em')
      .text(function (d) { return d.name; });

  }

  tick() {
    this.path.attr('d', this.linkArc);
    this.circle.attr('transform', this.transform);
    this.text.attr('transform', this.transform);
  }

  linkArc(d) {
    const dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
    return 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.x + ',' + d.target.y;
  }

  transform(d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  }

}
