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

// display ui panel window class
// a windos is a base panel and can contain layer panels

MCT.DisplayUIPanelWindow = function(name, options, jsonHandle, noInitialize) {
  MCT.DisplayUIPanel.call(
    this, name || "window" + (Math.random() * 1000), options.unitSize, options.position
  );
  this.config = mct.util.loadJSON("./lib/data/display/window/" + jsonHandle + ".json", true);
  this.dynTexts = options.dynTexts || {};
  this.frameId = this.layout.addFrame({ color: this.config.color, padding: this.config.padding });
  this.addEventListener('click', mct.util.getEventListener(this, "handleEvent"));

  if (noInitialize !== true) {
    this.initialize();
  }
}

MCT.DisplayUIPanelWindow.prototype = Object.create(MCT.DisplayUIPanel.prototype);
MCT.DisplayUIPanelWindow.prototype.constructor = MCT.DisplayUIPanelWindow;

MCT.DisplayUIPanelWindow.prototype.getDynText = function(text) {
  if (typeof text == "string") {
    text = this.dynTexts[text] || text;
  } else if (typeof text == "object" && text.length > 0) {
    for (var i = 0; i < text.length; i++) {
      text[i] = this.dynTexts[text[i]] || text[i];
    }
  }
  return text;
}

MCT.DisplayUIPanelWindow.prototype.initialize = function() {
  for (var i = 0; i < this.config.layers.length; i++) {
    this.initializeLayer(i);
    this.setLayerVisibility(i);
  }
  this.layout.calculate(this.frameId);
}

MCT.DisplayUIPanelWindow.prototype.setLayerVisibility = function(layerId, visible) {
  if (typeof visible != "boolean") {
    visible = this.config.layers[layerId].visible;
  } else if (visible === true) {
    this.config.layers[layerId].visible = true;
  }
  this.setTitles(layerId, !visible);
  this.setMenus(layerId, !visible);
  this.setContents(layerId, !visible);
  if (visible === false) {
    this.config.layers[layerId].visible = false;
  }
}

// initialize panel layout by using layer configuration
MCT.DisplayUIPanelWindow.prototype.initializeLayer = function(layerId) {

  var layer = this.config.layers[layerId];
  layer.visible = Boolean(layer.visible);

  if (typeof layer.actionStatus == "undefined") {
    // action status contains all action status of source/previous layers in an interaction chain
    // and the action parameter set of the last layer change interaction
    layer.actionStatus = [];
  }

  if (typeof layer.titles == "object" && layer.titles.length > 0) {
    for (var i = 0; i < layer.titles.length; i++) {
      if (typeof layer.titles[i].partName == "undefined") {
        layer.titles[i].partName = this.layout.addPart({ x: 0, y: 0, anchor: true, zindex: 1 });
        this.layout.addPartOptions(
          layer.titles[i].partName,
          { location: "top", align: layer.titles[i].align || "left",
             visible: layer.visible, frameId: this.frameId, padding: layer.titles[i].padding || {}  }
        );
      } else {
        this.layout.parts[layer.titles[i].partName].visible = layer.visible;
      }
    }
  }
  if (typeof layer.menus == "object" && layer.menus.length > 0) {
    for (var i = 0; i < layer.menus.length; i++) {
      if (typeof layer.menus[i].partName == "undefined") {
        layer.menus[i].partName = this.layout.addPart({ x: 0, y: 0, anchor: true, zindex: 1 });
        this.layout.addPartOptions(
          layer.menus[i].partName,
          { location: layer.menus[i].location || "top", align: layer.menus[i].align || "left",
            visible: layer.visible, frameId: this.frameId, padding: layer.menus[i].padding || {} }
        );
      } else {
        this.layout.parts[layer.menus[i].partName].visible = layer.visible;
      }
    }
  }
  if (typeof layer.contents == "object" && layer.contents.length > 0) {
    for (var i = 0; i < layer.contents.length; i++) {
      if (typeof layer.contents[i].partName == "undefined") {
        layer.contents[i].partName = this.layout.addPart({ x: 0, y: 0, anchor: true, zindex: 1 });
        this.layout.addPartOptions(
          layer.contents[i].partName,
          { location: layer.contents[i].location || "top", align: layer.contents[i].align || "left",
            visible: layer.visible, frameId: this.frameId, padding: layer.contents[i].padding || {} }
        );
      } else {
        this.layout.parts[layer.contents[i].partName].visible = layer.visible;
      }
    }
  }

}

// sets title display objects for all visible layers to layout parts
MCT.DisplayUIPanelWindow.prototype.setTitles = function(layerId, remove) {
  var layer = this.config.layers[layerId], pn = "";

  if (layer.visible === true) {
    if (typeof layer.titles == "object" && layer.titles.length > 0) {
      for (var i = 0; i < layer.titles.length; i++) {
        pn = layer.titles[i].partName;
        if (!(this.layout.parts[pn].displayObject instanceof MCT.DisplayObject)) {
          this.layout.addDisplayObjectToPart(
            pn, "layer"+layerId+"title"+i, "text",
            { style: layer.titles[i].textStyle, value: this.getDynText(layer.titles[i].text), anchor: {x: 0, y: 0} }
          );
        } else if (remove === true) {
          this.layout.removeDisplayObjectFromPart(pn);
        }
      }
    }
  }
}

