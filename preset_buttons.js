/********************************************************
Copyright (c) 2023 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
               https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.

*********************************************************

 * Author(s):               Gerardo Chaves
 *                          Technical Solutions Architect
 *                          Cisco Systems
 *                          gchaves@cisco.com
 * 
 * 
 * Released: September 14, 2023
 * 
 * Version 1.0.0
 * 
 * Description: 
 *    - Implements custom panel buttons for camera presets
 * 
 * Tested Devices
 *     - Codec EQ
 *     - Codec Pro
*/

import xapi from 'xapi';


let presetActionButtonsMap = {}
let camerasConnectorMap = {}

async function init() {
  console.log({ Message: `Intializing Macro [${_main_macro_name()}...]` })
  await buildUI()
  await StartSubscriptions()

  console.log({ Message: `Macro [${_main_macro_name()}] initialization Complete!` })
}

xapi.on('ready', init)


//Iterates over the Subscribe Object
async function StartSubscriptions() {
  const subs = Object.getOwnPropertyNames(Subscribe);
  subs.sort();
  let mySubscriptions = [];
  subs.forEach(element => {
    Subscribe[element]();
    mySubscriptions.push(element);
    Subscribe[element] = function () {
      console.warn({ Warn: `The [${element}] subscription is already active, unable to fire it again` });
    };
  });
  console.log({ Message: 'Subscriptions Set', Details: { Total_Subs: subs.length, Active_Subs: mySubscriptions.join(', ') } });
};


//Define all Event/Status subscriptions needed for the macro
const Subscribe = {
  //Listens to Widget Actions on the Device
  WidgetAction: function () { xapi.Event.UserInterface.Extensions.Widget.Action.on(handle.Event.WidgetAction); },
  PromptResponse: function () { xapi.Event.UserInterface.Message.Prompt.Response.on(handle.Event.PromptResponse); },
  PromptClear: function () { xapi.Event.UserInterface.Message.Prompt.Cleared.on(handle.Event.PromptClear); },
  TextResponse: function () { xapi.Event.UserInterface.Message.TextInput.Response.on(handle.Event.TextResponse); },
  PanelClicked: function () { xapi.Event.UserInterface.Extensions.Panel.Clicked.on(handle.Event.PanelClicked) }
}

const handle = {
  Event: {
    PanelClicked: function (event) {
      console.log(event.PanelId)
      if (event.PanelId.includes('pre_action_button_')) {
        if (event.PanelId in presetActionButtonsMap)
          // Activate the preset that corresponds to the correct action button. 
          xapi.Command.Camera.Preset.Activate({ PresetId: parseInt(presetActionButtonsMap[event.PanelId].PresetId) });

        // switch to the corresponding video connector
        console.log(`Trying to switch to Connector ID: ${camerasConnectorMap[presetActionButtonsMap[event.PanelId].CameraId]}`)
        xapi.Command.Video.Input.SetMainVideoSource({ ConnectorId: camerasConnectorMap[presetActionButtonsMap[event.PanelId].CameraId] });


      }
      if (event.PanelId == 'monitors_select_panel') {
        MonitorSelectPrompt();
      }
    },
    TextResponse: async function (event) {
      console.log(event.FeedbackId)
    },
    PromptResponse: function (event) {
      if (event.FeedbackId.includes('CAC~CAC~MonitorSelect')) {
        switch (event.OptionId) {
          case 1: case '1':
            // set all monitors to content
            console.log({ Message: `Setting all monitors to content` })
            //Auto, Dual, DualPresentationOnly, Single, Triple , TriplePresentationOnly
            xapi.Config.Video.Monitors.set('Single');
            // Auto, First, PresentationOnly, Recorder, Second, Third
            xapi.Config.Video.Output.Connector[1].MonitorRole.set('PresentationOnly');
            xapi.Config.Video.Output.Connector[2].MonitorRole.set('PresentationOnly');
            xapi.Config.Video.Output.Connector[3].MonitorRole.set('PresentationOnly');
            break;
          case 2: case '2':
            // set all monitors to video
            console.log({ Message: `Setting all monitors to video` })
            //Auto, Dual, DualPresentationOnly, Single, Triple , TriplePresentationOnly
            xapi.Config.Video.Monitors.set('Triple');
            // Auto, First, PresentationOnly, Recorder, Second, Third
            xapi.Config.Video.Output.Connector[1].MonitorRole.set('First');
            xapi.Config.Video.Output.Connector[2].MonitorRole.set('First');
            xapi.Config.Video.Output.Connector[3].MonitorRole.set('Second');
            break;
          case 3: case '3':
            // set monitors to Normal View 1, content left
            console.log({ Message: `Setting monitors to Normal View 1` })
            //Auto, Dual, DualPresentationOnly, Single, Triple , TriplePresentationOnly
            xapi.Config.Video.Monitors.set('Triple');
            // Auto, First, PresentationOnly, Recorder, Second, Third
            xapi.Config.Video.Output.Connector[1].MonitorRole.set('Second');
            xapi.Config.Video.Output.Connector[2].MonitorRole.set('First');
            xapi.Config.Video.Output.Connector[3].MonitorRole.set('Auto');
            break;
          case 4: case '4':
            // set monitors to Normal View 2, content right
            console.log({ Message: `Setting monitors to Normal View 2` })
            //Auto, Dual, DualPresentationOnly, Single, Triple , TriplePresentationOnly
            xapi.Config.Video.Monitors.set('Triple');
            // Auto, First, PresentationOnly, Recorder, Second, Third
            xapi.Config.Video.Output.Connector[1].MonitorRole.set('First');
            xapi.Config.Video.Output.Connector[2].MonitorRole.set('Second');
            xapi.Config.Video.Output.Connector[3].MonitorRole.set('Auto');
            break;
        }
      }
    },
    PromptClear: function (event) {
      if (event.FeedbackId.includes('CAC~CAC~MonitorSelect')) {
        console.log('Prompt clear...')
      }
    },
    WidgetAction: function (event) {
      if (event.Type == 'released' || event.Type == 'pressed') {
        console.log(event.WidgetId)
      }

    }
  }
}

