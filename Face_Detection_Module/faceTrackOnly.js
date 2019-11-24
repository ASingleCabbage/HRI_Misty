_currentBearing = 0;
_currentElevation = 0;
// _timeoutSeconds = 0;
// misty.Set("currentBearing", 0, false);
// misty.Set("currentElevation", 0, false);
misty.Set("timeoutSeconds", 5, false);



misty.RegisterEvent("FaceTrack", "FaceRecognition", 120, true, "Synchronous");
misty.RegisterTimerEvent("FaceTrackTimeout", 1000, true);

//reset
misty.DisplayImage("e_DefaultContent.jpg");
misty.MoveArms(90, 90, 100, 100);
misty.MoveHeadDegrees(0, 0, 0, 100, 0, 0);
misty.ChangeLED(0, 0, 0);

misty.StartFaceDetection();

// head movement range
// pitch - 40(up) to 26(down)
// roll - 40(left) to 40(right)
// yaw - 81(right) to 81(left)

// FaceDetection event callback
function _FaceTrack(data) {
    misty.ChangeLED(5, 5, 5);

    misty.Set("timeoutSeconds", 5, false);

    // var _currentBearing = misty.Get("currentBearing")
    // var _currentElevation = misty.Get("currentElevation")

    var faceTrack = data.PropertyTestResults[0].PropertyParent;
    misty.Debug("Face Detected, " + JSON.stringify(faceTrack));
    misty.Debug("Face Detected, at bearing " + faceTrack.Bearing + " and elevation " + faceTrack.Elevation);


    if (faceTrack.Distance > 200) {
        misty.Debug("Beyond recognition distance; ignored");
        misty.ChangeLED(0, 0, 0);

        return;
    }

    if (Math.abs(faceTrack.Bearing) > 5 && Math.abs(faceTrack.Elevation) > 5) {
        misty.ChangeLED(0, 0, 0);

        return;
    }

    if (Math.abs(faceTrack.Bearing) > 5) {
        _currentBearing += faceTrack.Bearing;
    }

    if (Math.abs(faceTrack.Elevation) > 5) {
        _currentElevation += faceTrack.Elevation;
    }

    if (_currentBearing > 60) {
        _currentBearing = 60;
    } else if (_currentBearing < -60) {
        _currentBearing = -60;
    }

    if (_currentElevation > 10) {
        _currentElevation = 10;
    } else if (_currentElevation < -26) {
        _currentElevation = -26;
    }

    misty.Debug("Final elevation and bearing: " + _currentElevation + " " + _currentBearing);
    misty.MoveHead(_currentElevation, 0, _currentBearing, 100, 0 , 10);
    misty.ChangeLED(0, 0, 0);

};

// FaceDetectionTimeout callback
function _FaceTrackTimeout() {
    misty.Set("timeoutSeconds", misty.Get("timeoutSeconds") - 1, false);
    if (misty.Get("timeoutSeconds") <= 0){
        misty.Set("timeoutSeconds", 5, false);
        misty.Debug("face detection timeout called, it's taking too long...");
        misty.MoveHeadDegrees(0, 0, 0, 100, 0, 0);
    }
};