// sets menu display objects for all visible layers to layout parts
MCT.DisplayUIPanelWindow.prototype.setMenus = function(layerId, remove) {
  var layer = this.config.layers[layerId], pn = "";

  if (layer.visible === true) {
    if (typeof layer.menus == "object" && layer.menus.length > 0) {
      for (var i = 0; i < layer.menus.length; i++) {

        pn = layer.menus[i].partName;
        if (!(this.layout.parts[pn].displayObject instanceof MCT.DisplayObject)) {
          var buttons = layer.menus[i].buttons.slice(0);
          // search for dynamic button contents and convert them to button definition entries
          for (var j = 0; j < buttons.length; j++) {
            if (typeof buttons[j].content == "string") {
              this.dispatchEvent(
                { type: "windowMenuContent",
                  content: { buttons: buttons, position: j, currentActionStatus: layer.actionStatus }
                }
              );
            }
          }

          // prepare options and set single button or button group
          var buttonGroupOptions = [];
          for (var j = 0; j < buttons.length; j++) {
            buttonGroupOptions.push(
              {
                interaction : {
                  type: "click", element: this,
                  content: { layerId: layerId, type: 'menus', position: i, action: buttons[j].action }
                },
                text : {
                  style: layer.menus[i].textStyle, value: this.getDynText(buttons[j].text),
                  borderSize : { vertical: 0.2 }
                }
              }
            );
          }
          var objectType = (buttons.length == 1) ? "button" : "buttonGroup";
          this.layout.addDisplayObjectToPart(
            pn, "layer"+layerId+"menu"+i+objectType, objectType,
            (buttons.length == 1) ? buttonGroupOptions[0] : buttonGroupOptions
          );
        } else if (remove === true) {
          this.layout.removeDisplayObjectFromPart(pn);
        }
      }
    }
  }
}

// sets title display objects for all visible layers to layout parts
MCT.DisplayUIPanelWindow.prototype.setContents = function(layerId, remove) {
  var layer = this.config.layers[layerId], pn = "";

  if (layer.visible === true) {
    if (typeof layer.contents == "object" && layer.contents.length > 0) {
      for (var i = 0; i < layer.contents.length; i++) {
        pn = layer.contents[i].partName;
        if (!(this.layout.parts[pn].displayObject instanceof MCT.DisplayObject)) {

          if (typeof layer.contents[i].text != "undefined") {
            this.layout.addDisplayObjectToPart(
              pn, "layer"+layerId+"content"+i, "text",
              { style: layer.contents[i].textStyle, value: this.getDynText(layer.contents[i].text), anchor: {x: 0, y: 0} }
            );
          } else if (typeof layer.contents[i].list != "undefined") {
            var list = {};
            $.extend(list, layer.contents[i].list);
            if (typeof list.content == "string") {
              this.dispatchEvent(
                { type: "windowMainContent",
                  content: { list: list, currentActionStatus: layer.actionStatus }
                }
              );
            }
            // todo add list display object
          }
        } else if (remove === true) {
          this.layout.removeDisplayObjectFromPart(pn);
        }
      }
    }
  }
}

MCT.DisplayUIPanelWindow.prototype.handleEvent = function(scope, event) {
  if (typeof event.content.action != "undefined") {
    if (typeof event.content.action == "string") {
      event.content.action = [ event.content.action ];
    }
    switch (event.content.action[0]) {
      case "windowClose":
        mct.audioHandler.playEffect("ef.click1");
        scope.layout.setVisibility(false);
        mct.sceneHandler.update();
        break;
      case "windowLayerShow":
        if (event.content.action[1] != "undefined") {
          var targetLayerId = event.content.action[1];

          if (this.config.layers[targetLayerId].actionStatus.length > 0) {
            // hide layer to reset contents
            scope.setLayerVisibility(targetLayerId, false);
          }

          // load layer status from previous layer and/or set action status to next layer
          this.config.layers[targetLayerId].actionStatus =
            (typeof scope.config.layers[event.content.layerId].actionStatus != "undefined") ?
              scope.config.layers[event.content.layerId].actionStatus.slice(0) : [];

          var currentActionStatus = [event.content.layerId, targetLayerId];
          if (event.content.action.length > 2) {
            for (var i = 2; i < event.content.action.length; i++) {
              currentActionStatus.push(
                event.content.action[i]
              );
            }
          }
          scope.config.layers[targetLayerId].actionStatus.push(currentActionStatus);
          scope.config.layers[targetLayerId].visible = true;

          // remove layers contents which are not part of the current action status layers
          var statusLayerIds = [];
          for (var i = 0; i < scope.config.layers[targetLayerId].actionStatus.length; i++) {
            if (statusLayerIds.indexOf(scope.config.layers[targetLayerId].actionStatus[i][0]) == -1) {
              statusLayerIds.push(scope.config.layers[targetLayerId].actionStatus[i][0]);
            }
            if (statusLayerIds.indexOf(scope.config.layers[targetLayerId].actionStatus[i][1]) == -1) {
              statusLayerIds.push(scope.config.layers[targetLayerId].actionStatus[i][1]);
            }
          }
          if (statusLayerIds.length > 0) {
            for (var i = 0; i < scope.config.layers.length; i++) {
              if (statusLayerIds.indexOf(i) == -1) {
                scope.setLayerVisibility(i, false);
              }
            }
          }

          mct.audioHandler.playEffect("ef.click1");
          scope.initialize();
        }
        break;
    }
  }
}