function delay(ms) { return new Promise(resolve => { setTimeout(resolve, ms) }) }


async function MonitorSelectPrompt() {
  console.log({ Message: `Monitor Select Options Shown` })
  await xapi.Command.UserInterface.Message.Prompt.Display({
    Title: 'Monitor Select Options',
    Text: 'Content Only: All screens show content<br>Video Only: All screens show video<br>Normal View 1: Content left<br>Normal View 2: Content right',
    FeedbackId: `CAC~CAC~MonitorSelect`,
    "Option.1": 'Content Only',
    "Option.2": 'Video Only',
    "Option.3": 'Normal View 1',
    "Option.4": 'Normal View 2',
  })
}

async function buildUI() {
  console.log({ Message: `Building UserInterface...` })

  /*
    //get video input config
    let videoInputs = (await xapi.Config.Video.Input.get()).Connector
    console.info({ Info: `Camera Inputs Identified`, CameraInputs: videoInputs })
    //remove inputs not assigned as camera
    videoInputs = videoInputs.filter((el) => { return el.InputSourceType == 'camera'; });
    console.info({ Info: `Just the ones that are cameras`, CameraInputs: videoInputs })
  */
  // map all cameras and connector ID
  let allCameras = await xapi.Status.Cameras.Camera.get()
  console.info({ Info: `All cameras`, allCameras })
  allCameras.forEach(camera => {
    camerasConnectorMap[camera.id] = parseInt(camera.DetectedConnector)
  })

  //list camera presets
  let presetList = (await xapi.Command.Camera.Preset.List())?.Preset;

  console.info({ Info: `Camera Presets Identified`, CameraPresets: presetList })

  // delete any previous camera preset action buttons
  let customPanelsList = (await xapi.Command.UserInterface.Extensions.List({ ActivityType: 'Custom' }))?.Extensions.Panel;
  //console.log(customPanelsList)

  if (customPanelsList != undefined) {
    customPanelsList.forEach(async panel => {
      if (panel.PanelId.substring(0, 18) == "pre_action_button_") {
        await xapi.Command.UserInterface.Extensions.Panel.Remove({ PanelId: panel.PanelId });
        console.log('removed previous panel: ', panel.PanelId)
      }
    })
  }


  //build camera preset action buttons
  let actionButton_xml = ``
  if (presetList != undefined) {
    presetList.forEach(async el => {
      let panelId = "pre_action_button_" + el.Name

      presetActionButtonsMap[panelId] = { PresetId: el.PresetId, CameraId: el.CameraId };

      actionButton_xml = `<Extensions>
      <Version>1.10</Version>
      <Panel>
        <Order>10</Order>
        <PanelId>${panelId}</PanelId>
        <Origin>local</Origin>
        <Location>HomeScreenAndCallControls</Location>
        <Icon>Camera</Icon>
        <Color>#008094</Color>
        <Name>${el.Name}</Name>
        <ActivityType>Custom</ActivityType>
      </Panel>
    </Extensions>`

      await xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: panelId }, actionButton_xml)
    })
  }
  actionButton_xml = `<Extensions>
        <Version>1.10</Version>
        <Panel>
          <Order>10</Order>
          <PanelId>$monitors_select_panel</PanelId>
          <Origin>local</Origin>
          <Location>HomeScreenAndCallControls</Location>
          <Icon>Tv</Icon>
          <Color>#008094</Color>
          <Name>Monitors</Name>
          <ActivityType>Custom</ActivityType>
        </Panel>
      </Extensions>`
  await xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: 'monitors_select_panel' }, actionButton_xml)
  console.log({ Message: `UserInterface Built!` })
}

