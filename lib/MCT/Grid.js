/*
 * This file is part of Mass Control Tycoon.
 * Copyright 2013-2014 by MCT Team (see TEAM file) - All rights reserved.
 * Project page @ https://github.com/mctteam/mct
 * Author(s) Martin Kelm
 *
 * Mass Control Tycoon is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * Mass Control Tycoon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Mass Control Tycoon. If not, see <http://www.gnu.org/licenses/>.
 */

// basic grid class
// a grid is useable to store structure data with connections to layout items and structure items
// a structure item is an item which is part of the grid structure
// example interaction to event chain:
// interaction -> interaction object -> display object -> layout item -> grid node
// -> structure item -> event

MCT.Grid = function(parent, size) {
  // parent object which will be used by the grid, but not clear how yet
  this.parent = parent || null;
  if ((this.parent instanceof MCT.Planet) === false) {
    throw new Error("MCT.Grid, broken parent dependency.");
  }
  this.size = size || { width: 0, height: 0 }; // with width / height properties
  this.nodes = [];
}

MCT.Grid.prototype.constructor = MCT.Grid;

MCT.Grid.prototype.checkNode = function(node) {
  if (node.x > this.size.width) {
    throw new Error("MCT.Grid, node.x out of range.");
  }
  if (node.y > this.size.height) {
    throw new Error("MCT.Grid, node.y out of range.");
  }
  for (var i = 0; i < this.nodes.length; i++) {
    if (this.nodes[i].x == node.x && this.nodes[i].y == node.y) {
      return i;
    }
  }
  return -1;
}

MCT.Grid.prototype.addNode = function(node) {
  var nodeId = this.checkNode(node);
  if (nodeId == -1) {
    this.nodes.push(node);
    return this.nodes.length - 1;
  }
  return nodeId;
}

MCT.Grid.prototype.initNodes = function(minPoint, maxPoint, conditionFunction) {
  // init nodes in a specific coordinates area
  if (typeof conditionFunction == "undefined") {
    conditionFunction = false;
  }
  var nodeIds = [];
  for (var x = minPoint.x; x < maxPoint.x; x++) {
    for (var y = minPoint.y; y < maxPoint.y; y++) {
      if (conditionFunction === false || conditionFunction(x, y)) {
        nodeIds.push(this.addNode( { x : x, y : y } ));
      }
    }
  }
  return nodeIds;
}