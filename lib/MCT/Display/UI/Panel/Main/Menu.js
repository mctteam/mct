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

// ui menu panel element

MCT.DisplayUIPanelMainMenu = function() {
  MCT.DisplayUIPanel.call(this, "menu");

  // add background planets
  var partOptions = { x : this.grid.size.width - 1, y : this.grid.size.height - 1, anchor : true };
  var partName = this.layout.addPart(partOptions);
  this.layout.addDisplayObjectToPart(partName, "menuBgPlanet1", 'image', { image: "mct_planet" });
  var partOptions = { x : 0, y : 0, anchor : true };
  var partName = this.layout.addPart(partOptions);
  this.layout.addDisplayObjectToPart(partName, "menuBgPlanet2", 'image', { image: "mct_planet" });

  // add menu logo part
  var partOptions = {
    x : this.grid.size.width / 2,
    y : (this.grid.size.height / 2) - (this.grid.size.height * 0.05),
    anchor : true
  }
  var partName = this.layout.addPart(partOptions);
  this.layout.addDisplayObjectToPart(partName, "menuLogo", 'image', { image: "mct_logo" });

   // add game title text part
  var partOptions = {
    x : this.grid.size.width / 2,
    y : (this.grid.size.height / 2) - (this.grid.size.height * 0.3),
    anchor : true
  }
  var partName = this.layout.addPart(partOptions);
  this.layout.addDisplayObjectToPart(
    partName, "menuGameTitle", 'text', { value: "lt.menuGameTitle", style: "gametitle1" }
  );

  // add start button part
  var partOptions = {
    x : (this.grid.size.width / 2) - (this.grid.size.width * 0.15),
    y : (this.grid.size.height / 2) + (this.grid.size.height * 0.2),
    anchor : true
  }
  var partName = this.layout.addPart(partOptions);
  this.layout.addDisplayObjectToPart(
    partName, "menuButtonStart", 'button',
    { image: "mct_menu_button",
      interaction : { type: "click", element: this, content: { action: "start" } },
      text: { value: "lt.menuButtonStart", style: "menubutton1",
              borderSize : { vertical: 1, horizontal: 0.3 } }
    }
  );

  // add quit button part
  var partOptions = {
    x : (this.grid.size.width / 2) + (this.grid.size.width * 0.15),
    y : (this.grid.size.height / 2) + (this.grid.size.height * 0.2),
    anchor : true
  }
  var partName = this.layout.addPart(partOptions);
  this.layout.addDisplayObjectToPart(
    partName, "menuButtonQuit", 'button',
    { image: "mct_menu_button",
      interaction : { type: "click", element: this, content: { action: "quit" } },
      text: { value: "lt.menuButtonQuit", style: "menubutton1",
              borderSize : { vertical: 1, horizontal: 0.3 } }
    }
  );

  this.addEventListener('click', mct.util.getEventListener(this, "handleEvent"));
}

MCT.DisplayUIPanelMainMenu.prototype = Object.create(MCT.DisplayUIPanel.prototype);
MCT.DisplayUIPanelMainMenu.prototype.constructor = MCT.DisplayUIPanelMainMenu;

MCT.DisplayUIPanelMainMenu.prototype.handleEvent = function(scope, event) {
  if (typeof event.content.action != "undefined") {
    switch (event.content.action) {
      case "start":
        mct.audioHandler.playEffect("ef.click1");
        mct.sceneHandler.showScene("space");
        break;
      case "quit":
        mct.audioHandler.playEffect("ef.click1");
        mct.util.quit(500);
        break;
    }
  }
}