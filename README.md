# chromecast-redirect (Chrome sender)

This Google Cast sender implements two buttons using the Cast Application Framework (CAF).

## Use case
 1. Using a Chromecast button mock up to redirect to the page we actually want to cast 
 2. Starting a cast tab session utilizing a real Chromecast button

## Implementations
* _redirect-button_: Chromecast button unable to cast; Intended usage: redirecting to the page
* _cast-button_: Chromecast button able to cast; Intended usage: casting the page via cast tab
* _redirect-cast-example_: Implementation showcasing a solution to the specified use case using both buttons

## Setup Instructions

### Pre-requisites
 1. Chromecast device
 2. Chrome browser
 3. Server for hosting

### Steps:
 1. Choose an implementation and put the contents on your own server
 2. Point to the page in Chrome browser
 3. Assuming you have a Chromcast device in the network: Click the button  
 __Important__: Without a Chromecast device in your network the buttons won't show

## Known Issues
* __(Testing hotfix)__ _cast-button_: Opening the page while in a Cast session (e.g. already casting the tab) will start an automated media cast, displaying nothing. This needs for one to restart the tab cast.
* Buttons may not show or go

## API Documentation
* Cast APIs: http://developers.google.com/cast/docs/chrome_sender_integrate