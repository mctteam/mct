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

// MCT utility class

MCT.Util = function() {}

MCT.Util.prototype.constructor = MCT.Util;

MCT.Util.prototype.loadJSON = function(json) {
  return JSON.parse(require('fs').readFileSync(json, { encoding : "utf8" }));
};

MCT.Util.prototype.objectLength = function(object) {
  var size = 0, key;
  for (key in object) {
    if (object.hasOwnProperty(key)) size++;
  }
  return size;
};

MCT.Util.prototype.time = function(type, delay) {
  var div = 1;
  if (type == "unix") {
    div = 1000;
  }
  if (!delay > 0) {
    delay = 0;
  }
  var t = new Date().getTime() / div;
  if (type != "formated") {
    return Math.round(t + delay);
  } else {
    var date = new Date(t);
    return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  }
}