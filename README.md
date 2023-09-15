# GVE Devnet Custom Panel Buttons for Presets Macro

Macro to implement top level custom panel buttons for invoking camera presets and a button to set various different monitor modes across 2 monitors connected to a Webex Codec Pro.

## Contacts

- Gerardo Chaves (gchaves@cisco.com)

## Solution Components

- Webex Collaboration Endpoints
- Javascript
- xAPI

## Installation/Configuration

1. Load the Javascript code included in the `preset_button.js` file in this repository into a new Macro in the Macro editor of the Cisco Webex device you wish to use.

2. Activate the macro

> If you are unfamiliar with Cisco Room device macros, [this](https://help.webex.com/en-us/np8b6m6/Use-of-Macros-with-Room-and-Desk-Devices-and-Webex-Boards) is a good article to get started.

> For some sample code to show you how to automate the deployment of this macro, wallpapers, touch 10 UI controls and others to multiple Webex devices, you can visit [this repository](https://github.com/voipnorm/CE-Deploy)

> For information on deploying the macros, you can read the [Awesome xAPI GitHub repository](https://github.com/CiscoDevNet/awesome-xapi#user-content-developer-tools). In addition to the deployment information, this repository also has tutorials for different macro uses, articles dedicated to different macro capabilities, libraries to help interacting with codecs, code samples illustrating the xAPI capabilities, and sandbox and testing resources for macro applications.

## Usage

Once the macro is running, it will discover all camera presets on the codec and create a custom action button for each on the control device (Touch 10 or Navigator). Before creating them, it will remove any previous buttons it might have created in case you removed some presets from the device so they no longer show up.

It will also create a custom action button called "Monitors" which will give you 4 choices of Monitor configuration:

- Content Only: All screens show content
- Video Only: All screens show video
- Normal View 1: Content is displayed on the left screen
- Normal View 2: Content si displayed on the right screen

# Screenshots

![/IMAGES/0image.png](/IMAGES/0image.png)

### LICENSE

Provided under Cisco Sample Code License, for details see [LICENSE](LICENSE.md)

### CODE_OF_CONDUCT

Our code of conduct is available [here](CODE_OF_CONDUCT.md)

### CONTRIBUTING

See our contributing guidelines [here](CONTRIBUTING.md)

#### DISCLAIMER:

<b>Please note:</b> This script is meant for demo purposes only. All tools/ scripts in this repo are released for use "AS IS" without any warranties of any kind, including, but not limited to their installation, use, or performance. Any use of these scripts and tools is at your own risk. There is no guarantee that they have been through thorough testing in a comparable environment and we are not responsible for any damage or data loss incurred with their use.
You are responsible for reviewing and testing any scripts you run thoroughly before use in any non-testing environment.
