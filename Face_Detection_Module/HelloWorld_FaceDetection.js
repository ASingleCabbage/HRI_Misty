/*
*    Copyright 2019 Misty Robotics, Inc.
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

misty.Debug("starting skill helloworld_facedetection");

// Register for face detection event
misty.RegisterEvent("SeeFace", "FaceRecognition", 250);
misty.RegisterEvent("FaceTrack", "FaceRecognition", 250, true, "Synchronous");
// Timer event cancels the skill
// if no face is detected after 15 seconds
// misty.RegisterTimerEvent("FaceDetectionTimeout", 15000);


// misty.RegisterEvent("FrontTOF", "TimeOfFlight", 100);
// //filters out sensor data from back
// misty.AddPropertyTest("FrontTOF", "SensorPosition", "!==", "Back", "string");
// //filters out triggers beyond 1.0 meters
// misty.AddPropertyTest("FrontTOF", "DistanceInMeters", "<=", 1.0, "double");

// misty.PlayAudio("s_Joy3.wav");

var currentBearing = 0;
var currentElevation = 0;

misty.MoveHeadDegrees(0, 0, 0, 100, 0, 0); 
misty.ChangeLED(0, 0, 0);

misty.StartFaceDetection();

// head movement range
// pitch - 40(up) to 26(down)
// roll - 40(left) to 40(right)
// yaw - 81(right) to 81(left)


function _SeeFace(data){
  
  misty.MoveArms(0, 0, 100, 100, null, 2000);
  misty.ChangeLED(255, 255, 255);
  misty.PlayAudio("s_Joy3.wav");
}


// FaceDetection event callback
function _FaceTrack(data) {
  misty.Debug("Face Detected");
  var faceTrack = data.PropertyTestResults[0].PropertyParent;
  misty.Debug("Face Detected, at bearing " + faceTrack.Bearing + " and elevation " + faceTrack.Elevation);
  
  currentBearing += faceTrack.Bearing;
  currentElevation += faceTrack.Elevation;
  
  if(currentBearing > 81){
    currentBearing = 81;
  }else if(currentBearing < -81){
    currentBearing = -81;
  }
  
  if(currentElevation > 40){
    currentElevation = 40;
  } else if (currentElevation < -26){
    currentElevation = -26;
  }
  
  misty.Debug("Final elevation and bearing: " + currentElevation + " " + currentBearing);
  
  misty.MoveHeadDegrees(faceTrack.Elevation, 0, faceTrack.Bearing, 100, 0, 0); 


  // Stop face detection
  // misty.StopFaceDetection();
};

// FaceDetectionTimeout callback
// function _FaceDetectionTimeout() {
//     misty.Debug("face detection timeout called, it's taking too long...");

//     // Change LED to black
//     misty.ChangeLED(0, 0, 0);
//     misty.StopFaceDetection();
// };